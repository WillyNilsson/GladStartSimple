// Format date for display
export const formatDate = (dateString, format = 'short') => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // Check if the date is valid
  if (isNaN(date)) {
    return '';
  }
  
  if (format === 'short') {
    return new Intl.DateTimeFormat('sv-SE', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }
  
  return new Intl.DateTimeFormat('sv-SE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

// Get score color class based on positivity score
export const getScoreColorClass = (score) => {
  if (score >= 0.9) return 'score-badge score-badge-high';
  if (score >= 0.8) return 'score-badge score-badge-medium';
  if (score >= 0.7) return 'score-badge score-badge-low';
  return 'score-badge';
};

// Get base URL for assets
export const getAssetPath = (path) => {
  // Ensure path starts with a slash
  const assetPath = path.startsWith('/') ? path : `/${path}`;
  return `${process.env.PUBLIC_URL}${assetPath}`;
};

// Debounce function for handling input changes
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
