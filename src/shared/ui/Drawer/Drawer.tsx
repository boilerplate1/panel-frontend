import { useEffect, useRef } from 'react';
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
  const scrollRef = useRef(0);

  useEffect(() => {
    if (isOpen) {
      scrollRef.current = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollRef.current}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      const y = scrollRef.current;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, y);
    }
    return () => {
      const y = scrollRef.current;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, y);
    };
  }, [isOpen]);

  return (
    <VaulDrawer.Root
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      shouldScaleBackground={false}
      noBodyStyles
    >
      <VaulDrawer.Portal>
        <VaulDrawer.Overlay className={styles.overlay} />
        <VaulDrawer.Content className={styles.content}>
          <div className={styles.handle} />
          <div className={styles.inner}>
            {title && <VaulDrawer.Title className={styles.title}>{title}</VaulDrawer.Title>}

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
