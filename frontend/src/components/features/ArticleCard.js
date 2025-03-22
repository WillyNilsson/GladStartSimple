// frontend/src/components/features/ArticleCard.js
import React from 'react';
import { formatDate, getScoreColorClass } from '../../utils';

const ArticleCard = ({ article }) => {
  // Function to determine the correct image URL
  const getImageUrl = (article) => {
    // First check if article has an image field
    if (article.image) {
      // In production, this is already a complete URL
      return article.image;
    }
    
    // Fall back to image_url if it exists
    if (article.image_url) {
      // If it's an absolute URL (starts with http or //)
      if (article.image_url.startsWith('http') || article.image_url.startsWith('//')) {
        return article.image_url;
      }
      
      // If it's a relative URL, add the API_BASE_URL
      const API_BASE_URL = process.env.REACT_APP_API_URL || '';
      return API_BASE_URL.replace('/api', '') + article.image_url;
    }
    
    // If no image, return a placeholder
    return '/placeholder.svg?height=400&width=600';
  };

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="article-card"
    >
      <div className="article-card-image-container" style={{ height: '16rem', overflow: 'hidden' }}>
        <img
          src={getImageUrl(article)}
          alt={article.title}
          className="article-card-image"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            console.log("Image load error:", e.target.src);
            e.target.src = '/placeholder.svg?height=400&width=600';
          }}
        />
      </div>

      <div className="article-card-content">
        <div className="article-card-header">
          <span className="article-card-source">{article.source.name}</span>
          <span
            className={getScoreColorClass(article.positivity_score)}
          >
            +{Math.round(article.positivity_score * 100)}%
          </span>
        </div>

        <h3 className="article-card-title">{article.title}</h3>

        <p className="article-card-summary">{article.summary}</p>

        <div className="article-card-footer">
          <span className="article-card-date">{formatDate(article.published_date)}</span>

          <div>
            {article.region && (
              <span className="article-card-region">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                {article.region.name}
              </span>
            )}
          </div>
        </div>
      </div>
    </a>
  );
};

export default ArticleCard;