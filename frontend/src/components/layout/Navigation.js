import React from 'react';

const Navigation = ({ activeTab, onTabChange }) => {
  return (
    <div className="nav-container">
      <div className="nav-content">
        <nav className="nav-tabs">
          <button 
            className={`nav-tab ${activeTab === 'feed' ? 'active' : ''}`}
            onClick={() => onTabChange('feed')}
          >
            Nyhetsfeed
          </button>
          <button
            className={`nav-tab ${activeTab === 'regional' ? 'active' : ''}`}
            onClick={() => onTabChange('regional')}
          >
            Regionalt
          </button>
          <button
            className={`nav-tab ${activeTab === 'userfeed' ? 'active' : ''}`}
            onClick={() => onTabChange('userfeed')}
          >
            Användare
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Navigation;
