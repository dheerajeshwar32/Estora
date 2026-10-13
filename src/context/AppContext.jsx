import React, { createContext, useState, useEffect, useContext } from 'react';
import { doc, updateDoc, increment, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [compareList, setCompareList] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('estora_theme');
    return saved || 'dark';
  });

  const [savedListings, setSavedListings] = useState(() => {
    const saved = localStorage.getItem('estora_saved');
    return saved ? JSON.parse(saved) : [];
  });

  
  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'light') {
      html.classList.add('light');
    } else {
      html.classList.remove('light');
    }
    localStorage.setItem('estora_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userDocRef);
          
          if (userSnap.exists() && userSnap.data().savedListings) {
            const cloudSaved = userSnap.data().savedListings;
            
            const localSaved = JSON.parse(localStorage.getItem('estora_saved') || '[]');
            const merged = [...cloudSaved];
            localSaved.forEach(local => {
              if (!merged.some(c => c.id === local.id)) {
                merged.push(local);
              }
            });
            setSavedListings(merged);
          } else {
            
            const localSaved = JSON.parse(localStorage.getItem('estora_saved') || '[]');
            if (localSaved.length > 0) {
              await setDoc(userDocRef, { savedListings: localSaved }, { merge: true });
            }
          }
        } catch (err) {
          console.error('Failed to sync saved listings:', err);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  
  useEffect(() => {
    localStorage.setItem('estora_saved', JSON.stringify(savedListings));
    
    if (currentUser) {
      const userDocRef = doc(db, 'users', currentUser.uid);
      setDoc(userDocRef, { savedListings }, { merge: true }).catch(err => {
        console.error('Failed to sync to cloud:', err);
      });
    }
  }, [savedListings, currentUser]);

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: '', type: 'success' }), 3000);
  };

  const toggleSaved = async (property) => {
    const exists = savedListings.find(item => item.id === property.id);
    
    if (exists) {
      setSavedListings(prev => prev.filter(item => item.id !== property.id));
      showToast('Removed from saved properties', 'info');
      try {
        const listingRef = doc(db, 'listings', property.id);
        await updateDoc(listingRef, { saves: increment(-1) });
      } catch (err) { console.error('Failed to decrement saves:', err); }
    } else {
      setSavedListings(prev => [...prev, property]);
      showToast('Added to saved properties', 'success');
      try {
        const listingRef = doc(db, 'listings', property.id);
        await updateDoc(listingRef, { saves: increment(1) });
      } catch (err) { console.error('Failed to increment saves:', err); }
    }
  };

  const toggleCompare = (property) => {
    setCompareList(prev => {
      const exists = prev.some(item => item.id === property.id);
      if (exists) {
        return prev.filter(item => item.id !== property.id);
      } else {
        if (prev.length >= 3) {
          showToast('You can only compare up to 3 properties.', 'error');
          return prev;
        }
        return [...prev, property];
      }
    });
  };

  return (
    <AppContext.Provider value={{ 
      toast, showToast, 
      savedListings, toggleSaved, 
      isSavedDrawerOpen, setIsSavedDrawerOpen, 
      theme, toggleTheme,
      compareList, toggleCompare, isCompareModalOpen, setIsCompareModalOpen
    }}>
      {children}
    </AppContext.Provider>
  );
};