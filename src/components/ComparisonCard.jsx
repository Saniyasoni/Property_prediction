import { useEffect, useState, useRef } from 'react';

function AnimatedPrice({ value }) {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef(null);

  useEffect(() => {
    const duration = 1200;
    const start = performance.now();
    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value]);

  return <span className="price-counter">${display.toLocaleString()}</span>;
}

function FeatureRow({ icon, label, value, isWinner, isDraw }) {
  return (
    <div className={`stat-chip ${isWinner ? 'ring-1 ring-emerald-500/30 bg-emerald-500/5' : ''}`}>
      <span className="text-base">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-surface-400">{label}</p>
        <p className={`text-sm font-semibold ${isWinner ? 'text-emerald-400' : 'text-white'}`}>{value}</p>
      </div>
    </div>
  );
}

export default function ComparisonCard({ property, otherProperty, index, isShortlisted, onToggleShortlist }) {
  const isLowerPrice = property.predicted_price < otherProperty.predicted_price;
  const isHigherPrice = property.predicted_price > otherProperty.predicted_price;
  const animClass = index === 0 ? 'animate-slide-in-left' : 'animate-slide-in-right';

  const compare = (field) => {
    const a = property[field], b = otherProperty[field];
    return { isWinner: a > b, isDraw: a === b };
  };

  const area = property.property_type === 'SFH' ? property.lot_area : property.building_area;
  const otherArea = otherProperty.property_type === 'SFH' ? otherProperty.lot_area : otherProperty.building_area;
  const areaLabel = property.property_type === 'SFH' ? 'Lot Area' : 'Building Area';

  return (
    <div className={`${animClass} flex flex-col group/card`}>
      <div className={`glass-card overflow-hidden flex flex-col h-full relative ${isLowerPrice ? 'winner-highlight' : ''}`}>
        {/* Shortlist Toggle */}
        <button
          onClick={() => onToggleShortlist(property)}
          className={`absolute top-4 right-4 z-10 p-2.5 rounded-xl border transition-all duration-300 ${
            isShortlisted 
              ? 'bg-rose-500 border-rose-400 text-white shadow-lg shadow-rose-500/40' 
              : 'bg-surface-800/80 border-surface-700 text-surface-400 hover:text-rose-400 hover:border-rose-400/50'
          }`}
          title={isShortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
        >
          <svg className={`w-5 h-5 transition-transform duration-300 ${isShortlisted ? 'scale-110' : 'group-hover/card:scale-110'}`} fill={isShortlisted ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        <div className="px-6 pt-6 pb-4 border-b border-surface-700/40">
          <div className="flex items-start gap-3 mb-3">
            <span className={property.property_type === 'SFH' ? 'badge-blue' : 'badge-amber'}>
              {property.property_type === 'SFH' ? 'Single Family Home' : 'Condominium'}
            </span>
            {isLowerPrice && <span className="badge-green">Better Value</span>}
          </div>
          <h3 className="text-white font-semibold text-base leading-tight mb-1 pr-10">
            {property.address.split(',')[0]}
          </h3>
          <p className="text-surface-400 text-sm truncate">
            {property.address.split(',').slice(1).join(',').trim()}
          </p>
        </div>

        <div className="px-6 py-5 bg-gradient-to-r from-surface-800/40 to-surface-800/20">
          <p className="text-xs text-surface-400 uppercase tracking-wider mb-1">Predicted Price</p>
          <p className={`text-3xl font-extrabold ${isLowerPrice ? 'text-emerald-400' : isHigherPrice ? 'text-rose-400' : 'text-white'}`}>
            <AnimatedPrice value={property.predicted_price} />
          </p>
          <p className="text-xs text-surface-500 mt-1">ML Model Estimate</p>
        </div>

        <div className="px-6 py-5 flex-1">
          <p className="text-xs text-surface-400 uppercase tracking-wider mb-3">Property Features</p>
          <div className="grid grid-cols-2 gap-2.5">
            <FeatureRow icon="&#x1F6CF;&#xFE0F;" label="Bedrooms" value={property.bedrooms} {...compare('bedrooms')} />
            <FeatureRow icon="&#x1F6BF;" label="Bathrooms" value={property.bathrooms} {...compare('bathrooms')} />
            <FeatureRow icon="&#x1F4D0;" label={areaLabel} value={`${area.toLocaleString()} sq ft`} isWinner={area > otherArea} isDraw={area === otherArea} />
            <FeatureRow icon="&#x1F4C5;" label="Year Built" value={property.year_built} {...compare('year_built')} />
            <FeatureRow icon="&#x1F393;" label="School Rating" value={`${property.school_rating}/10`} {...compare('school_rating')} />
            <FeatureRow icon="&#x1F3CA;" label="Pool" value={property.has_pool ? 'Yes' : 'No'} isWinner={property.has_pool && !otherProperty.has_pool} isDraw={property.has_pool === otherProperty.has_pool} />
            <FeatureRow icon="&#x1F697;" label="Garage" value={property.has_garage ? 'Yes' : 'No'} isWinner={property.has_garage && !otherProperty.has_garage} isDraw={property.has_garage === otherProperty.has_garage} />
          </div>
        </div>
      </div>
    </div>
  );
}
