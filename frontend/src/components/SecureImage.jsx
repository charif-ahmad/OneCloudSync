import { useEffect, useState, useRef } from 'react';
import { getPhotoBlob } from '../services/api';

/**
 * SecureImage renders an image by fetching its binary content
 * via an authenticated HTTP request and generating a temporary blob URL.
 * It manages the object URL lifecycle to prevent memory leaks.
 */
export default function SecureImage({ photoId, alt, className, style, onError, ...props }) {
  const [src, setSrc] = useState('');
  const [loading, setLoading] = useState(!!photoId);
  const [error, setError] = useState(false);
  const [prevPhotoId, setPrevPhotoId] = useState(null);

  // Reset state during render when photoId changes (safe derivation)
  if (photoId !== prevPhotoId) {
    setPrevPhotoId(photoId);
    setSrc('');
    setLoading(!!photoId);
    setError(false);
  }

  const onErrorRef = useRef(onError);
  useEffect(() => {
    onErrorRef.current = onError;
  });

  useEffect(() => {
    if (!photoId) return;

    let isMounted = true;
    let currentObjectUrl = '';

    getPhotoBlob(photoId)
      .then((blob) => {
        if (isMounted) {
          currentObjectUrl = URL.createObjectURL(blob);
          setSrc(currentObjectUrl);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(`Error loading secure photo ${photoId}:`, err);
        if (isMounted) {
          setError(true);
          setLoading(false);
          if (onErrorRef.current) {
            onErrorRef.current(err);
          }
        }
      });

    return () => {
      isMounted = false;
      if (currentObjectUrl) {
        URL.revokeObjectURL(currentObjectUrl);
      }
    };
  }, [photoId]);

  if (loading) {
    return (
      <div
        className={className}
        style={{
          background: 'var(--surface-container-low)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          aspectRatio: '1',
          width: '100%',
          animation: 'pulse-glow 1.5s ease infinite',
          ...style,
        }}
      >
        <span className="material-symbols-outlined" style={{ color: 'var(--outline-variant)', fontSize: '1.5rem' }}>
          image
        </span>
      </div>
    );
  }

  if (error || !src) {
    return (
      <div
        className={className}
        style={{
          background: 'var(--surface-container-high)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          aspectRatio: '1',
          width: '100%',
          ...style,
        }}
      >
        <span className="material-symbols-outlined" style={{ color: 'var(--outline)', fontSize: '1.5rem' }}>
          broken_image
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      {...props}
    />
  );
}
