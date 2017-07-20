import IPCFactory from './../utils/ipc';
const IPC = new IPCFactory();

console.log('app');
const IPCSend = IPC.sendFactory('DevCenter');
IPC.addListener((request, sender, sendResponse) => {
    console.log('IPC', request, sender, sendResponse);
    sendResponse({app: 'ok'});
});
