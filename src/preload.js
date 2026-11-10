const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('koala', {
  getSources: () => ipcRenderer.invoke('sources:get'),
  addSource: source => ipcRenderer.invoke('sources:add', source),
  removeSource: location => ipcRenderer.invoke('sources:remove', location),
  pickFile: () => ipcRenderer.invoke('file:pick'),
  getBasePlaylist: () => ipcRenderer.invoke('playlist:base'),
  fetchEpg: url => ipcRenderer.invoke('epg:fetch', url),
  fetchPlaylist: url => ipcRenderer.invoke('playlist:fetch', url)
});
