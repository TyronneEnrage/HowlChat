import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";
import { getFirestore, collection, addDoc, query, orderBy, limit, onSnapshot, where } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";

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

let currentChannel = 'general';

function initializeChat(user) {
    console.log('Initializing chat for user:', user.displayName);
    document.getElementById('user-info').textContent = `Logged in as: ${user.displayName}`;
    
    loadChannels();
    switchChannel('general'); // You might want to change this to the last active channel
    
    document.getElementById('chat-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const messageInput = document.getElementById('message-input');
        const message = messageInput.value.trim();
        if (message) {
            addMessage(user.displayName, message, currentChannel);
            messageInput.value = '';
        }
    });

    document.getElementById('add-channel').addEventListener('click', () => {
        const channelName = prompt('Enter new channel name:');
        if (channelName) {
            addChannel(channelName);
        }
    });

    // Add event delegation for channel switching
    document.getElementById('channels').addEventListener('click', (e) => {
        if (e.target.classList.contains('channel')) {
            switchChannel(e.target.dataset.channel);
        }
    });
}

function loadChannels() {
    const channelsRef = collection(db, 'channels');
    
    onSnapshot(channelsRef, (snapshot) => {
        const channelList = document.getElementById('channels');
        channelList.innerHTML = ''; // Clear existing channels
        
        snapshot.forEach((doc) => {
            const channelData = doc.data();
            const channelElement = document.createElement('li');
            channelElement.classList.add('channel');
            channelElement.dataset.channel = channelData.name;
            channelElement.textContent = channelData.name;
            channelList.appendChild(channelElement);
        });
    });
}

function switchChannel(channelName) {
    currentChannel = channelName;
    document.querySelectorAll('.channel').forEach(ch => ch.classList.remove('active'));
    const activeChannel = document.querySelector(`.channel[data-channel="${channelName}"]`);
    if (activeChannel) {
        activeChannel.classList.add('active');
    }
    document.getElementById('current-channel').innerHTML = `<h3>#${channelName}</h3>`;
    loadChatMessages(channelName);
}

async function addChannel(channelName) {
    try {
        await addDoc(collection(db, 'channels'), {
            name: channelName,
            createdAt: new Date()
        });
        console.log(`Channel ${channelName} added successfully`);
    } catch (error) {
        console.error("Error adding channel: ", error);
    }
}


async function addMessage(username, message, channel) {
    try {
        await addDoc(collection(db, 'messages'), {
            name: username,
            text: message,
            timestamp: new Date(),
            channel: channel
        });
    } catch (error) {
        console.error('Error adding message:', error);
    }
}

function loadChatMessages(channel) {
    const q = query(
        collection(db, 'messages'),
        where('channel', '==', channel),
        orderBy('timestamp', 'asc'),
        limit(50)
    );

    onSnapshot(q, (snapshot) => {
        const chatBox = document.getElementById('chat-box');
        chatBox.innerHTML = '';
        snapshot.forEach((doc) => {
            const data = doc.data();
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
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