import { useState, useEffect } from 'react';

const TriangleLoader = () => {
  const [activePoint, setActivePoint] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePoint((prev) => (prev + 1) % 3);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  const getOpacity = (pointIndex) => {
    return pointIndex === activePoint ? 1 : 0.2;
  };

  return (
    <div className="flex items-center justify-center w-24 h-24">
      <div className="relative w-12 h-12">
        {/* Top Star */}
        <div
          className="absolute left-1/2 -translate-x-1/2 top-0 text-xl transition-opacity duration-150"
          style={{ opacity: getOpacity(0) }}
        >
          ⁂
        </div>

        {/* Bottom Right Star */}
        <div
          className="absolute bottom-0 right-0 text-xl transition-opacity duration-150"
          style={{ opacity: getOpacity(1) }}
        >
          ⁂
        </div>

        {/* Bottom Left Star */}
        <div
          className="absolute bottom-0 left-0 text-xl transition-opacity duration-150"
          style={{ opacity: getOpacity(2) }}
        >
          ⁂
        </div>
      </div>
    </div>
  );
};

export default TriangleLoader;