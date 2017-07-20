import IPCFactory from '../utils/ipc';
import Extensions from '../utils/extensions';
import Tabs from '../utils/tabs';
const IPC = new IPCFactory();

IPC.addListener((request, sender, sendResponse) => {
    console.log('IPC background', request, sender, sendResponse);
    sendResponse({ extension: true });
});
const IPCSend = IPC.sendFactory('DevCenterApp');

async function getAppTab() {
    const app = await Extensions.find('DevCenterApp');
    const tabs = await Tabs.getAll();

    return tabs.filter((tab) => tab.url.includes(app.id))[0];
}

async function startApp() {
    const appTabs = await getAppTab();

    if (!appTabs) {
        Extensions.launchApp('DevCenterApp');
    } else {
        Tabs.activate(appTabs.id);
    }
}

chrome.browserAction.onClicked.addListener(startApp);