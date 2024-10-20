import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";

let encryptedstring = "U2FsdGVkX19tNlD5zzCWR3QtE1IlstSz4eU6rB8ifHok84UlfvG6XNOkLcXnPGGJQHcANKIUJbZ5Uv9WI9EoKm1qsEBmu+T7u902v9U/fLm91PyoK7+JDLV6Vsy9nVacaUiFjDb1Ky+pqBJhCmv6j66FVV5pJP9MPP/QeQsJLdX6468+k5lH2mLpvShFl++P8QjcMKa/VwfRev58uaE/Et0zEs57VGHaLPtP4O4MWpxXt55C1DOq6u99ZU+yPX/g51O9R+rfpTK5aWFW4lAQ0l6x/rev5bPfKpB654DYDdmE3wpuMH26mitWHSprkCZx0dWN8V7mYxOVEe6/NbU8KrjxQuL3N7ZiyeOSKbvXaMU=";
const encryptionKey = "Redline";

const decryptedBytes = CryptoJS.AES.decrypt(encryptedstring, encryptionKey);
const decryptedConfigString = decryptedBytes.toString(CryptoJS.enc.Utf8);

const firebaseConfig = JSON.parse(decryptedConfigString);

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