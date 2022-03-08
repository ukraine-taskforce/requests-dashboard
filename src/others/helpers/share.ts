export function share(label: string) {
  if (isShareSupported()) {
    navigator.share({
      title: label,
      url: window.location.origin,
    });
  }
}

export function isShareSupported(): boolean {
  return Boolean(navigator.share);
}
