// electron/preload.cjs
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  // Main → Renderer: GEP 이벤트 수신
  onGepInfoUpdate: (callback) => {
    ipcRenderer.on('gep:info-update', (_, data) => callback(data))
  },
  onGepGameEvent: (callback) => {
    ipcRenderer.on('gep:game-event', (_, data) => callback(data))
  },
  offGepListeners: () => {
    ipcRenderer.removeAllListeners('gep:info-update')
    ipcRenderer.removeAllListeners('gep:game-event')
  },
})