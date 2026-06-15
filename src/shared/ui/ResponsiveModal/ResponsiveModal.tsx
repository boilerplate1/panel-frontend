import { useEffect, useState } from 'react';
import { Modal } from '../Modal';
import { Drawer } from '../Drawer';

interface ResponsiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const ResponsiveModal = ({ isOpen, onClose, title, children }: ResponsiveModalProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 992px)');
    const handleResize = () => setIsMobile(mediaQuery.matches);
    
    handleResize();
    mediaQuery.addEventListener('change', handleResize);
    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);

  if (!isOpen) return null;

  return isMobile ? (
    <Drawer isOpen={isOpen} onClose={onClose} title={title}>
      {children}
    </Drawer>
  ) : (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      {children}
    </Modal>
  );
};
