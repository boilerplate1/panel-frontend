type TelegramGlyphProps = {
  className?: string;
};

export function TelegramGlyph({ className }: TelegramGlyphProps) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.8 4.6 18.7 20.5c-.2 1.1-.8 1.4-1.7.9l-4.7-3.5-2.3 2.2c-.3.3-.6.6-1.2.6l.4-5.1L18.5 6.9c.4-.4-.1-.6-.6-.3L6.6 13.7 1.6 12.2c-1.1-.3-1.1-1.1.2-1.6L20 3.9c.9-.3 1.6.2 1.8.7Z"
        fill="currentColor"
      />
    </svg>
  );
}
