import { Modal } from '../Modal';

interface ResponsiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const ResponsiveModal = ({ isOpen, onClose, title, children }: ResponsiveModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title || ''}>
      {children}
    </Modal>
  );
};
