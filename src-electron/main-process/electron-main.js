/**
 *
 *  KeepKey client
 *
 *
 *
 *
 *
 *
 * @type {string}
 */

const TAG = ' | ELECTRON-MAIN | '
const log = require('electron-log');
import { app, Menu, Tray, BrowserWindow, nativeTheme, ipcMain, Notification, shell } from 'electron'
const { menubar } = require('menubar');
const bip39 = require(`bip39`)
let wait = require('wait-promise');
let sleep = wait.sleep;
const bridge = require("@keepkey/keepkey-bridge")

const EVENT_LOG = []

/*
      MenuBar

        - Osx
 */

/*
    Electron Settings
 */

try {
  if (process.platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(require('path').join(app.getPath('userData'), 'DevTools Extensions'))
  }
} catch (_) { }

/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD) {
  global.__statics = __dirname
}

let mainWindow
// let approveWindow

//TODO :pray: someday menubar again?
// function createPreviewDashboard(){
//   previewWindow = new BrowserWindow({
//     width: 1000,
//     height: 600,
//     useContentSize: true,
//     webPreferences: {
//       // Change from /quasar.conf.js > electron > nodeIntegration;
//       // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
//       nodeIntegration: process.env.QUASAR_NODE_INTEGRATION,
//       nodeIntegrationInWorker: process.env.QUASAR_NODE_INTEGRATION,
//
//       // More info: /quasar-cli/developing-electron-apps/electron-preload-script
//       // preload: path.resolve(__dirname, 'electron-preload.js')
//     }
//   })
//   return previewWindow
// }

function bringWindowToFront(){
  try{

    //
    mainWindow.setAlwaysOnTop(true)

  }catch(e){
    log.error(e)
  }
}

function releaseWindowFromTop(){
  try{

    //
    mainWindow.setAlwaysOnTop(false)

  }catch(e){
    log.error(e)
  }
}

function createWindow () {
  /**
   * Menu Bar
   */
  //TODO crash (only on build) image could not be created from "blabla" menu-icon-large.png
  log.info("Creating window!")
  //TODO why this no work?
  // previewWindow = createPreviewDashboard()

  // const tray = new Tray(iconPath);
  // const contextMenu = Menu.buildFromTemplate([
  //   {
  //     label: 'Open App', type: 'radio', click(){
  //       console.log("Open App was clicked!")
  //     }
  //   }
  // ])
  // tray.setToolTip('This is my application.')
  // tray.setContextMenu(contextMenu)

  //TODO focus on event https://stackoverflow.com/questions/53702044/how-do-i-bring-a-window-to-the-front-without-switching-apps-in-electron/62942825


  /**
   * Initial window options
   *
   * more options: https://www.electronjs.org/docs/api/browser-window
   */
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    useContentSize: true,
    //TODO make toggle
    //remember last setting?
    //alwaysOnTop: true,
    webPreferences: {
      // Change from /quasar.conf.js > electron > nodeIntegration;
      // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
      nodeIntegration: process.env.QUASAR_NODE_INTEGRATION,
      nodeIntegrationInWorker: process.env.QUASAR_NODE_INTEGRATION,

      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      // preload: path.resolve(__dirname, 'electron-preload.js')
    }
  })

  mainWindow.loadURL(process.env.APP_URL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

}

app.setAsDefaultProtocolClient('keepkey');
// Export so you can access it from the renderer thread


app.on('ready', createWindow)


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})


/*
    IPC to UI
 */

ipcMain.on('updateKeepKeyState', async (event, data) => {
  const tag = TAG + ' | updateKeepKeyState | '
  try {

    let state = bridge.hardwareState()
    log.info(tag,"state: ",state)
    event.sender.send('setKeepKeyState',{
      status:state.state
    })

    event.sender.send('setKeepKeyStatus',{
      status:state.msg
    })

  } catch (e) {
    console.error(tag, e)
  }
})

ipcMain.on('onStartBridge', async (event, data) => {
  const tag = TAG + ' | onStartBridge | '
  try {

    //start server
    let startServer = await bridge.startServer()
    //TODO handle port claimed
    log.info("startServer: ",startServer)

    //onStartBridge
    let kk = await bridge.startKeepkey()

    let state = bridge.hardwareState()
    log.info(tag,"state: ",state)
    event.sender.send('setKeepKeyState',{
      state:state.state
    })

    event.sender.send('setKeepKeyStatus',{
      status:state.msg
    })

    //bridge on event
    kk.events.on('event', async function(event) {
      log.info(tag,"event: ",event)
      EVENT_LOG.push(event)

      //TODO handle events push to renderer

    });

  } catch (e) {
    console.error(tag, e)
  }
})
