const port = 3000;
const clients = new Map();
let counter = 0;

function getID() {
    counter++;
    return counter;
};

Bun.serve({
    development: true,
    port: port,
    async fetch(req, server) {
        if (new URL(req.url).pathname === "/") {
            if (server.upgrade(req)) {
                return;
            }
            return new Response(Bun.file("./public/index.html"));
        };
        const filePath = "./public" + new URL(req.url).pathname;
        const file = Bun.file(filePath);
        return new Response(file);
    },
    websocket: {
        open(ws) {
            const id = getID();
            clients.set(ws, id);
            console.log(`Client #${clients.get(ws)} connected.`);
        },
        message(ws, message) {
            console.log(`Received message from client #${clients.get(ws)}: ${message}.`);
            const messageToBeSent = JSON.stringify({ id: clients.get(ws), message: message });
            clients.forEach(function (value, key) {
                key.send(messageToBeSent);
            })
        },
        close(ws) {
            clients.delete(ws);
        },
    },
    error() {
        return new Response(null, { status: 404 });
    },
});

console.log(`Server listening on port ${port}`);