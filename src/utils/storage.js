class Storage {
    async set(key, val) {
        return await new Promise((resolve, reject) => {
            chrome.storage.sync.set({ [key]: val }, () => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve();
                }
            })
        });
    }

    async get(key) {
        return await new Promise((resolve, reject) => {
            chrome.storage.sync.get(key, (res) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(res);
                }
            });
        })
    }

    async clear() {
        return await new Promise((resolve, reject) => {
            chrome.storage.sync.clear(() => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve();
                }
            })
        });
    }
}

export default Storage;
