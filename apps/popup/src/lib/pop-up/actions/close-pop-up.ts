export function closePopup() {
  if (typeof window?.opener === 'undefined') {
    return;
  }
  window.opener.postMessage({ event: 'PopupUnload' }, '*');
  const parent = window.self;
  parent.opener = window.self;
  parent.close();
}
