import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';
import Footer from './components/layout/Footer';
import NewsFeed from './components/features/NewsFeed';
import UserFeed from './components/features/UserFeed';
import RegionalExplorer from './components/features/RegionalExplorer';
import ApiService from './services/api';
import './styles/index.css';

function App() {
  const [activeTab, setActiveTab] = useState('feed');
  const [articles, setArticles] = useState([]);
  const [displayedArticles, setDisplayedArticles] = useState([]);
  const [regions, setRegions] = useState([]);
  const [topics, setTopics] = useState([]);
  const [sources, setSources] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    region: 'all',
    topics: [],
    sources: [],
    minScore: 0.7,
  });
  const [selectedRegion, setSelectedRegion] = useState(null);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      
      try {
        // Fetch regions
        const regionsData = await ApiService.getRegions();
        setRegions(regionsData.results || []);
        
        // Fetch topics
        const topicsData = await ApiService.getTopics();
        setTopics(topicsData.results || []);
        
        // Fetch sources
        const sourcesData = await ApiService.getSources();
        setSources(sourcesData.results || []);
        
        // Fetch user posts
        const postsData = await ApiService.getUserPosts();
        setUserPosts(postsData.results || []);
        
        // Fetch articles (initial page)
        const articlesData = await ApiService.getArticles({ page: 1 });
        setArticles(articlesData.results || []);
        setDisplayedArticles(articlesData.results || []);
        setHasMore(!!articlesData.next);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);
  
  // Fetch articles when filters change
  useEffect(() => {
    const fetchFilteredArticles = async () => {
      setLoading(true);
      
      try {
        // Build filter parameters
        const params = { page: 1 };
        
        if (filters.region !== 'all') {
          params.region__name = filters.region;
        }
        
        if (filters.topics.length > 0) {
          params.topics__name = filters.topics.join(',');
        }
        
        if (filters.sources.length > 0) {
          params.source__name = filters.sources.join(',');
        }
        
        if (filters.minScore) {
          params.min_score = filters.minScore;
        }
        
        // Fetch filtered articles
        const articlesData = await ApiService.getArticles(params);
        setArticles(articlesData.results || []);
        setDisplayedArticles(articlesData.results || []);
        setPage(1);
        setHasMore(!!articlesData.next);
      } catch (error) {
        console.error('Error fetching filtered articles:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFilteredArticles();
  }, [filters]);
  
  // Load more articles
  const loadMoreArticles = async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    
    try {
      // Build filter parameters
      const params = { page: page + 1 };
      
      if (filters.region !== 'all') {
        params.region__name = filters.region;
      }
      
      if (filters.topics.length > 0) {
        params.topics__name = filters.topics.join(',');
      }
      
      if (filters.sources.length > 0) {
        params.source__name = filters.sources.join(',');
      }
      
      if (filters.minScore) {
        params.min_score = filters.minScore;
      }
      
      // Fetch next page of articles
      const articlesData = await ApiService.getArticles(params);
      setDisplayedArticles(prevArticles => [...prevArticles, ...(articlesData.results || [])]);
      setPage(prevPage => prevPage + 1);
      setHasMore(!!articlesData.next);
    } catch (error) {
      console.error('Error loading more articles:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prevFilters => {
      // For array-based filters
      if (filterType === 'topics' || filterType === 'sources') {
        const currentValues = [...prevFilters[filterType]];
        const index = currentValues.indexOf(value);
        
        // Toggle value (remove if exists, add if doesn't)
        if (index !== -1) {
          currentValues.splice(index, 1);
        } else {
          currentValues.push(value);
        }
        
        return { ...prevFilters, [filterType]: currentValues };
      }
      
      // For simple value filters
      return { ...prevFilters, [filterType]: value };
    });
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      region: 'all',
      topics: [],
      sources: [],
      minScore: 0.7,
    });
    setSelectedRegion(null);
  };
  
  // Handle region selection
  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
    handleFilterChange('region', region.name);
  };
  
  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  // Get all unique topic names
  const allTopics = topics.map(topic => topic.name);

  return (
    <div className="container">
      {/* Header */}
      <Header
        onTabChange={handleTabChange}
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={resetFilters}
        allTopics={allTopics}
        regions={regions}
      />

      {/* Navigation Tabs */}
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Main Content */}
      <main className="main-content">
        {/* News Feed with Regional Sidebar */}
        {activeTab === 'feed' && (
          <NewsFeed
            articles={displayedArticles}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={loadMoreArticles}
            onResetFilters={resetFilters}
            regions={regions}
            selectedRegion={selectedRegion}
            onRegionSelect={handleRegionSelect}
          />
        )}

        {/* User Feed */}
        {activeTab === 'userfeed' && <UserFeed posts={userPosts} />}

        {/* Regional Explorer */}
        {activeTab === 'regional' && <RegionalExplorer regions={regions} />}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
