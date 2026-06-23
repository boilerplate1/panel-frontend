import { Modal } from '../Modal';
import { Drawer } from '../Drawer';
import { useIsMobile } from '@/shared/hooks';

interface ResponsiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  width?: string;
}

export function ResponsiveModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  width,
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
    <Modal isOpen={isOpen} onClose={onClose} title={title ?? ''} width={width}>
      {children}
    </Modal>
  );
}
