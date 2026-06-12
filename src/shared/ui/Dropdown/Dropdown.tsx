import { useState, type ReactNode } from 'react';
import styles from './Dropdown.module.css';
import { ChevronDown } from 'lucide-react';

export interface DropdownItem {
  label: ReactNode;
  icon?: ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  showChevron?: boolean;
  className?: string;
  align?: 'left' | 'right';
}

export function Dropdown({
  trigger,
  items,
  showChevron = true,
  className = '',
  align = 'right',
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  return (
    <div className={`${styles.root} ${className}`}>
      <button className={styles.trigger} onClick={toggle} type="button">
        {trigger}
        {showChevron && (
          <ChevronDown size={22} className={`${styles.chevron} ${isOpen ? styles.open : ''}`} />
        )}
      </button>

      {isOpen && (
        <>
          <div className={styles.overlay} onClick={close} />
          <div
            className={`${styles.menu} ${align === 'left' ? styles.menuLeft : styles.menuRight}`}
          >
            {items.map((item, index) => (
              <button
                key={index}
                className={`${styles.item} ${item.variant === 'danger' ? styles.danger : ''}`}
                onClick={() => {
                  item.onClick();
                  close();
                }}
                type="button"
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
