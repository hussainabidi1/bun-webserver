const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const socket = new WebSocket("ws://localhost:3000");

socket.addEventListener("open", event => {
    console.log("Connected to server.");
});

socket.addEventListener("message", event => {
    const message = JSON.parse(event.data);
    console.log(`Received message from client #${message.id}: ${message.message}.`)
});