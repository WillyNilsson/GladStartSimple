import React, { useState, useRef } from 'react';
import { getAssetPath } from '../../utils';

const Header = ({ onTabChange, filters, onFilterChange, onResetFilters, allTopics, regions }) => {
  const [filterPopoverOpen, setFilterPopoverOpen] = useState(false);
  const [searchPopoverOpen, setSearchPopoverOpen] = useState(false);
  const filterRef = useRef(null);
  const searchRef = useRef(null);
  
  // Toggle filter popover
  const toggleFilterPopover = () => {
    setFilterPopoverOpen(!filterPopoverOpen);
    setSearchPopoverOpen(false);
  };
  
  // Toggle search popover
  const toggleSearchPopover = () => {
    setSearchPopoverOpen(!searchPopoverOpen);
    setFilterPopoverOpen(false);
  };
  
  // Close popovers when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterPopoverOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchPopoverOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
    <header className="header">
      <div className="header-container">
        <div className="header-content"style={{ marginBottom: '-2.5rem' }}>
          <button onClick={() => onTabChange('feed')} className="logo-button">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-WgdH8SvfqXRe66WXwS61HnGeOO5FS0.png"
              alt="GLADSTART"
              className="h-24 w-auto cursor-pointer"
              style={{ height: '96px', width: 'auto', marginLeft: '0.3rem'}}
            />
          </button>

          <div className="header-actions">
            {/* Filter Button */}
            <div ref={filterRef} style={{ position: 'relative' }}>
              <button className="icon-button disabled" onClick={toggleFilterPopover}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
              </button>
              
              {filterPopoverOpen && (
                <div className="popover-content">
                  <div className="popover-header">
                    <span className="popover-title">Filter</span>
                    <div className="badge">Kommer snart</div>
                  </div>

                  <div className="form-groups">
                    {/* Region Filter */}
                    <div className="form-group">
                      <label className="form-label">Region</label>
                      <select
                        className="form-select"
                        value={filters.region}
                        onChange={(e) => onFilterChange('region', e.target.value)}
                      >
                        <option value="all">Alla regioner</option>
                        {regions.map((region) => (
                          <option key={region.id} value={region.name}>
                            {region.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Topics Filter */}
                    <div className="form-group">
                      <label className="form-label">Ämnen</label>
                      <div className="tag-container">
                        {allTopics.slice(0, 6).map((topic) => (
                          <button
                            key={topic}
                            className={filters.topics.includes(topic) ? "tag tag-active" : "tag tag-inactive"}
                            onClick={() => onFilterChange('topics', topic)}
                          >
                            {topic}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Positivity Score Filter */}
                    <div className="form-group">
                      <label className="form-label">Positivitetsgrad: {Math.round(filters.minScore * 100)}%+</label>
                      <input
                        type="range"
                        min="0.5"
                        max="1"
                        step="0.05"
                        value={filters.minScore}
                        onChange={(e) => onFilterChange('minScore', e.target.value)}
                        className="range-input"
                      />
                    </div>
                  </div>

                  <div className="button-group">
                    <button className="button button-secondary" onClick={onResetFilters}>
                      Återställ
                    </button>
                    <button className="button button-primary" onClick={() => setFilterPopoverOpen(false)}>
                      Tillämpa filter
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Search Button */}
            <div ref={searchRef} style={{ position: 'relative' }}>
              <button className="icon-button disabled" onClick={toggleSearchPopover}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
              
              {searchPopoverOpen && (
                <div className="popover-content">
                  <div className="popover-header">
                    <span className="popover-title">Sök</span>
                    <div className="badge">Kommer snart</div>
                  </div>
                  <input type="text" placeholder="Sök efter nyheter..." className="form-select" disabled />
                  <div
                    style={{
                      height: '8rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#6f4e37',
                    }}
                  >
                    Sökfunktionen kommer snart
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
    </>
  );
};

export default Header;
