const preventDefault = (e: Event) => e.preventDefault();

export const lockScroll = () => {
  if (document) {
    document.body.style.overflow = 'hidden';
    // document.addEventListener('touchmove', preventDefault, { passive: false });
  }
}

export const unlockScroll = () => {
  if (document) {
    document.body.style.overflow = 'auto';
    // document.removeEventListener('touchmove', preventDefault);
  }
}