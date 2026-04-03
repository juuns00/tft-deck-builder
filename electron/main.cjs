// electron/main.cjs
const { app, BrowserWindow, globalShortcut } = require('electron')
const path = require('path')

const isDev = process.env.NODE_ENV === 'development'

function setupGep() {
  const gep = app.overwolf?.packages?.gep
  if (!gep) return

  // game_info가 바뀔 때마다 확인
  gep.on('new-info-update', (e, gameId, ...args) => {
    const info = args[0]
    console.log('[GEP] info update:', gameId, JSON.stringify(info))

    // TFT 인게임 진입 감지 → TFT 피처 등록
    if (
      info?.feature === 'game_info' &&
      info?.key === 'selected_game' &&
      info?.value === 'tft'
    ) {
      console.log('[GEP] TFT 감지 — TFT 피처 등록 시도')
      gep.setRequiredFeatures(['board', 'store', 'match_info'])
        .then(() => console.log('[GEP] TFT 피처 등록 완료'))
        .catch(e => console.warn('[GEP] TFT 피처 등록 실패:', e))
    }

    BrowserWindow.getAllWindows().forEach(win => {
      win.webContents.send('gep:info-update', { gameId, data: args })
    })
  })

  gep.on('new-game-event', (e, gameId, ...args) => {
    console.log('[GEP] game event:', gameId, args)
    BrowserWindow.getAllWindows().forEach(win => {
      win.webContents.send('gep:game-event', { gameId, data: args })
    })
  })

  // 초기 피처 등록 (클라이언트 기본 피처)
  gep.setRequiredFeatures([
    'summoner_info', 'game_info', 'game_flow',
    'board', 'store', 'match_info'
  ])
    .then(() => console.log('[GEP] 전체 피처 등록 완료'))
    .catch(e => console.warn('[GEP] 피처 등록 실패:', e))
}

function createWindow() {
  const win = new BrowserWindow({
    width:       1200,
    height:      800,
    transparent: false,
    frame:       true,
    alwaysOnTop: false,
    skipTaskbar: false,
    resizable:   true,
    webPreferences: {
      preload:          path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration:  false,
    },
  })

  if (isDev) {
    win.loadURL('http://localhost:5173')
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  globalShortcut.register('Alt+T', () => {
    win.isVisible() ? win.hide() : win.show()
  })

  win.on('closed', () => globalShortcut.unregisterAll())
}

app.whenReady().then(() => {
  createWindow()

  // GEP는 패키지가 로드된 후 설정
  // packages-ready 이벤트 또는 딜레이 후 시도
  app.overwolf?.packages?.on?.('ready', () => {
    console.log('[Overwolf] packages ready')
    setupGep()
  })

  // fallback: 2초 후 직접 시도
  setTimeout(() => {
    if (app.overwolf?.packages?.gep) {
      setupGep()
    }
  }, 2000)
})

app.on('window-all-closed', () => app.quit())