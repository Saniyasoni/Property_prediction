import { useState } from 'react';

export default function ShortlistSidebar({ items, onRemove, onClear }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-6 bottom-6 z-40 p-4 rounded-2xl bg-primary-600 text-white shadow-2xl shadow-primary-600/40 hover:bg-primary-500 hover:-translate-y-1 transition-all duration-300 group"
      >
        <div className="relative">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
          </svg>
          {items.length > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-rose-500 text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-primary-600 animate-pulse">
              {items.length}
            </span>
          )}
        </div>
      </button>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[400px] bg-surface-900 border-l border-surface-700 shadow-2xl transition-transform duration-500 ease-out transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-surface-700 flex items-center justify-between bg-surface-800/50">
            <div>
              <h3 className="text-xl font-bold text-white">Your Shortlist</h3>
              <p className="text-xs text-surface-400 mt-1">Saved properties for later review</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg hover:bg-surface-700 text-surface-400 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                <div className="p-6 rounded-full bg-surface-800 border border-surface-700">
                  <svg className="w-12 h-12 text-surface-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l5-2.5 5 2.5z" />
                  </svg>
                </div>
                <p className="text-surface-400 text-sm">No properties shortlisted yet.</p>
              </div>
            ) : (
              items.map((item) => (
                <div 
                  key={item.address} 
                  className="glass-card p-4 group hover:border-primary-500/30 transition-all duration-300"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="min-w-0">
                      <span className={`badge ${item.property_type === 'SFH' ? 'badge-blue' : 'badge-amber'} scale-75 origin-left mb-2`}>
                        {item.property_type}
                      </span>
                      <h4 className="text-white font-semibold text-sm truncate">{item.address.split(',')[0]}</h4>
                      <p className="text-xs text-surface-500 truncate mt-0.5">{item.address.split(',').slice(1).join(',').trim()}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <span className="text-primary-400 font-bold text-sm">
                          ${item.predicted_price.toLocaleString()}
                        </span>
                        <span className="text-surface-600 text-[10px]">ML Predict</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onRemove(item.address)}
                      className="p-1.5 rounded-lg text-surface-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="p-6 border-t border-surface-700 bg-surface-800/30">
              <button
                onClick={onClear}
                className="w-full py-3 rounded-xl border border-surface-600 text-surface-400 text-sm font-medium hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 transition-all"
              >
                Clear Shortlist
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
