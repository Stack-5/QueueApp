import { firebaseKeys } from "../firebaseKeys";

importScripts("https://www.gstatic.com/firebasejs/11.4.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.4.0/firebase-messaging-compat.js");

firebase.initializeApp(firebaseKeys);

const messaging = firebase.messaging();

// ✅ Handle Background Messages
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message: ", payload);

  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/logo.png", // Replace with neuqueue logo
  });
});