const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  // 창 드래그 (타이틀바 없을 때 필요)
  minimize: () => ipcRenderer.send('win:minimize'),
  close:    () => ipcRenderer.send('win:close'),

  // 실행 환경 확인 (React에서 Electron인지 웹인지 구분용)
  isElectron: true,
})