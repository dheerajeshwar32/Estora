import React, { useState, useEffect, useMemo } from 'react';
import { db, storage } from '../firebaseConfig';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp, query, orderBy, limit, startAfter } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, MessageSquare, BarChart3, Eye, Heart, Loader2, X, Image as ImageIcon } from 'lucide-react';

const ALL_AMENITIES = [
  'Pool', 'Gym', 'Parking', 'Balcony', 'Garden',
  'Security', 'Power Backup', 'Elevator', 'Pet Friendly', 'Furnished'
];

const ADMIN_PAGE_SIZE = 20;

const AdminDashboard = () => {
  const { showToast } = useAppContext();
  const { user, loading, isAdmin, logout } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [listings, setListings] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('properties');
  const navigate = useNavigate();

  // Pagination for listings
  const [lastListingDoc, setLastListingDoc] = useState(null);
  const [hasMoreListings, setHasMoreListings] = useState(true);
  const [loadingMoreListings, setLoadingMoreListings] = useState(false);

  // Multi-Image Upload State
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Inquiries State
  const [inquiries, setInquiries] = useState([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);

  const emptyForm = {
    title: '', description: '', price: '', location: '',
    bedrooms: '', bathrooms: '', propertyType: 'apartment',
    existingImages: [], amenities: [], agentContact: '',
    area: '', transactionType: 'buy', status: 'available', floorPlan: ''
  };
  const [formData, setFormData] = useState(emptyForm);

  // Dynamic page title
  useEffect(() => {
    document.title = 'Admin Dashboard — Estora';
    return () => { document.title = 'Estora — Discover Premium Properties'; };
  }, []);

  const fetchListings = async (isLoadMore = false) => {
    try {
      if (isLoadMore) setLoadingMoreListings(true);

      let q;
      if (isLoadMore && lastListingDoc) {
        q = query(collection(db, 'listings'), orderBy('createdAt', 'desc'), startAfter(lastListingDoc), limit(ADMIN_PAGE_SIZE));
      } else {
        q = query(collection(db, 'listings'), orderBy('createdAt', 'desc'), limit(ADMIN_PAGE_SIZE));
      }

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

      if (snapshot.docs.length < ADMIN_PAGE_SIZE) setHasMoreListings(false);
      if (snapshot.docs.length > 0) setLastListingDoc(snapshot.docs[snapshot.docs.length - 1]);

      if (isLoadMore) {
        setListings(prev => [...prev, ...data]);
      } else {
        setListings(data);
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoadingMoreListings(false);
    }
  };

  const fetchInquiries = async () => {
    setLoadingInquiries(true);
    try {
      const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setInquiries(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    } finally {
      setLoadingInquiries(false);
    }
  };

  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  const fetchSubmissions = async () => {
    setLoadingSubmissions(true);
    try {
      const q = query(collection(db, 'property_submissions'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setSubmissions(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    } else if (!loading && user && !isAdmin) {
      navigate('/');
      showToast('Access denied. Admin only.', 'error');
    } else if (user && isAdmin) {
      fetchListings();
      fetchInquiries();
      fetchSubmissions();
    }
  }, [user, loading, isAdmin, navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const toggleAmenity = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    // Max 6 total images
    const totalAllowed = 6 - formData.existingImages.length;
    const validFiles = files.slice(0, Math.max(0, totalAllowed));
    
    if (files.length > totalAllowed) {
      showToast(`Max 6 images allowed. Only first ${totalAllowed} added.`, 'info');
    }

    setImageFiles(prev => [...prev, ...validFiles]);
    const newPreviews = validFiles.map(f => URL.createObjectURL(f));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeNewImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const removeExistingImage = (index) => {
    setFormData(prev => ({
      ...prev,
      existingImages: prev.existingImages.filter((_, i) => i !== index)
    }));
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!editingId && imageFiles.length === 0) {
      showToast('Please select at least one image to upload.', 'error');
      return;
    }

    const totalImages = formData.existingImages.length + imageFiles.length;
    if (totalImages === 0) {
      showToast('A property must have at least one image.', 'error');
      return;
    }

    setIsSubmitting(true);
    showToast(editingId ? 'Updating property...' : 'Uploading images & saving property...', 'info');
    
    try {
      let uploadedUrls = [];

      // Upload all new images in parallel
      if (imageFiles.length > 0) {
        let totalBytes = 0;
        let transferredBytes = 0;
        const progressMap = {};

        const uploadPromises = imageFiles.map((file, index) => {
          return new Promise((resolve, reject) => {
            const storageRef = ref(storage, `listings/${Date.now()}_${index}_${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
              'state_changed',
              (snapshot) => {
                progressMap[index] = { transferred: snapshot.bytesTransferred, total: snapshot.totalBytes };
                totalBytes = Object.values(progressMap).reduce((sum, p) => sum + p.total, 0);
                transferredBytes = Object.values(progressMap).reduce((sum, p) => sum + p.transferred, 0);
                setUploadProgress(totalBytes > 0 ? (transferredBytes / totalBytes) * 100 : 0);
              },
              (error) => reject(error),
              async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(downloadURL);
              }
            );
          });
        });

        uploadedUrls = await Promise.all(uploadPromises);
      }

      // Combine existing images with newly uploaded ones
      const allImages = [...formData.existingImages, ...uploadedUrls];

      const listingData = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        location: formData.location,
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        propertyType: formData.propertyType,
        images: allImages, 
        amenities: formData.amenities,
        agentContact: formData.agentContact,
        area: Number(formData.area) || 0,
        transactionType: formData.transactionType || 'buy',
        status: formData.status || 'available',
        floorPlan: formData.floorPlan || '',
      };

      if (editingId) {
        const docRef = doc(db, 'listings', editingId);
        await updateDoc(docRef, { ...listingData, updatedAt: serverTimestamp() });
        showToast('Property updated successfully!', 'success');
      } else {
        await addDoc(collection(db, 'listings'), { ...listingData, views: 0, saves: 0, createdAt: serverTimestamp() });
        showToast('Property added successfully!', 'success');
      }
      
      // Reset form
      setFormData(emptyForm);
      setEditingId(null);
      setImageFiles([]);
      imagePreviews.forEach(p => URL.revokeObjectURL(p));
      setImagePreviews([]);
      setUploadProgress(0);
      // Reset pagination and re-fetch
      setLastListingDoc(null);
      setHasMoreListings(true);
      fetchListings();

    } catch (error) {
      showToast(error.message, 'error');
      setUploadProgress(0);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproveSubmission = async (sub) => {
    if (!window.confirm("Approve this listing and publish it to the website?")) return;
    try {
      // 1. Add to listings collection
      await addDoc(collection(db, 'listings'), {
        title: sub.title,
        description: sub.description,
        price: Number(sub.price),
        location: sub.location,
        bedrooms: Number(sub.bedrooms),
        bathrooms: Number(sub.bathrooms),
        propertyType: sub.propertyType,
        amenities: sub.amenities || [],
        images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200"], // Placeholder image for approved listings
        agentContact: sub.ownerEmail || 'contact@estora.com',
        views: 0,
        saves: 0,
        createdAt: serverTimestamp()
      });

      // 2. Update status in submissions collection
      const subRef = doc(db, 'property_submissions', sub.id);
      await updateDoc(subRef, { status: 'approved', updatedAt: serverTimestamp() });
      
      showToast('Listing approved and published successfully!', 'success');
      fetchSubmissions();
      // Reset listing pagination to see new listing
      setLastListingDoc(null);
      setHasMoreListings(true);
      fetchListings();
    } catch (error) {
      showToast('Error approving submission: ' + error.message, 'error');
    }
  };

  const handleRejectSubmission = async (id) => {
    if (!window.confirm("Are you sure you want to delete this submission?")) return;
    try {
      await deleteDoc(doc(db, 'property_submissions', id));
      showToast('Submission deleted.', 'success');
      fetchSubmissions();
    } catch (error) {
      showToast('Error deleting submission: ' + error.message, 'error');
    }
  };

  const handleEdit = (listing) => {
    setFormData({
      title: listing.title || '',
      description: listing.description || '',
      price: listing.price?.toString() || '',
      location: listing.location || '',
      bedrooms: listing.bedrooms?.toString() || '',
      bathrooms: listing.bathrooms?.toString() || '',
      propertyType: listing.propertyType || 'apartment',
      amenities: listing.amenities || [],
      existingImages: listing.images || [],
      agentContact: listing.agentContact || '',
      area: listing.area?.toString() || '',
      transactionType: listing.transactionType || 'buy',
      status: listing.status || 'available',
      floorPlan: listing.floorPlan || ''
    });
    setEditingId(listing.id);
    setImageFiles([]);
    imagePreviews.forEach(p => URL.revokeObjectURL(p));
    setImagePreviews([]);
    setActiveTab('properties');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSeedData = async () => {
    if (!window.confirm("WARNING: This will delete all existing properties and seed new rich demo data. Continue?")) return;
    try {
      setIsSubmitting(true);
      
      const newProperties = [
        {
          title: "The Sapphire Valley",
          location: "Whitefield, Bangalore",
          price: 35000000,
          propertyType: "villa",
          bedrooms: 4,
          bathrooms: 5,
          agentContact: "sarah.villas@estora.com",
          amenities: ["Smart Home", "Pool", "Clubhouse", "Security", "Parking"],
          description: "Sprawling premium villas nestled in 50 acres of lush greenery, offering the perfect blend of nature and smart-home technology. Each villa features a private heated pool, Italian marble flooring, and state-of-the-art home automation. Enjoy resort-style living with a 20,000 sq ft clubhouse right at your doorstep.",
          images: [
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=1200"
          ]
        },
        {
          title: "Estora Horizon Penthouse",
          location: "Marine Drive, Mumbai",
          price: 125000000,
          propertyType: "apartment",
          bedrooms: 5,
          bathrooms: 6,
          agentContact: "mumbai.elite@estora.com",
          amenities: ["Pool", "Gym", "Security", "Parking", "Smart Home", "Spa"],
          description: "A beacon of modern luxury architecture, this ultra-luxury penthouse offers panoramic ocean views of the Arabian Sea. Features a massive wrap-around terrace, private elevator, double-height ceilings, and premium imported fittings. The building includes 24/7 concierge, infinity pool, and a private resident's spa.",
          images: [
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200"
          ]
        },
        {
          title: "Oasis Commercial Park",
          location: "Cyber City, Gurgaon",
          price: 850000000,
          propertyType: "commercial",
          bedrooms: 0,
          bathrooms: 12,
          agentContact: "commercial@estora.com",
          amenities: ["Security", "Parking"],
          description: "Grade-A commercial spaces designed for the modern enterprise, featuring LEED-certified sustainable architecture. Includes smart access control, high-speed elevators, massive underground parking, and flexible floorplates to accommodate any corporate requirement. Ready for immediate fit-outs.",
          images: [
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=1200"
          ]
        },
        {
          title: "Hillview Eco Estate",
          location: "Lonavala, Maharashtra",
          price: 22000000,
          propertyType: "house",
          bedrooms: 3,
          bathrooms: 3,
          agentContact: "retreats@estora.com",
          amenities: ["Pool", "Parking", "Clubhouse"],
          description: "Escape the city to this beautiful eco-friendly retreat home nestled in the hills of Lonavala. Features solar panels, rainwater harvesting, expansive decking, and floor-to-ceiling windows to enjoy the monsoon views. Perfect for a weekend getaway or a tranquil primary residence.",
          images: [
            "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1502672260266-1c1de2d9d06c?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80&w=1200"
          ]
        },
        {
          title: "Burj Vista Apartments",
          location: "Downtown Dubai",
          price: 185000000,
          propertyType: "apartment",
          bedrooms: 2,
          bathrooms: 3,
          agentContact: "international@estora.com",
          amenities: ["Gym", "Pool", "Security", "Parking", "Smart Home"],
          description: "Experience unparalleled luxury with direct views of the Burj Khalifa. This fully furnished premium apartment features designer interiors, smart lighting, automated curtains, and access to a massive podium deck with multiple pools and sports facilities.",
          images: [
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1200"
          ]
        },
        {
          title: "Premium Lakefront Plot",
          location: "Kodaikanal, Tamil Nadu",
          price: 12000000,
          propertyType: "plot",
          bedrooms: 0,
          bathrooms: 0,
          agentContact: "land@estora.com",
          amenities: ["Security"],
          description: "A rare opportunity to own a massive 2-acre plot directly facing the serene Kodaikanal lake. Pre-approved for residential construction with road access, electricity, and water connections already in place. Build your dream mountain mansion here.",
          images: [
            "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200"
          ]
        },
        {
          title: "The Glass House",
          location: "Banjara Hills, Hyderabad",
          price: 55000000,
          propertyType: "house",
          bedrooms: 4,
          bathrooms: 5,
          agentContact: "hyderabad@estora.com",
          amenities: ["Smart Home", "Pool", "Gym", "Security"],
          description: "An architectural masterpiece featuring wall-to-wall glass panels, minimalist design, and an indoor courtyard. Situated in the most prestigious neighborhood of Hyderabad with a private gated driveway.",
          images: [
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&q=80&w=1200"
          ]
        },
        {
          title: "Tech Park SEZ",
          location: "Electronic City, Bangalore",
          price: 450000000,
          propertyType: "commercial",
          bedrooms: 0,
          bathrooms: 20,
          agentContact: "commercial@estora.com",
          amenities: ["Security", "Parking", "Gym"],
          description: "A fully furnished 50,000 sq ft IT park space with plug-and-play workstations, multiple conference rooms, and a massive cafeteria. Perfect for scaling tech startups.",
          images: [
            "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1497215842964-222b330cefa4?auto=format&fit=crop&q=80&w=1200"
          ]
        },
        {
          title: "Sea Link View Residency",
          location: "Bandra West, Mumbai",
          price: 85000000,
          propertyType: "apartment",
          bedrooms: 3,
          bathrooms: 4,
          agentContact: "bandra@estora.com",
          amenities: ["Pool", "Gym", "Security", "Clubhouse"],
          description: "Premium 3 BHK with an unobstructed view of the Bandra-Worli Sea Link. Italian marble floors, modular kitchen, and a private balcony.",
          images: [
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1200"
          ]
        },
        {
          title: "Whispering Pines Villa",
          location: "Ooty, Tamil Nadu",
          price: 28000000,
          propertyType: "villa",
          bedrooms: 5,
          bathrooms: 5,
          agentContact: "hillstations@estora.com",
          amenities: ["Security", "Parking", "Clubhouse"],
          description: "A colonial-era heritage villa restored with modern amenities. Features a massive garden, antique fireplaces, and a private tea estate backyard.",
          images: [
            "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80&w=1200"
          ]
        },
        {
          title: "Central Plaza Retail",
          location: "Connaught Place, Delhi",
          price: 150000000,
          propertyType: "commercial",
          bedrooms: 0,
          bathrooms: 2,
          agentContact: "delhi@estora.com",
          amenities: ["Security", "Parking"],
          description: "High-footfall retail space in the heart of Delhi. Huge glass frontage, high ceilings, and pre-approved for F&B or luxury retail.",
          images: [
            "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&q=80&w=1200"
          ]
        },
        {
          title: "Golf Course Extension Plot",
          location: "Sector 65, Gurgaon",
          price: 45000000,
          propertyType: "plot",
          bedrooms: 0,
          bathrooms: 0,
          agentContact: "gurgaon@estora.com",
          amenities: ["Security", "Clubhouse", "Tennis Court"],
          description: "1000 Sq Yard corner plot in a premium gated community on Golf Course Extension Road. Facing the community park.",
          images: [
            "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200"
          ]
        },
        {
          title: "Skyline Lofts",
          location: "Koregaon Park, Pune",
          price: 32000000,
          propertyType: "apartment",
          bedrooms: 2,
          bathrooms: 2,
          agentContact: "pune@estora.com",
          amenities: ["Gym", "Pool", "Smart Home", "Security"],
          description: "New-york style luxury lofts with double height ceilings, exposed brick walls, and smart home integration. Perfect for young professionals.",
          images: [
            "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1200"
          ]
        },
        {
          title: "Royal Heritage Mansion",
          location: "Jubilee Hills, Hyderabad",
          price: 250000000,
          propertyType: "villa",
          bedrooms: 7,
          bathrooms: 9,
          agentContact: "hyderabad@estora.com",
          amenities: ["Pool", "Gym", "Spa", "Tennis Court", "Smart Home", "Security", "Parking"],
          description: "A palatial 7-bedroom mansion spread across 2 acres. Features a private home theater, temperature-controlled indoor pool, and an underground garage for 10 cars.",
          images: [
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200"
          ]
        },
        {
          title: "Marina Bay Towers",
          location: "Chennai",
          price: 42000000,
          propertyType: "apartment",
          bedrooms: 3,
          bathrooms: 3,
          agentContact: "chennai@estora.com",
          amenities: ["Pool", "Gym", "Security", "Parking"],
          description: "Sea-facing 3BHK apartments on ECR. Experience resort-style living with direct beach access, an infinity pool, and a rooftop lounge.",
          images: [
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1200"
          ]
        },
        {
          title: "The Startup Hub",
          location: "HSR Layout, Bangalore",
          price: 65000000,
          propertyType: "commercial",
          bedrooms: 0,
          bathrooms: 4,
          agentContact: "commercial@estora.com",
          amenities: ["Security", "Parking"],
          description: "A trendy, exposed-brick commercial building located in the startup capital. 10,000 sq ft across 4 floors, perfect for a mid-sized tech company.",
          images: [
            "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=1200"
          ]
        },
        {
          title: "Sunset Boulevard Plot",
          location: "Goa",
          price: 18000000,
          propertyType: "plot",
          bedrooms: 0,
          bathrooms: 0,
          agentContact: "goa@estora.com",
          amenities: ["Security"],
          description: "500 Sq Mt clear-title plot in Assagao. Surrounded by luxury villas and highly rated restaurants. Perfect for a boutique hotel or private villa.",
          images: [
            "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200"
          ]
        },
        {
          title: "The Minimalist House",
          location: "Ahmedabad, Gujarat",
          price: 21000000,
          propertyType: "house",
          bedrooms: 3,
          bathrooms: 3,
          agentContact: "ahmedabad@estora.com",
          amenities: ["Smart Home", "Security", "Parking"],
          description: "Award-winning minimalist architecture featuring exposed concrete, large skylights, and a beautiful central courtyard that keeps the house naturally cool.",
          images: [
            "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80&w=1200"
          ]
        },
        {
          title: "Platinum IT Tower",
          location: "Navi Mumbai",
          price: 750000000,
          propertyType: "commercial",
          bedrooms: 0,
          bathrooms: 30,
          agentContact: "commercial@estora.com",
          amenities: ["Security", "Parking", "Gym", "Clubhouse"],
          description: "Brand new IT tower offering 1,000,000 sq ft of Grade-A office space. Gold LEED certified, with an entire floor dedicated to amenities and food courts.",
          images: [
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1497215842964-222b330cefa4?auto=format&fit=crop&q=80&w=1200"
          ]
        },
        {
          title: "Riverside Farmhouse",
          location: "Karjat, Maharashtra",
          price: 35000000,
          propertyType: "house",
          bedrooms: 4,
          bathrooms: 4,
          agentContact: "retreats@estora.com",
          amenities: ["Pool", "Parking"],
          description: "A stunning 4-bedroom farmhouse set on 3 acres of land, right next to the river. Includes a mango orchard, private pool, and staff quarters.",
          images: [
            "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=1200"
          ]
        }
      ];

      // Delete existing
      const snapshot = await getDocs(collection(db, 'listings'));
      for (const docSnapshot of snapshot.docs) {
        await deleteDoc(doc(db, 'listings', docSnapshot.id));
      }

      // Add new
      for (const prop of newProperties) {
        let area = 0;
        if (prop.propertyType === 'apartment') area = Math.floor(Math.random() * 2000) + 800;
        else if (prop.propertyType === 'villa' || prop.propertyType === 'house') area = Math.floor(Math.random() * 5000) + 2000;
        else if (prop.propertyType === 'commercial') area = Math.floor(Math.random() * 20000) + 2000;
        else area = Math.floor(Math.random() * 10000) + 1000;

        await addDoc(collection(db, 'listings'), {
          ...prop,
          transactionType: Math.random() > 0.3 ? 'buy' : 'rent',
          status: 'available',
          area: area,
          propertyId: 'EST-' + Math.floor(Math.random() * 90000 + 10000),
          views: Math.floor(Math.random() * 500) + 100,
          saves: Math.floor(Math.random() * 50) + 10,
          createdAt: serverTimestamp()
        });
      }

      showToast('Database reset and seeded successfully!', 'success');
      setLastListingDoc(null);
      setHasMoreListings(true);
      fetchListings();
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelEdit = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setImageFiles([]);
    imagePreviews.forEach(p => URL.revokeObjectURL(p));
    setImagePreviews([]);
    setUploadProgress(0);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this listing? This action cannot be undone.")) {
      try {
        await deleteDoc(doc(db, 'listings', id));
        setListings(prev => prev.filter(l => l.id !== id));
        showToast('Listing deleted successfully.', 'success');
      } catch (error) {
        console.error("Error deleting document: ", error);
        showToast("Failed to delete the listing.", 'error');
      }
    }
  };

  const markInquiryContacted = async (inquiryId) => {
    try {
      await updateDoc(doc(db, 'inquiries', inquiryId), { status: 'contacted' });
      setInquiries(prev => prev.map(inq => inq.id === inquiryId ? { ...inq, status: 'contacted' } : inq));
      showToast('Marked as contacted.', 'success');
    } catch (error) {
      showToast('Failed to update status.', 'error');
    }
  };

  // Analytics calculations
  const analytics = useMemo(() => {
    const totalProperties = listings.length;
    const totalInquiries = inquiries.length;
    const newInquiries = inquiries.filter(i => i.status === 'new').length;
    
    let mostViewed = null;
    let mostSaved = null;
    
    listings.forEach(l => {
      if (!mostViewed || (l.views || 0) > (mostViewed.views || 0)) mostViewed = l;
      if (!mostSaved || (l.saves || 0) > (mostSaved.saves || 0)) mostSaved = l;
    });

    return { totalProperties, totalInquiries, newInquiries, mostViewed, mostSaved };
  }, [listings, inquiries]);

  if (loading) return <div className="p-10 text-center text-slate-500 mt-20 animate-pulse font-medium">Loading dashboard...</div>;
  if (!user) return null;

  const totalPreviews = formData.existingImages.length + imagePreviews.length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-white">Admin Dashboard</h1>
        <button 
          onClick={handleLogout} 
          className="px-5 py-2.5 text-xs font-bold tracking-widest uppercase text-red-400 bg-red-400/10 hover:bg-red-500/20 hover:text-red-300 rounded-full transition-colors border border-red-500/20"
        >
          Logout
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-8 bg-white/5 p-1.5 rounded-2xl border border-white/10 overflow-x-auto">
        {[
          { id: 'properties', label: 'Properties', icon: LayoutDashboard },
          { id: 'inquiries', label: 'Inquiries', icon: MessageSquare, badge: analytics.newInquiries },
          { id: 'submissions', label: 'Submissions', icon: Eye, badge: submissions.filter(s => s.status === 'new').length },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold tracking-wide transition-all ${
              activeTab === tab.id
                ? 'bg-white text-navy-950 shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
            {tab.badge > 0 && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                activeTab === tab.id ? 'bg-blue-500 text-white' : 'bg-blue-500/20 text-blue-400'
              }`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ──────────── PROPERTIES TAB ──────────── */}
      {activeTab === 'properties' && (
        <>
          {/* Add/Edit Form */}
          <div className="bg-white/5 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl mb-12">
            <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-8">
              <h2 className="text-sm font-bold tracking-widest uppercase text-slate-400">
                {editingId ? 'Edit Property' : 'Add New Property'}
              </h2>
              {editingId && (
                <button type="button" onClick={cancelEdit} className="text-xs font-bold text-slate-400 hover:text-white uppercase tracking-widest transition-colors">
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-slate-300 font-medium mb-2">Title</label>
                  <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full p-3 bg-navy-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-white outline-none transition-all" placeholder="e.g. Modern Minimalist Villa" />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-2">Location</label>
                  <input type="text" name="location" required value={formData.location} onChange={handleChange} className="w-full p-3 bg-navy-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-white outline-none transition-all" placeholder="e.g. Bangalore, Karnataka" />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-2">Price (₹)</label>
                  <input type="number" name="price" required min="0" value={formData.price} onChange={handleChange} className="w-full p-3 bg-navy-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-white outline-none transition-all" placeholder="28000000" />
                </div>
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label className="block text-slate-300 font-medium mb-2">Property Type</label>
                    <select name="propertyType" value={formData.propertyType} onChange={handleChange} className="w-full p-3 bg-navy-900 border border-white/10 rounded-xl text-white focus:border-white outline-none transition-all appearance-none">
                      <option value="apartment">Apartment</option>
                      <option value="house">House</option>
                      <option value="villa">Villa</option>
                      <option value="commercial">Commercial</option>
                      <option value="plot">Plot</option>
                    </select>
                  </div>
                  <div className="w-1/2">
                    <label className="block text-slate-300 font-medium mb-2">Area (Sq.ft)</label>
                    <input type="number" name="area" min="0" value={formData.area || ''} onChange={handleChange} className="w-full p-3 bg-navy-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-white outline-none transition-all" />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label className="block text-slate-300 font-medium mb-2">Transaction Type</label>
                    <select name="transactionType" value={formData.transactionType || 'buy'} onChange={handleChange} className="w-full p-3 bg-navy-900 border border-white/10 rounded-xl text-white focus:border-white outline-none transition-all appearance-none">
                      <option value="buy">Buy</option>
                      <option value="rent">Rent</option>
                      <option value="lease">Lease</option>
                    </select>
                  </div>
                  <div className="w-1/2">
                    <label className="block text-slate-300 font-medium mb-2">Status</label>
                    <select name="status" value={formData.status || 'available'} onChange={handleChange} className="w-full p-3 bg-navy-900 border border-white/10 rounded-xl text-white focus:border-white outline-none transition-all appearance-none">
                      <option value="available">Available</option>
                      <option value="sold">Sold / Rented</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label className="block text-slate-300 font-medium mb-2">Bedrooms</label>
                    <input type="number" name="bedrooms" disabled={formData.propertyType === 'plot' || formData.propertyType === 'commercial'} min="0" value={formData.bedrooms} onChange={handleChange} className="w-full p-3 bg-navy-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-white outline-none transition-all disabled:opacity-50" />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-slate-300 font-medium mb-2">Bathrooms</label>
                    <input type="number" name="bathrooms" disabled={formData.propertyType === 'plot'} min="0" value={formData.bathrooms} onChange={handleChange} className="w-full p-3 bg-navy-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-white outline-none transition-all disabled:opacity-50" />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label className="block text-slate-300 font-medium mb-2">Agent Contact Info</label>
                    <input type="text" name="agentContact" required value={formData.agentContact} onChange={handleChange} className="w-full p-3 bg-navy-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-white outline-none transition-all" placeholder="e.g. admin@estora.com" />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-slate-300 font-medium mb-2">Floor Plan Image URL</label>
                    <input type="text" name="floorPlan" value={formData.floorPlan || ''} onChange={handleChange} className="w-full p-3 bg-navy-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-white outline-none transition-all" placeholder="https://..." />
                  </div>
                </div>
              </div>

              {/* Amenities Picker */}
              <div>
                <label className="block text-slate-300 font-medium mb-3">Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_AMENITIES.map(amenity => (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`text-xs px-4 py-2 rounded-full border transition-all font-bold tracking-wide ${
                        formData.amenities.includes(amenity)
                          ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                      }`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Multi-Image Upload */}
              <div>
                <label className="block text-slate-300 font-medium mb-2">
                  Property Images <span className="text-slate-500 font-normal">({totalPreviews}/6 max)</span>
                </label>
                
                {/* Image Preview Grid */}
                {(formData.existingImages.length > 0 || imagePreviews.length > 0) && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-4">
                    {/* Existing images */}
                    {formData.existingImages.map((url, i) => (
                      <div key={`existing-${i}`} className="relative aspect-square rounded-xl overflow-hidden bg-navy-950 border border-white/10 group">
                        <img src={url} alt={`Existing ${i + 1}`} className="w-full h-full object-cover opacity-80" />
                        <button type="button" onClick={() => removeExistingImage(i)} className="absolute top-1 right-1 bg-red-500/80 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    {/* New upload previews */}
                    {imagePreviews.map((url, i) => (
                      <div key={`new-${i}`} className="relative aspect-square rounded-xl overflow-hidden bg-navy-950 border border-blue-500/30 group">
                        <img src={url} alt={`New ${i + 1}`} className="w-full h-full object-cover opacity-80" />
                        <div className="absolute top-1 left-1 bg-blue-500/80 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase">New</div>
                        <button type="button" onClick={() => removeNewImage(i)} className="absolute top-1 right-1 bg-red-500/80 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {totalPreviews < 6 && (
                  <input 
                    type="file" 
                    accept="image/*"
                    multiple
                    onChange={handleImageChange} 
                    className="w-full p-3 bg-navy-900 border border-white/10 rounded-xl text-white focus:border-white outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:tracking-widest file:uppercase file:bg-white/10 file:text-white file:cursor-pointer hover:file:bg-white/20" 
                  />
                )}
                
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mt-4 w-full bg-navy-950 rounded-full h-2.5 border border-white/10 overflow-hidden">
                    <div className="bg-blue-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-2">Description</label>
                <textarea name="description" required rows="4" value={formData.description} onChange={handleChange} className="w-full p-3 bg-navy-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-white outline-none transition-all resize-none" placeholder="Enter property details..."></textarea>
              </div>

              <div className="pt-4">
                <button type="submit" disabled={isSubmitting} className="w-full bg-white text-navy-950 font-bold tracking-wide py-4 px-8 rounded-full hover:bg-slate-200 transition-colors disabled:opacity-50">
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2"><Loader2 size={18} className="animate-spin" /> {editingId ? 'Updating...' : 'Publishing...'}</span>
                  ) : (
                    editingId ? 'Update Property' : 'Publish Property'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Manage Listings */}
          <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl">
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
              <h2 className="text-sm font-bold tracking-widest uppercase text-slate-400">Manage Listings</h2>
              <button 
                onClick={handleSeedData}
                disabled={isSubmitting}
                className="text-xs px-3 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors border border-red-500/30"
              >
                Factory Reset Data
              </button>
            </div>
            
            {listings.length === 0 ? (
              <div className="text-center py-8 text-slate-500 font-light">No properties found.</div>
            ) : (
              <div className="flex flex-col gap-4">
                {listings.map(listing => (
                  <div key={listing.id} className="bg-navy-900 border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-6 transition-colors hover:border-white/10">
                    
                    <div className="w-full sm:w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-navy-950 relative">
                      {listing.images?.[0] ? (
                        <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover opacity-80" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-600 font-bold uppercase text-center">No Img</div>
                      )}
                      {(listing.images?.length || 0) > 1 && (
                        <div className="absolute bottom-1 right-1 bg-navy-950/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1">
                          <ImageIcon size={8} /> {listing.images.length}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 w-full text-center sm:text-left">
                      <h3 className="text-lg font-medium text-white truncate mb-1">{listing.title}</h3>
                      <p className="text-sm text-slate-400 font-light truncate">{listing.location}</p>
                      <div className="flex items-center gap-4 mt-1 justify-center sm:justify-start">
                        <p className="text-sm text-blue-400 font-semibold">₹{listing.price.toLocaleString('en-IN')}</p>
                        <span className="flex items-center gap-1 text-[11px] text-slate-500"><Eye size={12} /> {listing.views || 0}</span>
                        <span className="flex items-center gap-1 text-[11px] text-slate-500"><Heart size={12} /> {listing.saves || 0}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
                      <button 
                        onClick={() => handleEdit(listing)}
                        className="px-4 py-2 text-xs font-bold tracking-widest uppercase text-slate-300 bg-white/5 hover:bg-white/10 hover:text-white rounded-lg transition-colors border border-white/5"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(listing.id)}
                        className="px-4 py-2 text-xs font-bold tracking-widest uppercase text-red-400 bg-red-400/10 hover:bg-red-500/20 hover:text-red-300 rounded-lg transition-colors border border-red-500/20"
                      >
                        Delete
                      </button>
                    </div>

                  </div>
                ))}

                {/* Load More */}
                {hasMoreListings && (
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={() => fetchListings(true)}
                      disabled={loadingMoreListings}
                      className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-slate-300 font-bold text-xs tracking-widest uppercase hover:bg-white/10 transition-all disabled:opacity-50"
                    >
                      {loadingMoreListings ? <><Loader2 size={14} className="animate-spin" /> Loading...</> : 'Load More'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* ──────────── INQUIRIES TAB ──────────── */}
      {activeTab === 'inquiries' && (
        <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl">
          <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
            <h2 className="text-sm font-bold tracking-widest uppercase text-slate-400">
              Buyer Inquiries ({inquiries.length})
            </h2>
            <button onClick={fetchInquiries} className="text-xs font-bold text-slate-400 hover:text-white uppercase tracking-widest transition-colors">
              Refresh
            </button>
          </div>

          {loadingInquiries ? (
            <div className="text-center py-8 text-slate-500 animate-pulse font-medium">Loading inquiries...</div>
          ) : inquiries.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare size={40} className="text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500 font-light">No inquiries yet. They'll appear here when buyers contact you.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {inquiries.map(inq => (
                <div key={inq.id} className="bg-navy-900 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-medium text-white">{inq.name}</h3>
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                          inq.status === 'new'
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                        }`}>
                          {inq.status === 'new' ? 'New' : 'Contacted'}
                        </span>
                      </div>
                      <a href={`mailto:${inq.email}`} className="text-sm text-blue-400 hover:text-blue-300 transition-colors break-all">{inq.email}</a>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 font-medium">
                        {inq.createdAt?.toDate ? inq.createdAt.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Just now'}
                      </p>
                    </div>
                  </div>

                  <p className="text-slate-300 font-light leading-relaxed mb-4 bg-navy-950/50 p-4 rounded-xl border border-white/5">"{inq.message}"</p>

                  <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div className="text-xs text-slate-500">
                      <span className="font-bold text-slate-400">Property:</span> {inq.propertyTitle || 'Unknown'} · <span className="font-bold text-slate-400">Agent:</span> {inq.agentContact || 'N/A'}
                    </div>
                    {inq.status === 'new' && (
                      <button
                        onClick={() => markInquiryContacted(inq.id)}
                        className="text-xs font-bold tracking-widest uppercase px-5 py-2 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full hover:bg-green-500/20 transition-colors"
                      >
                        Mark Contacted
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ──────────── SUBMISSIONS TAB ──────────── */}
      {activeTab === 'submissions' && (
        <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-medium text-white flex items-center gap-3">
              <Eye className="text-blue-400" />
              Property Submissions
            </h2>
            <span className="text-sm font-medium text-slate-400 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
              {submissions.length} total
            </span>
          </div>

          {loadingSubmissions ? (
            <div className="flex justify-center items-center py-20 text-slate-500">
              <Loader2 className="animate-spin w-8 h-8" />
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-20 bg-navy-950/50 rounded-2xl border border-dashed border-white/10">
              <p className="text-slate-500 font-light text-lg">No property submissions yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((sub) => (
                <div key={sub.id} className="bg-navy-900 border border-white/5 p-6 rounded-2xl flex flex-col md:flex-row justify-between gap-6 hover:border-white/10 transition-colors">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-medium text-white">{sub.title}</h3>
                      <span className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full ${
                        sub.status === 'new' 
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                          : 'bg-green-500/10 text-green-400 border border-green-500/20'
                      }`}>
                        {sub.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-slate-400">
                      <p><span className="text-slate-500">Location:</span> {sub.location}</p>
                      <p><span className="text-slate-500">Price:</span> ₹{sub.price?.toLocaleString('en-IN')}</p>
                      <p><span className="text-slate-500">Owner:</span> {sub.ownerName}</p>
                      <p><span className="text-slate-500">Phone:</span> {sub.ownerPhone}</p>
                      <p className="col-span-2 break-all"><span className="text-slate-500">Email:</span> {sub.ownerEmail || 'N/A'}</p>
                    </div>

                    <div className="pt-2">
                      <p className="text-sm text-slate-300 font-light bg-navy-950 p-4 rounded-xl border border-white/5">{sub.description || 'No description provided.'}</p>
                    </div>
                  </div>

                  <div className="flex md:flex-col gap-3 justify-start md:min-w-[140px]">
                    {sub.status === 'new' && (
                      <button 
                        onClick={() => handleApproveSubmission(sub)}
                        className="text-xs font-bold tracking-widest uppercase px-5 py-2.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20 flex-1 md:flex-none"
                      >
                        Approve
                      </button>
                    )}
                    <button 
                      onClick={() => handleRejectSubmission(sub.id)}
                      className="text-xs font-bold tracking-widest uppercase px-5 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full hover:bg-red-500/20 transition-colors flex-1 md:flex-none"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ──────────── ANALYTICS TAB (Dashboard) ──────────── */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Properties', value: analytics.totalProperties, color: 'text-blue-400' },
              { label: 'Active Listings', value: listings.filter(l => l.status === 'available').length, color: 'text-emerald-400' },
              { label: 'Sold Properties', value: listings.filter(l => l.status === 'sold').length, color: 'text-rose-400' },
              { label: 'Rental Properties', value: listings.filter(l => l.transactionType === 'rent').length, color: 'text-purple-400' },
              { label: 'Total Enquiries', value: analytics.totalInquiries, color: 'text-teal-400' },
              { label: 'Upcoming Site Visits', value: inquiries.filter(i => i.type === 'tour' && i.status === 'new').length, color: 'text-amber-400' },
              { label: 'Total Agents', value: 3, color: 'text-indigo-400' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 text-center">
                <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Inquiries Over Time Chart (CSS Only) */}
          {(() => {
            const last7Days = Array.from({length: 7}, (_, i) => {
              const d = new Date();
              d.setDate(d.getDate() - i);
              return d.toISOString().split('T')[0];
            }).reverse();
            
            const chartData = last7Days.map(dateStr => {
              const count = inquiries.filter(inq => {
                if (!inq.createdAt) return false;
                try {
                  // Firebase timestamp
                  const inqDate = inq.createdAt.toDate().toISOString().split('T')[0];
                  return inqDate === dateStr;
                } catch(e) { return false; }
              }).length;
              return { label: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' }), count };
            });
            
            const maxCount = Math.max(...chartData.map(d => d.count), 5); // Minimum scale of 5
            
            return (
              <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 mt-8">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-sm font-bold tracking-widest uppercase text-white flex items-center gap-2">
                    <BarChart3 size={16} className="text-blue-400" />
                    Inquiries Over Time (Last 7 Days)
                  </h3>
                </div>
                
                <div className="flex items-end gap-2 sm:gap-4 h-48 pt-4">
                  {chartData.map((data, i) => {
                    const heightPct = (data.count / maxCount) * 100;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                        {/* Tooltip */}
                        <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-navy-950 text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-white/10 pointer-events-none z-10 shadow-xl whitespace-nowrap">
                          {data.count} Inquiries
                        </div>
                        {/* Bar */}
                        <div 
                          className="w-full max-w-[40px] bg-blue-500/80 hover:bg-blue-400 rounded-t-lg transition-all duration-700 ease-out" 
                          style={{ height: `${Math.max(heightPct, 2)}%` }} // Minimum 2% height for visibility
                        ></div>
                        {/* Label */}
                        <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase mt-4">{data.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Most Viewed & Most Saved */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {analytics.mostViewed && (analytics.mostViewed.views || 0) > 0 && (
              <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
                <h3 className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-4 flex items-center gap-2"><Eye size={14} /> Most Viewed</h3>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-navy-950 shrink-0">
                    {analytics.mostViewed.images?.[0] && <img src={analytics.mostViewed.images[0]} alt="" className="w-full h-full object-cover opacity-80" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-medium truncate">{analytics.mostViewed.title}</p>
                    <p className="text-sm text-slate-400">{analytics.mostViewed.views || 0} views</p>
                  </div>
                </div>
              </div>
            )}

            {analytics.mostSaved && (analytics.mostSaved.saves || 0) > 0 && (
              <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
                <h3 className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-4 flex items-center gap-2"><Heart size={14} /> Most Saved</h3>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-navy-950 shrink-0">
                    {analytics.mostSaved.images?.[0] && <img src={analytics.mostSaved.images[0]} alt="" className="w-full h-full object-cover opacity-80" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-medium truncate">{analytics.mostSaved.title}</p>
                    <p className="text-sm text-slate-400">{analytics.mostSaved.saves || 0} saves</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Per-listing stats table */}
          <div className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10">
            <h3 className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-6">Listing Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th className="pb-3 text-slate-500 font-bold text-xs uppercase tracking-widest">Property</th>
                    <th className="pb-3 text-slate-500 font-bold text-xs uppercase tracking-widest text-center">Views</th>
                    <th className="pb-3 text-slate-500 font-bold text-xs uppercase tracking-widest text-center">Saves</th>
                    <th className="pb-3 text-slate-500 font-bold text-xs uppercase tracking-widest text-center">Inquiries</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map(l => (
                    <tr key={l.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 text-white font-medium truncate max-w-[200px]">{l.title}</td>
                      <td className="py-3 text-slate-300 text-center">{l.views || 0}</td>
                      <td className="py-3 text-slate-300 text-center">{l.saves || 0}</td>
                      <td className="py-3 text-slate-300 text-center">
                        {inquiries.filter(inq => inq.propertyId === l.id).length}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;