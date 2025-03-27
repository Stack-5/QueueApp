importScripts("https://www.gstatic.com/firebasejs/11.4.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.4.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBpCd7IRFoEXJojdSSiEXvGookmp3fkX6o",
  authDomain: "retchizu-94b36.firebaseapp.com",
  databaseURL: "https://retchizu-94b36-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "retchizu-94b36",
  storageBucket: "retchizu-94b36.firebasestorage.app",
  messagingSenderId: "494547462196",
  appId: "1:494547462196:web:72940d101936381e194261"
});

const messaging = firebase.messaging();

// ✅ Handle Background Messages
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message: ", payload);

  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/logo.png", // Replace with neuqueue logo
  });
});