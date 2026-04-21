import { useState, useEffect, useRef, useCallback } from 'react';

export default function AddressInput({ onCompare, isLoading, addresses }) {
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [suggestions1, setSuggestions1] = useState([]);
  const [suggestions2, setSuggestions2] = useState([]);
  const [showSuggestions1, setShowSuggestions1] = useState(false);
  const [showSuggestions2, setShowSuggestions2] = useState(false);
  const [activeIndex1, setActiveIndex1] = useState(-1);
  const [activeIndex2, setActiveIndex2] = useState(-1);

  const ref1 = useRef(null);
  const ref2 = useRef(null);

  // Filter suggestions based on input — supports multi-word fuzzy matching
  // e.g. "dwarka" matches "...Sector 6, Dwarka, New Delhi..."
  // e.g. "DLF gurgaon" matches "...DLF Phase 1, Gurgaon..."
  const filterSuggestions = useCallback((input) => {
    if (!input.trim() || !addresses.length) return [];
    const words = input.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    // Remove common filler words for better matching
    const fillers = new Set(['in', 'at', 'near', 'with', 'the', 'a', 'an', 'for', 'of', 'on', '3bhk', '2bhk', '4bhk', '1bhk', '5bhk']);
    const searchWords = words.filter(w => !fillers.has(w));

    if (searchWords.length === 0 && words.length > 0) {
      // If only BHK-type words remain, still show something
      return addresses.slice(0, 6);
    }

    // Score each address by how many search words it contains
    const scored = addresses
      .map(addr => {
        const addrLower = addr.toLowerCase();
        const matchCount = searchWords.filter(w => addrLower.includes(w)).length;
        return { addr, matchCount };
      })
      .filter(item => item.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount);

    return scored.map(item => item.addr).slice(0, 6);
  }, [addresses]);

  useEffect(() => {
    setSuggestions1(filterSuggestions(address1));
  }, [address1, filterSuggestions]);

  useEffect(() => {
    setSuggestions2(filterSuggestions(address2));
  }, [address2, filterSuggestions]);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (ref1.current && !ref1.current.contains(e.target)) setShowSuggestions1(false);
      if (ref2.current && !ref2.current.contains(e.target)) setShowSuggestions2(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (address1.trim() && address2.trim() && !isLoading) {
      setShowSuggestions1(false);
      setShowSuggestions2(false);
      onCompare(address1.trim(), address2.trim());
    }
  };

  const handleKeyDown = (e, suggestions, activeIndex, setActiveIndex, setAddress, setShow) => {
    if (!suggestions.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      setAddress(suggestions[activeIndex]);
      setShow(false);
      setActiveIndex(-1);
    } else if (e.key === 'Escape') {
      setShow(false);
    }
  };

  const canCompare = address1.trim() && address2.trim() && !isLoading;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto" id="compare-form">
      <div className="glass-card p-8 space-y-6">
        {/* Section title */}
        <div className="text-center mb-2">
          <h2 className="text-2xl font-bold text-white mb-1">Compare Properties</h2>
          <p className="text-surface-400 text-sm">Enter two addresses to see side-by-side comparison with AI price predictions</p>
        </div>

        {/* Input fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Address 1 */}
          <div className="relative" ref={ref1}>
            <label htmlFor="address1" className="block text-xs font-medium text-surface-300 mb-2 uppercase tracking-wider">
              Property 1
            </label>
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input
                id="address1"
                type="text"
                value={address1}
                onChange={(e) => { setAddress1(e.target.value); setShowSuggestions1(true); setActiveIndex1(-1); }}
                onFocus={() => setShowSuggestions1(true)}
                onKeyDown={(e) => handleKeyDown(e, suggestions1, activeIndex1, setActiveIndex1, setAddress1, setShowSuggestions1)}
                placeholder="e.g. 3BHK flat in Dwarka or Defence Colony"
                className="input-field pl-11"
                autoComplete="off"
              />
            </div>
            {showSuggestions1 && suggestions1.length > 0 && (
              <div className="suggestions-dropdown">
                {suggestions1.map((s, i) => (
                  <div
                    key={s}
                    className={`suggestion-item ${i === activeIndex1 ? 'active' : ''}`}
                    onMouseDown={() => { setAddress1(s); setShowSuggestions1(false); }}
                    onMouseEnter={() => setActiveIndex1(i)}
                  >
                    <svg className="inline w-3.5 h-3.5 mr-2 text-surface-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {s}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Address 2 */}
          <div className="relative" ref={ref2}>
            <label htmlFor="address2" className="block text-xs font-medium text-surface-300 mb-2 uppercase tracking-wider">
              Property 2
            </label>
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input
                id="address2"
                type="text"
                value={address2}
                onChange={(e) => { setAddress2(e.target.value); setShowSuggestions2(true); setActiveIndex2(-1); }}
                onFocus={() => setShowSuggestions2(true)}
                onKeyDown={(e) => handleKeyDown(e, suggestions2, activeIndex2, setActiveIndex2, setAddress2, setShowSuggestions2)}
                placeholder="e.g. Villa DLF Phase 1 Gurgaon"
                className="input-field pl-11"
                autoComplete="off"
              />
            </div>
            {showSuggestions2 && suggestions2.length > 0 && (
              <div className="suggestions-dropdown">
                {suggestions2.map((s, i) => (
                  <div
                    key={s}
                    className={`suggestion-item ${i === activeIndex2 ? 'active' : ''}`}
                    onMouseDown={() => { setAddress2(s); setShowSuggestions2(false); }}
                    onMouseEnter={() => setActiveIndex2(i)}
                  >
                    <svg className="inline w-3.5 h-3.5 mr-2 text-surface-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {s}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Compare button */}
        <div className="flex justify-center pt-2">
          <button
            type="submit"
            id="compare-button"
            disabled={!canCompare}
            className="btn-primary flex items-center gap-2.5 text-base"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Comparing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Compare Properties
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
