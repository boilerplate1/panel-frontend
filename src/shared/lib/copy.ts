export const copyToClipboard = async (text: string) => {
  // 1. Try modern clipboard API
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('navigator.clipboard failed: ', err);
    }
  }

  // 2. Fallback to old-school textarea method for mobile/older browsers
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;

    // Ensure textarea is not visible but part of DOM
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '0';
    document.body.appendChild(textArea);

    textArea.focus();
    textArea.select();

    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Fallback copy failed: ', err);
    return false;
  }
};
