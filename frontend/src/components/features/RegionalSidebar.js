// Updated RegionalSidebar.js with disabled state

import React from 'react';
import { getScoreColorClass } from '../../utils';

const RegionalSidebar = ({ regions, selectedRegion, onRegionSelect }) => {
  // Take only the top 6 regions based on positivity
  const topRegions = [...regions]
    .sort((a, b) => b.positivity - a.positivity)
    .slice(0, 6);

  return (
    <div className="sidebar-column">
      <div className="sidebar">
        <div className="sidebar-header" style={{ marginBottom: '-0.3rem' }}>
          <h3 className="sidebar-title">Kommer snart</h3>
        </div>
        <div className="sidebar-list">
          {topRegions.map((region) => (
            <button
              key={region.id}
              className={`sidebar-item disabled ${selectedRegion?.id === region.id ? 'active' : ''}`}
              disabled
            >
              <div className="sidebar-item-content">
                <span className="sidebar-item-label">{region.name}</span>
                <span className={getScoreColorClass(region.positivity)}>
                  +{Math.round(region.positivity * 100)}%
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RegionalSidebar;