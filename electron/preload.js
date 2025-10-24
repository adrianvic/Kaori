const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('isElectron', true);
contextBridge.exposeInMainWorld('DB', {
  getPreference: (key) => ipcRenderer.invoke('db:getPreference', key),
  setPreference: (key, value) => ipcRenderer.invoke('db:setPreference', key, value),
});