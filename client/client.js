const publicVapidKey =
  'BKWsPmrU2KJvp2NEBszhlRU9wM5UaYNi8QwuHoJ2NqgLdDhppxm1i-xFPHENqHmH5QFHZZGZsj5lAMxoAAG1y_k';

// check for service worker

if ('serviceWorker' in navigator) {
  send().catch((e) => console.error(e));
}

// register SW, Register Push, send Push
async function send() {
  // Register service worker
  console.log('Registering Service Worker...');
  const register = await navigator.serviceWorker.register('worker.js', {
    scope: '/',
  });
  console.log('Service worker registered...');

  // Register push
  console.log('Registering push...');
  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
  });
  console.log('Push Registered...');

  // Send Push notification
  console.log('Sending push...');
  await fetch('/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'content-type': 'application/json',
    },
  });
  console.log('Push sent...');
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
