export const lockScroll = () => {
  if (document) {
    const preventDefault = (e: Event) => e.preventDefault();
    document.body.style.overflow = 'hidden';
    document.addEventListener('touchmove', preventDefault, { passive: false });
  }
}