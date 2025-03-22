import React, { useState, useEffect, useRef } from 'react';

const LazyImage = ({ src, alt, className, style = {} }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={imgRef}
      className={`lazy-image-container ${className || ''}`}
      style={style}
    >
      {isInView && (
        <img
          src={src || '/placeholder.svg'}
          alt={alt}
          className="lazy-image"
          style={{ opacity: isLoaded ? 1 : 0 }}
          onLoad={() => setIsLoaded(true)}
        />
      )}
      {(!isInView || !isLoaded) && (
        <div className="lazy-image-loader">
          <div className="lazy-image-spinner"></div>
        </div>
      )}
    </div>
  );
};

export default LazyImage;
