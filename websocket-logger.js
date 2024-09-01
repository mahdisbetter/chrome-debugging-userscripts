// ==UserScript==
// @name         websocket logger
// @author       mahdi1337
// @run-at       document-start
// ==/UserScript==

window.loggedSockets = [];

const OriginalWebSocket = WebSocket;

function arrayBufferToHexString(buffer) {
    const byteArray = new Uint8Array(buffer);
    let hexString = '';
    for (let i = 0; i < byteArray.length; i++) {
        const hex = byteArray[i].toString(16).padStart(2, '0');
        hexString += hex;
    }
    return hexString
}

function parseStackTrace(stackTrace) {
    return stackTrace
        .split('\n')
        .slice(2)
        .map(line => {
            const match = line.match(/at (\S+) \((https?:\/\/\S+)\)|at (\S+) (\S+)/);
            if (match) {
                return match[2] ? `${match[2]} at ${match[1]}` : `${match[4]} at ${match[3]}`;
            }
            return null;
        })
        .filter(Boolean)
        .join('           ');
}

window.WebSocket = function(url, protocols) {
    const ws = new OriginalWebSocket(url, protocols);

    const creationStackTrace = parseStackTrace((new Error()).stack);
    const timestamp = new Date().toISOString();

    const loggedSocket = {
        socket: ws,
        stack: creationStackTrace,
        timestamp: timestamp,
        loggedMessages: []
    };

    window.loggedSockets.push(loggedSocket);

    const originalSend = ws.send;
    ws.send = function(data) {
        const sendStackTrace = parseStackTrace((new Error()).stack);
        const timestamp = new Date().toISOString();

        loggedMessage = {
            message: data,
            stack: sendStackTrace,
            timestamp: timestamp
        }

        if (loggedMessage.message instanceof ArrayBuffer) {
          loggedMessage.message.hexString = arrayBufferToHexString(loggedMessage.message)
        }

        loggedSocket.loggedMessages.push(loggedMessage);

        return originalSend.apply(ws, arguments);
    };

    return ws;
};

window.WebSocket.prototype = OriginalWebSocket.prototype;
window.WebSocket.CONNECTING = OriginalWebSocket.CONNECTING;
window.WebSocket.OPEN = OriginalWebSocket.OPEN;
window.WebSocket.CLOSING = OriginalWebSocket.CLOSING;
window.WebSocket.CLOSED = OriginalWebSocket.CLOSED;
