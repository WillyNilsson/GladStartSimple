import React from 'react';
import { formatDate } from '../../utils';
import Newsletter from '../common/Newsletter';

const UserFeed = ({ posts }) => {
  return (
    <div className="content-layout">
      <div className="main-column">
        <div className="page-header">
          <h2 className="page-title">Användarinlägg</h2>
          <div className="badge">Kommer snart</div>
        </div>
        
        {/* Newsletter Component */}
        <Newsletter />

        {/* Create Post Box */}
        {/* <div className="create-post-card">
          <div className="create-post-header">
            <div className="avatar-placeholder">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <input type="text" placeholder="Dela något positivt..." className="create-post-input" disabled />
          </div>
          <div className="create-post-footer">
            <button className="post-button disabled" disabled>Dela</button>
          </div>
        </div> */}

        {/* User Posts List */}
        <div className="user-posts-list">
          {posts.map((post) => (
            <div key={post.id} className="user-post-card">
              <div className="user-post-header">
                <div className="user-post-avatar">
                  <img 
                    src={post.avatar || '/placeholder.svg?height=40&width=40'} 
                    alt={post.username}
                    onError={(e) => {
                      e.target.src = '/placeholder.svg?height=40&width=40';
                    }}
                  />
                </div>
                <div className="user-post-meta">
                  <h3 className="user-post-author">{post.username}</h3>
                  <span className="user-post-date">{formatDate(post.date, 'long')}</span>
                </div>
              </div>
              
              <h4 className="user-post-title">{post.title}</h4>
              <p className="user-post-content">{post.content}</p>
              
              {post.image && (
                <div className="user-post-image">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    onError={(e) => {
                      e.target.src = '/placeholder.svg?height=400&width=600';
                    }}
                  />
                </div>
              )}
              
              {post.video && (
                <div className="user-post-video">
                  <div className="video-placeholder">
                    <div className="video-placeholder-text">Video kommer snart</div>
                  </div>
                </div>
              )}
              
              <div className="user-post-actions">
                <button className="user-post-action">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  <span>{post.likes}</span>
                </button>
                <button className="user-post-action">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                  <span>{post.comments}</span>
                </button>
                <button className="user-post-action">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                  </svg>
                  <span>{post.shares}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserFeed;