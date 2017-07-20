import Extensions from './extensions';

class IPC {
    constructor() {
        this.listeners = [];

        chrome.runtime.onMessage.addListener(this._listen.bind(this));
        chrome.runtime.onMessageExternal.addListener(this._listen.bind(this));
    }

    addListener(listener) {
        this.listeners.push(listener);
    }

    _listen(request, sender, sendResponse) {
        this.listeners.forEach((listener) => listener(request, sender, sendResponse));
        return true;
    }

    async sendMessage(target, message) {
        return await new Promise((resolve) => {
            chrome.runtime.sendMessage(target, message, resolve);
        });
    }

    sendFactory(target) {
        return async (message) => {
            const ext = await Extensions.find(target);
            if (ext) {
                return await this.sendMessage(ext.id, message);
            }
        };
    }
}

export default IPC;