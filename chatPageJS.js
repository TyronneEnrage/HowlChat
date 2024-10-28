import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";
import { getFirestore, collection, addDoc, query, orderBy, limit, onSnapshot, where, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";

//INITIALIZING FIREBASE USER
//Decryption of the Firebase credential 
let encryptedstring = "U2FsdGVkX19tNlD5zzCWR3QtE1IlstSz4eU6rB8ifHok84UlfvG6XNOkLcXnPGGJQHcANKIUJbZ5Uv9WI9EoKm1qsEBmu+T7u902v9U/fLm91PyoK7+JDLV6Vsy9nVacaUiFjDb1Ky+pqBJhCmv6j66FVV5pJP9MPP/QeQsJLdX6468+k5lH2mLpvShFl++P8QjcMKa/VwfRev58uaE/Et0zEs57VGHaLPtP4O4MWpxXt55C1DOq6u99ZU+yPX/g51O9R+rfpTK5aWFW4lAQ0l6x/rev5bPfKpB654DYDdmE3wpuMH26mitWHSprkCZx0dWN8V7mYxOVEe6/NbU8KrjxQuL3N7ZiyeOSKbvXaMU=";
const encryptionKey = "Redline";

const decryptedBytes = CryptoJS.AES.decrypt(encryptedstring, encryptionKey);
const decryptedConfigString = decryptedBytes.toString(CryptoJS.enc.Utf8);
const firebaseConfig = JSON.parse(decryptedConfigString);

//Initialization of firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentChannel = 'default';

function initializeChat(user) {
    console.log('Initializing chat for user:', user.displayName);
    document.getElementById('user-info').textContent = `Logged in as: ${user.displayName}`;
    
    loadChannels(user);
    switchChannel('default'); // Switch to default channel by default
    
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
            addChannel(channelName, user.uid);
        }
    });

    // Add event delegation for channel switching
    document.getElementById('channels').addEventListener('click', (e) => {
        if (e.target.classList.contains('channel')) {
            switchChannel(e.target.dataset.channel);
        }
    });
}

//User authentication 
onAuthStateChanged(auth, (user) => {
    if (user) {
        initializeChat(user);
        switchChannel('default'); // Switch to default channel after user logs in
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




//CHANNEL RELATED FUNCTIONS
//loading all channels from firestore
function loadChannels(user) {
    const channelsRef = collection(db, 'channels');
    
    onSnapshot(channelsRef, (snapshot) => {
        const channelList = document.getElementById('channels');
        channelList.innerHTML = ''; // Clear existing channels
        let defaultChannelExists = false;

        snapshot.forEach((doc) => {
            const channelData = doc.data();
            const channelElement = document.createElement('li');
            channelElement.classList.add('channel');
            channelElement.dataset.channel = channelData.name;

            // Add channel name
            const channelNameSpan = document.createElement('span');
            channelNameSpan.textContent = channelData.name;
            channelElement.appendChild(channelNameSpan);

            // Add delete button only if the current user created the channel and it's not "default"
            if (channelData.name !== 'default' && channelData.createdBy === user.uid) {
                const deleteButton = document.createElement('button');
                deleteButton.textContent = '🗑️'; // You can also use an icon if preferred
                deleteButton.classList.add('delete-channel', 'custom-delete-button');
                deleteButton.dataset.channelId = doc.id;
                deleteButton.dataset.channelName = channelData.name;
            
                // Append the delete button to the channel element
                channelElement.appendChild(deleteButton);
            }

            channelList.appendChild(channelElement);

            // Check if "default" channel exists
            if (channelData.name === 'default') {
                defaultChannelExists = true;
            }
        });

        // If the "default" channel does not exist, add it
        if (!defaultChannelExists) {
            addChannel('default', user.uid).then(() => {
                console.log('Default channel added successfully');
            }).catch((error) => {
                console.error('Error adding default channel:', error);
            });
        }
    });

    // Add event delegation for deleting a channel
    document.getElementById('channels').addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-channel')) {
            const channelId = e.target.dataset.channelId;
            const channelName = e.target.dataset.channelName;
            removeChannel(channelId, channelName);
        }
    });
}


//adding new channel to be stored in firestore
async function addChannel(channelName, userId) {
    try {
        await addDoc(collection(db, 'channels'), {
            name: channelName,
            createdBy: userId, // Store the user's UID
            createdAt: new Date()
        });
        console.log(`Channel ${channelName} added successfully`);
    } catch (error) {
        console.error("Error adding channel: ", error);
    }
}

//removing existing channels from firestore
async function removeChannel(channelId, channelName) {
    // Prevent deleting the current active channel
    if (channelName === currentChannel) {
        alert('You cannot delete the current active channel. Please switch to another channel before deleting.');
        return;
    }

    // Confirm with the user before deleting the channel
    if (!confirm(`Are you sure you want to delete the channel: #${channelName}?`)) {
        return;
    }

    try {
        // Delete the channel document from Firestore
        await deleteDoc(doc(db, 'channels', channelId));
        console.log(`Channel ${channelName} deleted successfully`);
    } catch (error) {
        console.error('Error deleting channel:', error);
    }
}

//switching between channels 
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






//sends a message with the senders message and which channels is it sent
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

//loading all chats from that particular channels
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


