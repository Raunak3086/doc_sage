import React from 'react';
import './SkeletonLoader.css';

const SkeletonLoader = ({ className, count = 1, style }) => {
  const skeletons = Array.from({ length: count }, (_, i) => (
    <div key={i} className={`morphin-skeleton ${className || ''}`} style={style}>
      <div className="skeleton-glow"></div>
      <div className="skeleton-scanline"></div>
      <div className="skeleton-pulse"></div>
    </div>
  ));

  return <>{skeletons}</>;
};

export default SkeletonLoader;
