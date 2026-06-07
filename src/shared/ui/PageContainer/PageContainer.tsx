import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './PageContainer.module.css';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className = '' }: PageContainerProps) {
  const location = useLocation();

  return (
    <div key={location.pathname} className={`${styles.root} ${className} page-transition`}>
      {children}
    </div>
  );
}
