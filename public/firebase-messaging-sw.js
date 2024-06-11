importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyAKBAilnh_cWUytEZDKvHxeNFmrUA81cQs",
    authDomain: "chat-app-8f15f.firebaseapp.com",
    projectId: "chat-app-8f15f",
    storageBucket: "chat-app-8f15f.appspot.com",
    messagingSenderId: "441179473543",
    appId: "1:441179473543:web:e66d68b96e3f5a903f9a22",
    measurementId: "G-E5LGTL2Y1N"
  };

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.ico',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
