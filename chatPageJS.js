import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";
import { getFirestore, collection, addDoc, query, orderBy, limit, onSnapshot } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBN2gdB0giH-cggQ9o50UNiOeXZkqJH9rc",
    authDomain: "howl-chat.firebaseapp.com",
    projectId: "howl-chat",
    storageBucket: "howl-chat.appspot.com",
    messagingSenderId: "611414212957",
    appId: "1:611414212957:web:f69082e890015bcfe0a8b4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function initializeChat(user) {
    console.log('Initializing chat for user:', user.displayName);
    document.getElementById('user-info').textContent = `Logged in as: ${user.displayName} (${user.email})`;
    loadChatMessages();

    document.getElementById('chat-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const messageInput = document.getElementById('message-input');
        const message = messageInput.value.trim();
        if (message) {
            addMessage(user.displayName, message);
            messageInput.value = '';
        }
    });
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        initializeChat(user);
    } else {
        console.log('User is not signed in, redirecting to login page');
        window.location.href = 'index.html';
    }
});

document.getElementById('logout').addEventListener('click', () => {
    signOut(auth).then(() => {
        console.log('User signed out');
        window.location.href = 'index.html';
    }).catch((error) => {
        console.error('Error signing out:', error);
    });
});

async function addMessage(username, message) {
    try {
        await addDoc(collection(db, 'messages'), {
            name: username,
            text: message,
            timestamp: new Date()
        });
    } catch (error) {
        console.error('Error adding message:', error);
    }
}

function loadChatMessages() {
    const q = query(collection(db, 'messages'), orderBy('timestamp', 'asc'), limit(50));
    onSnapshot(q, (snapshot) => {
        const chatBox = document.getElementById('chat-box');
        chatBox.innerHTML = '';
        snapshot.forEach((doc) => {
            const data = doc.data();
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            
            // Determine if the message is from the current user
            const isCurrentUser = data.name === auth.currentUser.displayName;
            messageElement.classList.add(isCurrentUser ? 'sender' : 'receiver');
            
            messageElement.innerHTML = `
                <div class="message-content">
                    <div class="user-name">${data.name}</div>
                    <div class="message-text">${data.text}</div>
                </div>
            `;
            chatBox.appendChild(messageElement);
        });
        chatBox.scrollTop = chatBox.scrollHeight;
    });
}