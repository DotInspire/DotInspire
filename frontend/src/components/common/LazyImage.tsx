import React, { useState } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({ 
  src, 
  alt, 
  className = '', 
  fallbackSrc = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
  ...props 
}) => {
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);
  const [hasError, setHasError] = useState(false);

  React.useEffect(() => {
    if (src && src.trim() !== '') {
      setCurrentSrc(src);
      setHasError(false);
    }
  }, [src]);

  return (
    <div className={`relative overflow-hidden bg-charcoal-900 ${className}`}>
      <img
        src={currentSrc}
        alt={alt}
        loading="lazy"
        onError={() => {
          if (!hasError) {
            setHasError(true);
            setCurrentSrc(fallbackSrc);
          }
        }}
        className="w-full h-full object-cover"
        {...props}
      />
    </div>
  );
};
