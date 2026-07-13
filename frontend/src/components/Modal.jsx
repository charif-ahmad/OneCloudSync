import { useEffect } from 'react';
import { createPortal } from 'react-dom';

// Portals to document.body so the backdrop escapes any ancestor stacking
// context / transform containing block (e.g. the page's fade-in animation).
export default function Modal({ onClose, zIndex, children }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return createPortal(
    <div
      className="modal-backdrop"
      style={zIndex ? { zIndex } : undefined}
      onClick={(e) => { e.stopPropagation(); onClose(); }}
    >
      <div className="modal animate-scale" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  );
}
