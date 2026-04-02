const { app, BrowserWindow, globalShortcut } = require('electron')
const path = require('path')

const isDev = process.env.NODE_ENV === 'development'

function createWindow() {
  const win = new BrowserWindow({
    width:           420,
    height:          800,
    // transparent:     true,
    // frame:           false,
    // alwaysOnTop:     true,
    transparent:     false,
    frame:           true,
    alwaysOnTop:     false,
    skipTaskbar:     false,
    resizable:       true,
    webPreferences: {
      preload:          path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration:  false,
    },
  })

  // ← 이 부분이 핵심
  if (isDev) {
    win.loadURL('http://localhost:5173')
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  // Alt+T: 오버레이 표시/숨김 토글
  globalShortcut.register('Alt+T', () => {
    win.isVisible() ? win.hide() : win.show()
  })

  // 드래그용 — 타이틀바 없으므로 JS로 처리
  win.on('closed', () => globalShortcut.unregisterAll())
}

app.whenReady().then(createWindow)
app.on('window-all-closed', () => app.quit())