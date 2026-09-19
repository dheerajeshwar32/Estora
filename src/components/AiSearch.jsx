import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const AiSearch = ({ listings, onSearchResults, resetFilters }) => {
  const [prompt, setPrompt] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleAiSearch = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsSearching(true);
    
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

      const searchableData = listings.map(l => ({
        id: l.id,
        title: l.title,
        price: l.price,
        location: l.location,
        type: l.propertyType,
        beds: l.bedrooms
      }));

      const systemInstruction = `
        You are a real estate AI assistant. 
        I will give you a list of available properties in JSON format, and a user's search prompt.
        Your job is to find the properties that best match the user's request.
        
        Properties: ${JSON.stringify(searchableData)}
        User Request: "${prompt}"

        Return ONLY a JSON array containing the string IDs of the matching properties. Do not use markdown blocks, just the raw array. Example: ["id1", "id2"]
      `;

      const result = await model.generateContent(systemInstruction);
      const responseText = result.response.text().trim();
      
      const matchedIds = JSON.parse(responseText.replace(/```json/g, '').replace(/```/g, ''));
      const matchedListings = listings.filter(listing => matchedIds.includes(listing.id));
      onSearchResults(matchedListings);

    } catch (error) {
      console.error("AI Search failed:", error);
      alert("AI Search failed. Please check your API key and try again.");
    } finally {
      setIsSearching(false);
      setPrompt('');
    }
  };

  return (
    <div className="relative max-w-3xl mx-auto -mt-8 mb-16 z-20">
      <div className="bg-[#0E172A] rounded-full shadow-2xl p-2.5 flex items-center transition-all ring-1 ring-white/10 hover:ring-blue-500/50">
        <div className="pl-6 pr-3 text-blue-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 animate-pulse">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09l2.846.813-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
        </div>
        <form onSubmit={handleAiSearch} className="flex-1 flex items-center">
          <input
            type="text"
            className="flex-1 bg-transparent px-2 py-3 text-white placeholder-slate-400 font-light focus:outline-none text-base"
            placeholder="Ask AI: Find me a modern villa in Chennai..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
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
            className="bg-white text-[#060B19] font-semibold py-3 px-8 rounded-full hover:bg-slate-200 transition-colors disabled:opacity-50 text-sm tracking-wide"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AiSearch;