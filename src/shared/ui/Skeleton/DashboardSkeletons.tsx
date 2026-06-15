import { Skeleton } from '@/shared/ui/Skeleton';
import styles from './DashboardSkeletons.module.css';

export const DeviceCardSkeleton = () => (
  <div className={styles.itemSkeleton}>
    <div className={styles.info}>
      <Skeleton width="60%" height={16} />
      <Skeleton width="100%" height={12} className={styles.meta} />
    </div>
    <Skeleton width={32} height={32} borderRadius={8} />
  </div>
);

export const SubscriptionCardSkeleton = () => (
  <div className={styles.subscriptionSkeleton}>
    <Skeleton width="40%" height={20} />
    <div className={styles.grid}>
      <Skeleton width="100%" height={40} />
      <Skeleton width="100%" height={40} />
    </div>
    <Skeleton width="100%" height={44} />
  </div>
);
