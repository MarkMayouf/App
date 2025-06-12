import React, { useState } from 'react';
import { getImageUrl } from '../utils/apiUtils';

const BlogImage = ({ imagePath, alt = "", className = "", fallbackText = "No Image" }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Don't render anything if no image path
  if (!imagePath) {
    return (
      <div className={`image-placeholder ${className}`} style={{
        backgroundColor: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        color: '#666',
        fontSize: '14px'
      }}>
        {fallbackText}
      </div>
    );
  }

  const imageUrl = getImageUrl(imagePath);

  // Show error placeholder if image failed to load
  if (imageError) {
    return (
      <div className={`image-error ${className}`} style={{
        backgroundColor: '#ffebee',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        color: '#c62828',
        fontSize: '14px',
        border: '1px dashed #c62828'
      }}>
        Failed to load image
        <br />
        <small>{imagePath}</small>
      </div>
    );
  }

  return (
    <div className="image-container" style={{ position: 'relative' }}>
      {imageLoading && (
        <div className="image-loading" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999',
          fontSize: '14px'
        }}>
          Loading...
        </div>
      )}
      <img
        src={imageUrl}
        alt={alt}
        className={className}
        onLoad={() => setImageLoading(false)}
        onError={(e) => {
          console.error('Failed to load image:', imageUrl);
          setImageError(true);
          setImageLoading(false);
        }}
        style={{ 
          display: imageLoading ? 'none' : 'block',
          width: '100%',
          height: 'auto'
        }}
      />
    </div>
  );
};

export default BlogImage; 