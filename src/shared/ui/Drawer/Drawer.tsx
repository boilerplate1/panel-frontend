import React from 'react';
import { Drawer as VaulDrawer } from 'vaul';
import styles from './Drawer.module.css';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  description?: string;
}

export function Drawer({ isOpen, onClose, title, children, description }: DrawerProps) {
  return (
    <VaulDrawer.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <VaulDrawer.Portal>
        <VaulDrawer.Overlay className={styles.overlay} onClick={onClose} />
        <VaulDrawer.Content className={styles.content}>
          <div className={styles.handle} />
          <div className={styles.inner}>
            {title && <VaulDrawer.Title className={styles.title}>{title}</VaulDrawer.Title>}

            {/* 
              Accessibility: Vaul requires a Description for DialogContent. 
              We provide it if passed, or render a visually hidden one to satisfy the requirement 
              while keeping the UI clean if no description is needed.
            */}
            {description ? (
              <VaulDrawer.Description className={styles.description}>
                {description}
              </VaulDrawer.Description>
            ) : (
              <VaulDrawer.Description className={styles.visuallyHidden}>
                {title || 'Drawer Content'}
              </VaulDrawer.Description>
            )}

            <div className={styles.body}>{children}</div>
          </div>
        </VaulDrawer.Content>
      </VaulDrawer.Portal>
    </VaulDrawer.Root>
  );
}
