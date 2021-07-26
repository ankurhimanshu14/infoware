const firebase = require('firebase');

const firebaseConfig = {
    apiKey: "AIzaSyBWNKQO8rXF4P7ds7nAgmMATqnnDMwfjTQ",
    authDomain: "fir-cookbook-a0d37.firebaseapp.com",
    projectId: "fir-cookbook-a0d37",
    storageBucket: "fir-cookbook-a0d37.appspot.com",
    messagingSenderId: "282379265279",
    appId: "1:282379265279:web:7f49ffd5257b89fb0a18ca",
    measurementId: "G-5E5YJ7ZR14"
};

const fbase = firebase.initializeApp(firebaseConfig);

module.exports = fbase