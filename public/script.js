//const socket = io('https://service11carchat24test.chatlead.com',{path:'/gpt-bot/socket.io'});
const socket = io();

const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");
const msgBoxContainerDiv = document.getElementById("msgBoxContainer");
const messages = document.getElementById("messages");
const timeText = document.getElementById("txtTime");
const loader = document.getElementById("loader");
const userImg = "https://img.icons8.com/color/36/000000/administrator-male.png";
const assistantImg = "https://img.icons8.com/office/36/000000/person-female.png";
window.onload = (event) => {
    timeText.innerText = printCurrentTime();
    displayChatTexts();
};
printCurrentTime = () => {
    return new Date().toLocaleString('en-In', { weekday: 'short', day: '2-digit', hour: 'numeric', minute: 'numeric', hour12: true });
}
function displayMessage(role, message) {
    const div = `<div class="direct-chat-msg ${role === "user" ? 'right' : ''}">
  <div class="direct-chat-info clearfix">
    <span class="direct-chat-name pull-${role === "user" ? 'right mr-10' : 'left'}">${role === "user" ? 'you' : 'Operator'}</span>
  </div>
  <img class="direct-chat-img" src="${role === "user" ? userImg : assistantImg}" alt="message user image">
  <div class="direct-chat-text">
    ${message}
  </div>
  <span class="direct-chat-timestamp pull-${role === "user" ? 'left' : 'right'}">${printCurrentTime()}</span>
</div>`
    messages.innerHTML += div;
    messages.scrollTop = messages.scrollHeight;
    scrollToBottom();
}
function clearLocalStorage() {
    localStorage.removeItem("cl-gpt-context");
    document.getElementById("chatMsg-box-container").style.display = "none";
    socket.emit("removeLocalStorageData")
    setTimeout(() => {
        messages.innerHTML = '';
        displayMessage('assistant', 'Hello, Welcome to CarChat24 Ford Tarpon dealership');
        document.getElementById("chatMsg-box-container").style.display = "block";
    }, 200);
}

function displayChatTexts() {
    if (localStorage.getItem("cl-gpt-context") !== null) {
        getLdata = JSON.parse(localStorage.getItem("cl-gpt-context"));
        getLdata.forEach((d) => {
            displayMessage(d.role, d.content);
        });
    }
}

function getSetLocalStorageData(message, isUser = true) {
    const gptLocalData = { role: `${isUser ? 'user' : 'assistant'}`, content: message, active: true };
    let getLdata = [];
    if (localStorage.getItem("cl-gpt-context") === null) {
        getLdata.push(gptLocalData);
        localStorage.setItem("cl-gpt-context", JSON.stringify(getLdata));
    } else {
        getLdata = JSON.parse(localStorage.getItem("cl-gpt-context"));
        getLdata.push(gptLocalData);
        localStorage.setItem("cl-gpt-context", JSON.stringify(getLdata));
    }
    return getLdata;
}
function getLocalStorageData() {
    return JSON.parse(localStorage.getItem("cl-gpt-context"));
}
function disableLocalStorage() {
    let localStrData = JSON.parse(localStorage.getItem("cl-gpt-context"));
    let counter = 0;
    localStrData.map((d) => { if (d.active && d.role === "user" && counter < 2) { counter++; return ({ ...d, active: false }); } else { return ({ ...d }) } })
    //localStrData.map((d) => { if (d.active && counter < 2) { counter++; return ({ ...d, active: false }); } else { return ({ ...d }) } })
}

messageForm.addEventListener("submit", submitForm);

messageInput.addEventListener("keypress", function (event) {
    if ((event.keyCode == 10 || event.keyCode == 13)) {
        event.preventDefault();
        submitForm(event);
    }
});

function submitForm(e) {
    e?.preventDefault();
    const message = messageInput.value;
    messageInput.value = ""
    messageInput.disabled = true;
    displayMessage("user", message); // Display user's message in the chat
    getSetLocalStorageData(message);
    const gptMsgData = { role: 'user', content: message };
    socket.emit("sendMessage", gptMsgData, (error) => {
        if (error) {
            messageInput.disabled = false;
            loader.style.display = "none";
            console.log(error);
            return alert(error.message);
        }
        messageInput.value = "";
        messageInput.focus();
    });
}
function urlify(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    var emailRegex = /([\w-\.]+@([\w-]+\.)+[\w-]{2,4}$)/g;
    var phoneRegex = /([+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$)/g;
    let tempText = '';
    tempText = text.replace(urlRegex, function (url) {
        return '<a href="' + url + '" target=”_blank”>' + url + '</a>';
    })
    tempText = tempText.replace(emailRegex, function (email) {
        return '<a href="mailto:' + email + '" target=”_blank”>' + email + '</a>';
    });
    tempText = tempText.replace(phoneRegex, function (phone) {
        return '<a href="tel:' + phone + '" target=”_blank”>' + phone + '</a>';
    });
    return tempText;
}
function scrollToBottom() {
    msgBoxContainerDiv.scrollTop = msgBoxContainerDiv.scrollHeight;
}
socket.on("message", (message) => {
    const response = message.response;
    getSetLocalStorageData(response, false);
    const allTokens = message.totalTokens;
    if (allTokens > 4200) {
        disableLocalStorage();
    }
    displayMessage("assistant", response); // Display assistant's message in the chat
    messageInput.disabled = false;
    loader.style.display = "none";
});
socket.on("typing", (message) => {
    loader.style.display = "block";
});

socket.on("initialized", (message) => {
    socket.emit("sendInitialData", getLocalStorageData())
});


