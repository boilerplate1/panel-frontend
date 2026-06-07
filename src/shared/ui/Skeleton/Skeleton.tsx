import styles from './Skeleton.module.css';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  circle?: boolean;
}

export function Skeleton({
  className = '',
  width,
  height,
  borderRadius,
  circle = false,
}: SkeletonProps) {
  const customStyles: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    borderRadius: circle ? '50%' : (typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius),
  };

  return (
    <div 
      className={`${styles.skeleton} ${className}`} 
      style={customStyles}
      aria-hidden="true"
    />
  );
}
