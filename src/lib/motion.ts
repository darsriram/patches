export const motionEase = "cubic-bezier(.22,1,.36,1)";

export function createReveal(element: HTMLElement, { delay = 0, zoom = false } = {}) {
  const animation = element.animate([
    { opacity: 0, filter: "blur(2px)", transform: zoom ? "translateY(28px) scale(.985)" : "translateY(28px)" },
    { opacity: 1, filter: "blur(0px)", transform: "translateY(0) scale(1)" },
  ], { duration: 800, delay, easing: motionEase, fill: "both" });
  animation.pause();
  animation.currentTime = 0;
  // Restore natural layout after the entrance, including sticky positioning.
  animation.onfinish = () => animation.cancel();
  return animation;
}
