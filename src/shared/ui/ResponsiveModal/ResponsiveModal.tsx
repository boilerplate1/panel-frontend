import { useEffect, useState } from 'react';
import { Modal } from '../Modal';
import { Drawer } from '../Drawer';

const MOBILE_BREAKPOINT = 768;

interface ResponsiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export function ResponsiveModal({ isOpen, onClose, title, description, children }: ResponsiveModalProps) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false,
  );

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const handler = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile(e.matches);
    handler(mql);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  if (isMobile) {
    return (
      <Drawer isOpen={isOpen} onClose={onClose} title={title} description={description}>
        {children}
      </Drawer>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title ?? ''}>
      {children}
    </Modal>
  );
}
