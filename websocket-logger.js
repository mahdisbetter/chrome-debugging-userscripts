// ==UserScript==
// @name         websocket logger
// @author       mahdi1337
// @run-at       document-start
// ==/UserScript==

window.loggedWSHook = null;
window.loggedWSMessageHook = null;

window.loggedWebSockets = [];

const OriginalWebSocket = WebSocket;

function arrayBufferToHexString(buffer) {
    const byteArray = new Uint8Array(buffer);
    let hexString = '';

    for (let i = 0; i < byteArray.length; i++) {
        const hex = byteArray[i].toString(16).padStart(2, '0');
        hexString += hex;
    }

    return hexString;
}

function arrayBufferToB64String(buffer) {
    const byteArray = new Uint8Array(buffer);
    let binaryString = '';

    for (let i = 0; i < byteArray.length; i++) {
        binaryString += String.fromCharCode(byteArray[i]);
    }

    return btoa(binaryString);
}

window.WebSocket = function (url, protocols) {
    const ws = new OriginalWebSocket(url, protocols);

    const creationStackTrace = new Error();
    const timestamp = new Date().toISOString();

    const loggedSocket = {
        socket: ws,
        timestamp: timestamp,
        loggedMessages: [],
        stack: creationStackTrace,
    };

    window.loggedWebSockets.push(loggedSocket);

    if (typeof window.loggedWSHook === 'function') {
        window.loggedWSHook(loggedSocket);
    }

    const originalSend = ws.send;

    ws.send = function (data) {
        const sendStackTrace = new Error();
        const timestamp = new Date().toISOString();

        let loggedMessage = {
            message: data,
            timestamp: timestamp,
            stack: sendStackTrace,
            socket: loggedSocket,
        };

        if (loggedMessage.message instanceof ArrayBuffer) {
            loggedMessage.message.hexString = arrayBufferToHexString(loggedMessage.message);
            loggedMessage.message.b64String = arrayBufferToB64String(loggedMessage.message);
        }

        loggedSocket.loggedMessages.push(loggedMessage);

        if (typeof window.loggedWSMessageHook === 'function') {
            window.loggedWSMessageHook(loggedMessage);
        }

        return originalSend.apply(ws, arguments);
    };

    return ws;
};

window.WebSocket.prototype = OriginalWebSocket.prototype;
window.WebSocket.CONNECTING = OriginalWebSocket.CONNECTING;
window.WebSocket.OPEN = OriginalWebSocket.OPEN;
window.WebSocket.CLOSING = OriginalWebSocket.CLOSING;
window.WebSocket.CLOSED = OriginalWebSocket.CLOSED;
