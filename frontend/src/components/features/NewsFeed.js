import React from 'react';
import ArticleList from './ArticleList';
import RegionalSidebar from './RegionalSidebar';
import Newsletter from '../common/Newsletter';

const NewsFeed = ({
  articles,
  loading,
  hasMore,
  onLoadMore,
  onResetFilters,
  regions,
  selectedRegion,
  onRegionSelect,
}) => {
  return (
    <div className="content-layout">
      {/* Main News Feed */}
      <div className="main-column">
        <h2 className="page-title">Senaste positiva nyheterna</h2>
        
        {/* Newsletter Component */}
        <Newsletter />
        
        {/* Article List */}
        <ArticleList
          articles={articles}
          loading={loading}
          hasMore={hasMore}
          onLoadMore={onLoadMore}
          onResetFilters={onResetFilters}
        />
      </div>

      {/* Regional Sidebar */}
      <RegionalSidebar
        regions={regions}
        selectedRegion={selectedRegion}
        onRegionSelect={onRegionSelect}
      />
    </div>
  );
};

export default NewsFeed;