import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBN2gdB0giH-cggQ9o50UNiOeXZkqJH9rc",
    authDomain: "howl-chat.firebaseapp.com",
    projectId: "howl-chat",
    storageBucket: "howl-chat.appspot.com",
    messagingSenderId: "611414212957",
    appId: "1:611414212957:web:f69082e890015bcfe0a8b4"
};

const webApp = initializeApp(firebaseConfig);
const authentication = getAuth(webApp);

document.getElementById('GoogleLogin').addEventListener('click', () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
        prompt: 'select_account'
    });

    signInWithPopup(authentication, provider)
        .then((result) => {
            console.log('User signed in:', result.user);
            window.location.href = 'chat_page.html';
        })
        .catch((error) => {
            console.error('Error during sign-in:', error);
        });
});

onAuthStateChanged(authentication, (user) => {
    if(user){
        console.log('The user is signed in to another device.');
        window.location.href = 'chat_page.html';
    }
});