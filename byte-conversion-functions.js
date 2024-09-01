// ==UserScript==
// @name         byte conversion functions
// @author       mahdi1337
// @run-at       document-start
// ==/UserScript==

window.hexStringToArrayBuffer = (hexString) => {
    if (hexString.length % 2 !== 0) {
        throw new Error('Hex string must be even');
    }

    const byteArray = new Uint8Array(hexString.length / 2);
    for (let i = 0; i < byteArray.length; i++) {
        const byte = hexString.substr(i * 2, 2);
        byteArray[i] = parseInt(byte, 16);
    }

    return byteArray.buffer;
}

window.arrayBufferToHexString = (buffer) => {
    const byteArray = new Uint8Array(buffer);
    let hexString = '';
    for (let i = 0; i < byteArray.length; i++) {
        const hex = byteArray[i].toString(16).padStart(2, '0');
        hexString += hex;
    }
    return hexString;
}

window.b64StringToArrayBuffer = (b64String) => {
    const binaryString = atob(b64String);
    const byteArray = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        byteArray[i] = binaryString.charCodeAt(i);
    }
    return byteArray.buffer;
}

window.arrayBufferToB64String = (buffer) => {
    const byteArray = new Uint8Array(buffer);
    let binaryString = '';
    for (let i = 0; i < byteArray.length; i++) {
        binaryString += String.fromCharCode(byteArray[i]);
    }
    return btoa(binaryString);
}
