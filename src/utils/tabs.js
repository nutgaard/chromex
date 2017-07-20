class Tabs {
    static async getAll() {
        return await new Promise((resolve) => {
            chrome.tabs.query({}, resolve);
        });
    }

    static async activate(tabId) {
        return await new Promise((resolve) => {
            chrome.tabs.update(tabId, { active: true });
            resolve();
        });
    }
}

export default Tabs;