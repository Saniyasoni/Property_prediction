export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      {/* Spinner */}
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute inset-0 rounded-full border-2 border-surface-700"></div>
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary-500 animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-primary-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        <div className="absolute inset-4 rounded-full border-2 border-transparent border-t-primary-300 animate-spin" style={{ animationDuration: '2s' }}></div>
      </div>

      {/* Text */}
      <p className="text-lg font-semibold text-white mb-2">Analyzing Properties</p>
      <p className="text-sm text-surface-400">Running ML price prediction model...</p>

      {/* Animated dots */}
      <div className="flex gap-1.5 mt-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-primary-500"
            style={{
              animation: 'pulse 1.4s ease-in-out infinite',
              animationDelay: `${i * 0.2}s`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}
