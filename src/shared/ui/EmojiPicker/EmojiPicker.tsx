import { useState } from 'react';
import styles from './EmojiPicker.module.css';

const EMOJIS = [
  '📱',
  '💻',
  '🖥️',
  '📲',
  '⌚',
  '📺',
  '🎮',
  '📡',
  '🏠',
  '🚗',
  '🎧',
  '📷',
  '🖨️',
  '💼',
  '🎒',
  '🏢',
];

interface EmojiPickerProps {
  selected: string;
  onSelect: (emoji: string) => void;
}

export function EmojiPicker({ selected, onSelect }: EmojiPickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.wrapper}>
      <button type="button" className={styles.trigger} onClick={() => setOpen(!open)}>
        <span className={styles.selectedEmoji}>{selected || '📱'}</span>
      </button>

      {open && (
        <>
          <div className={styles.backdrop} onClick={() => setOpen(false)} />
          <div className={styles.popup}>
            <div className={styles.grid}>
              {EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  className={`${styles.emojiBtn} ${selected === emoji ? styles.active : ''}`}
                  onClick={() => {
                    onSelect(emoji);
                    setOpen(false);
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
