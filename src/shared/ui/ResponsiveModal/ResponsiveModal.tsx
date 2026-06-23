import { Modal } from '../Modal';
import { Drawer } from '../Drawer';
import { useIsMobile } from '@/shared/lib';

interface ResponsiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export function ResponsiveModal({
  isOpen,
  onClose,
  title,
  description,
  children,
}: ResponsiveModalProps) {
  const isMobile = useIsMobile();

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
