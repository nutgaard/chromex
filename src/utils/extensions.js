const first = () => true;
const last = (_, i, l) => i === l.length - 1;

class Extensions {
    static async getAll() {
        return await new Promise((resolve) => {
            chrome.management.getAll(resolve);
        });
    }

    static async find(name) {
        return await new Promise((resolve, reject) => {
            chrome.management.getAll((exts) => {
                const found = exts
                    .filter((ext) => ext.name === name)
                    .find(first);

                found ? resolve(found) : reject();
            });
        });
    }

    static async launchApp(name) {
        return await Extensions.find(name)
            .then((ext) => {
                return new Promise((resolve) => chrome.management.launchApp(ext.id, resolve))
            });
    }
}

export default Extensions;