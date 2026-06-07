import type { ReactNode } from 'react';
import styles from './PlanGrid.module.css';

interface PlanGridProps {
  children: ReactNode;
  isLoading?: boolean;
}

const SKELETON_ITEMS = Array.from({ length: 4 }, (_, i) => i);

export const PlanGrid = ({ children, isLoading }: PlanGridProps) => {
  if (isLoading) {
    return (
      <div className={styles.root}>
        {SKELETON_ITEMS.map((i) => (
          <div key={i} className={`${styles.skeletonCard} ${styles.pulse}`}>
            <div className={styles.skeletonHeader}>
              <div className={styles.skeletonName} />
            </div>
            <div className={styles.skeletonPrice} />
            <div className={styles.skeletonFeatures}>
              <div className={styles.skeletonFeature} />
              <div className={styles.skeletonFeature} />
              <div className={styles.skeletonFeature} />
            </div>
            <div className={styles.skeletonBtn} />
          </div>
        ))}
      </div>
    );
  }

  return <div className={styles.root}>{children}</div>;
};
