import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: '', message: '' });
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    title: '', description: '', price: '', location: '',
    bedrooms: '', bathrooms: '', propertyType: 'apartment',
    imageUrl: '', agentContact: ''
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/login');
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Adding property...' });
    
    try {
      await addDoc(collection(db, 'listings'), {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        location: formData.location,
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        propertyType: formData.propertyType,
        images: [formData.imageUrl], // Using the URL directly
        agentContact: formData.agentContact,
        createdAt: serverTimestamp()
      });
      
      setStatus({ type: 'success', message: 'Property added successfully!' });
      setFormData({ title: '', description: '', price: '', location: '', bedrooms: '', bathrooms: '', propertyType: 'apartment', imageUrl: '', agentContact: '' });
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    }
  };

  if (loading) return <div className="p-10 text-center">Loading dashboard...</div>;
  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Admin Dashboard</h1>
        <button onClick={handleLogout} className="text-red-600 font-semibold hover:underline">Logout</button>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Add New Property</h2>
        
        {status.message && (
          <div className={`p-4 rounded mb-6 font-semibold ${status.type === 'success' ? 'bg-green-50 text-green-700' : status.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
              <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
              <input type="text" name="location" required value={formData.location} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Price (₹)</label>
              <input type="number" name="price" required min="0" value={formData.price} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Property Type</label>
              <select name="propertyType" value={formData.propertyType} onChange={handleChange} className="w-full p-2 border rounded bg-white">
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="plot">Plot</option>
              </select>
            </div>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Bedrooms</label>
                <input type="number" name="bedrooms" required min="0" value={formData.bedrooms} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Bathrooms</label>
                <input type="number" name="bathrooms" required min="0" value={formData.bathrooms} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Agent Contact Info</label>
              <input type="text" name="agentContact" required value={formData.agentContact} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL (from Unsplash, Google, etc.)</label>
            <input type="url" name="imageUrl" required placeholder="https://images.unsplash.com/..." value={formData.imageUrl} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea name="description" required rows="4" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded"></textarea>
          </div>

          <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded hover:bg-green-700 transition-colors">
            Publish Property
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;