import ComparisonCard from './ComparisonCard';

export default function ComparisonView({ result, shortlist, onToggleShortlist }) {
  const { property1, property2 } = result;
  const diff = Math.abs(property1.predicted_price - property2.predicted_price);

  const isShortlisted = (addr) => shortlist.some(p => p.address === addr);

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in">
      {/* Summary bar */}
      <div className="glass-card p-4 mb-6 flex flex-wrap items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2 text-surface-300">
          <svg className="w-4 h-4 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Price Difference: <span className="font-bold text-white">${diff.toLocaleString()}</span>
        </div>
        <div className="h-4 w-px bg-surface-700 hidden sm:block"></div>
        <div className="flex items-center gap-2 text-surface-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          Green = advantage
        </div>
        <div className="h-4 w-px bg-surface-700 hidden sm:block"></div>
        <div className="flex items-center gap-2 text-surface-300">
          <span className="w-3 h-0.5 bg-emerald-500 rounded"></span>
          Border = better value
        </div>
      </div>

      {/* Side-by-side cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ComparisonCard 
          property={property1} 
          otherProperty={property2} 
          index={0} 
          isShortlisted={isShortlisted(property1.address)}
          onToggleShortlist={onToggleShortlist}
        />
        <ComparisonCard 
          property={property2} 
          otherProperty={property1} 
          index={1} 
          isShortlisted={isShortlisted(property2.address)}
          onToggleShortlist={onToggleShortlist}
        />
      </div>
    </div>
  );
}
