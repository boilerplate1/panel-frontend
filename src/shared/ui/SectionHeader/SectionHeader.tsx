import type { ReactNode } from 'react';
import styles from './SectionHeader.module.css';

type HeadingTag = 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type TextTag = 'div' | 'p' | 'span';

interface SectionHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  titleAs?: HeadingTag;
  subtitleAs?: TextTag;
}

const cn = (...classes: Array<string | undefined | null | false>) =>
  classes.filter(Boolean).join(' ');

export function SectionHeader({
  title,
  subtitle,
  className = '',
  titleClassName = '',
  subtitleClassName = '',
  titleAs: TitleTag = 'div',
  subtitleAs: SubtitleTag = 'div',
}: SectionHeaderProps) {
  return (
    <div className={cn(styles.root, className)}>
      <TitleTag className={cn(styles.title, titleClassName)}>{title}</TitleTag>
      {subtitle ? (
        <SubtitleTag className={cn(styles.subtitle, subtitleClassName)}>{subtitle}</SubtitleTag>
      ) : null}
    </div>
  );
}
