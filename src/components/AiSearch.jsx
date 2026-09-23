import React, { useState, useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';

const PLACEHOLDER_PROMPTS = [
  'Find me a modern villa in Chennai...',
  'Show apartments under ₹50 lakhs...',
  'Luxury homes with a pool near Bangalore...',
  'Pet-friendly flats in Pune...',
  '3BHK house with garden in Kochi...',
  'Budget plots for investment in Hyderabad...',
];

const AiSearch = ({ listings, onSearchResults, resetFilters }) => {
  const [prompt, setPrompt] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [placeholderText, setPlaceholderText] = useState('');
  const [promptIndex, setPromptIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  // Typing animation for placeholder
  useEffect(() => {
    // Don't animate if user is typing or input is focused
    if (prompt || isFocused) return;

    const currentPrompt = PLACEHOLDER_PROMPTS[promptIndex];
    let timeout;

    if (!isDeleting) {
      // Typing forward
      if (charIndex < currentPrompt.length) {
        timeout = setTimeout(() => {
          setPlaceholderText(currentPrompt.slice(0, charIndex + 1));
          setCharIndex(prev => prev + 1);
        }, 60 + Math.random() * 40); // Slightly randomized for natural feel
      } else {
        // Pause at end before deleting
        timeout = setTimeout(() => setIsDeleting(true), 2000);
      }
    } else {
      // Deleting
      if (charIndex > 0) {
        timeout = setTimeout(() => {
          setPlaceholderText(currentPrompt.slice(0, charIndex - 1));
          setCharIndex(prev => prev - 1);
        }, 30);
      } else {
        // Move to next prompt
        setIsDeleting(false);
        setPromptIndex(prev => (prev + 1) % PLACEHOLDER_PROMPTS.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, promptIndex, prompt, isFocused]);

  // Reset animation when focus changes
  useEffect(() => {
    if (!isFocused && !prompt) {
      setCharIndex(0);
      setPlaceholderText('');
      setIsDeleting(false);
    }
  }, [isFocused, prompt]);

  const handleAiSearch = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsSearching(true);
    
    try {
      const searchableData = listings.map(l => ({
        id: l.id,
        title: l.title,
        price: l.price,
        location: l.location,
        type: l.propertyType,
        beds: l.bedrooms
      }));

      const response = await fetch('/api/ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, listings: searchableData })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      
      const matchedListings = listings.filter(listing => data.matchedIds.includes(listing.id));
      onSearchResults(matchedListings);

    } catch (error) {
      console.error("AI Search failed:", error);
      alert("AI Search failed. Please try again.");
    } finally {
      setIsSearching(false);
      setPrompt('');
    }
  };

  return (
    <div className="relative max-w-3xl mx-auto -mt-8 mb-16 z-20">
      <div className="bg-navy-900 rounded-full shadow-2xl p-2.5 flex items-center transition-all ring-1 ring-white/10 hover:ring-blue-500/50 focus-within:ring-blue-500/50">
        
        <div className="pl-6 pr-3 text-blue-400">
          <Sparkles size={20} className={isSearching ? "animate-spin" : "animate-pulse"} />
        </div>

        <form onSubmit={handleAiSearch} className="flex-1 flex items-center">
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent px-2 py-3 text-white placeholder-slate-400 font-light focus:outline-none text-base"
            placeholder={prompt ? '' : `Ask AI: ${placeholderText}${!isFocused && !prompt ? '|' : ''}`}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={isSearching}
          />
          {prompt && (
            <button type="button" onClick={resetFilters} className="px-4 text-xs font-medium text-slate-400 hover:text-white transition-colors">
              CLEAR
            </button>
          )}
          <button
            type="submit"
            disabled={isSearching}
            className="bg-white text-navy-950 font-semibold py-3 px-8 rounded-full hover:bg-slate-200 transition-colors disabled:opacity-50 text-sm tracking-wide"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AiSearch;