import { useState, useEffect } from 'react';
import Header from './components/Header';
import AddressInput from './components/AddressInput';
import ComparisonView from './components/ComparisonView';
import LoadingSpinner from './components/LoadingSpinner';
import ShortlistSidebar from './components/ShortlistSidebar';
import { compareProperties, fetchAddresses } from './services/api';

export default function App() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [shortlist, setShortlist] = useState(() => {
    const saved = localStorage.getItem('agent-mira-shortlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist shortlist
  useEffect(() => {
    localStorage.setItem('agent-mira-shortlist', JSON.stringify(shortlist));
  }, [shortlist]);

  // Fetch available addresses on mount
  useEffect(() => {
    fetchAddresses()
      .then(setAddresses)
      .catch((err) => console.warn('Could not fetch addresses:', err));
  }, []);

  const handleCompare = async (address1, address2) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await compareProperties(address1, address2);
      // Small delay for loading animation feel
      await new Promise((r) => setTimeout(r, 600));
      setResult(data);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShortlist = (property) => {
    setShortlist(prev => {
      const exists = prev.find(p => p.address === property.address);
      if (exists) {
        return prev.filter(p => p.address !== property.address);
      }
      return [...prev, property];
    });
  };

  const removeFromShortlist = (address) => {
    setShortlist(prev => prev.filter(p => p.address !== address));
  };

  const clearShortlist = () => {
    if (window.confirm('Are you sure you want to clear all saved properties?')) {
      setShortlist([]);
    }
  };

  return (
    <div className="min-h-screen bg-mesh text-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Hero section */}
        <section className="text-center py-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-medium mb-6">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 018-2.828A4.5 4.5 0 0118 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 01-3.744 2.582l-.019.01-.005.003h-.002a.723.723 0 01-.692 0l-.002-.001z" />
            </svg>
            Powered by Machine Learning
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            <span className="text-white">Smart Property </span>
            <span className="gradient-text">Comparison</span>
          </h2>
          <p className="text-surface-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Enter two property addresses and our ML model will predict their market value,
            then compare them feature-by-feature to help you make the right decision.
          </p>
        </section>

        {/* Input form */}
        <AddressInput
          onCompare={handleCompare}
          isLoading={isLoading}
          addresses={addresses}
        />

        {/* Error */}
        {error && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <div className="glass-card p-5 border-rose-500/30 bg-rose-500/5">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <div>
                  <p className="text-rose-400 font-semibold text-sm">Comparison Failed</p>
                  <p className="text-surface-300 text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && <LoadingSpinner />}

        {/* Results */}
        {result && !isLoading && (
          <ComparisonView 
            result={result} 
            shortlist={shortlist} 
            onToggleShortlist={toggleShortlist} 
          />
        )}

        <ShortlistSidebar 
          items={shortlist} 
          onRemove={removeFromShortlist} 
          onClear={clearShortlist} 
        />

        {/* Footer */}
        <footer className="text-center py-8 border-t border-surface-800/50">
          <p className="text-surface-500 text-xs">
            Property Prediction &bull; ML-Powered Price Predictions &bull; Case Study Project
          </p>
        </footer>
      </main>
    </div>
  );
}
