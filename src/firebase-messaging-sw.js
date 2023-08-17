importScripts('https://www.gstatic.com/firebasejs/9.9.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.9.2/firebase-messaging-compat.js');


firebase.initializeApp({
      apiKey: "AIzaSyBuAT1lOYnOqsZZF4VQyg0iD7lb0Z2JEaE",
      authDomain: "green-pheasant-4fd0d.firebaseapp.com",
      projectId: "green-pheasant-4fd0d",
      storageBucket: "green-pheasant-4fd0d.appspot.com",
      messagingSenderId: "371193518461",
      appId: "1:371193518461:web:dd89b5f783daae49591414",
      measurementId: "G-R8H5L5LYH6",
      vapidKey:"BMy-3MpSX6ZG3xJjpdd54Y980rU3fkO_rg_PLssRYEht-buCChfqWfSxVnJF2W8gFil74zmQCQc_-iJEalqNABo"
});
const messaging = firebase.messaging();
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then(function(registration) {
      console.log('Registration successful, scope is:', registration.scope);
    }).catch(function(err) {
      console.log('Service worker registration failed, error:', err);
    });
  }