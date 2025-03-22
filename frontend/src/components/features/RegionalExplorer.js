import React from 'react';
import { getScoreColorClass } from '../../utils';
import Newsletter from '../common/Newsletter';

const RegionalExplorer = ({ regions }) => {
  return (
    <div className="content-layout">
      {/* Main column - this ensures the same width and alignment as other tabs */}
      <div className="main-column">
        <div className="page-header">
          <h2 className="page-title">Utforska efter landskap</h2>
          <div className="badge">Kommer snart</div>
        </div>
        
        {/* Newsletter Component */}
        <Newsletter />
        
        <div className="region-grid">
          {regions.map((region) => (
            <div key={region.id} className="region-card">
              <div className="region-header">
                <h3 className="region-name">{region.name}</h3>
                <span className={getScoreColorClass(region.positivity)}>
                  +{Math.round(region.positivity * 100)}%
                </span>
              </div>
              <p className="region-stats">{region.articles_count} positiva artiklar</p>
              <button className="region-button disabled" disabled>
                Utforska landskap
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RegionalExplorer;