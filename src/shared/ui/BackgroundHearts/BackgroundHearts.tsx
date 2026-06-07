import React from 'react';
import styles from './BackgroundHearts.module.css';

interface HeartProps {
  top: string;
  left: string;
  size: number;
  time: string;
  delay: string;
  opacity: number;
}

const Heart: React.FC<HeartProps> = ({ top, left, size, time, delay, opacity }) => (
  <div
    className={styles.heart}
    style={
      {
        top,
        left,
        width: size,
        height: size,
        animationDuration: time,
        animationDelay: delay,
        opacity,
      } as React.CSSProperties
    }
  >
    <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
      <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.41,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.59,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
    </svg>
  </div>
);

export const BackgroundHearts: React.FC = () => {
  const hearts: HeartProps[] = [
    { top: '5%', left: '15%', size: 160, time: '20s', delay: '1s', opacity: 0.15 },
    { top: '0%', left: '75%', size: 160, time: '25s', delay: '2s', opacity: 0.1 },
    { top: '30%', left: '80%', size: 120, time: '18s', delay: '3s', opacity: 0.12 },
    { top: '50%', left: '70%', size: 170, time: '22s', delay: '4s', opacity: 0.08 },
    { top: '40%', left: '5%', size: 130, time: '28s', delay: '5s', opacity: 0.15 },
    { top: '75%', left: '25%', size: 150, time: '24s', delay: '6s', opacity: 0.1 },
    { top: '65%', left: '85%', size: 190, time: '30s', delay: '7s', opacity: 0.07 },
    { top: '60%', left: '15%', size: 120, time: '26s', delay: '8s', opacity: 0.13 },
  ];

  return (
    <div className={styles.background}>
      {hearts.map((h, i) => (
        <Heart key={i} {...h} />
      ))}
    </div>
  );
};
