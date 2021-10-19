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
const wait = require('wait-promise');
const sleep = wait.sleep;
const usb = require('usb')

//bridge
import * as core from "@shapeshiftoss/hdwallet-core"
import { NodeWebUSBKeepKeyAdapter, NodeWebUSBAdapterDelegate } from "@shapeshiftoss/hdwallet-keepkey-nodewebusb";
const adapter = NodeWebUSBKeepKeyAdapter.useKeyring(new core.Keyring())
const express = require( "express" );
const bodyParser = require("body-parser");
const cors = require('cors')
const server = express();
server.use(cors())
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
//end

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

let STATE = 'init'

const start_bridge = async function(){
  try{
    let device = await adapter.getDevice()
    if(!device) STATE = 'no device!'
    if(device){
      let transport = await adapter.getTransportDelegate(device)
      await transport.connect?.()

      let API_PORT = process.env["API_PORT_BRIDGE"] || "1646"
      //bridge
      server.all('/exchange/device', async function (req, res, next) {
        try{
          if(req.method === 'GET'){
            let resp = await transport.readChunk()
            let output = {
              data:Buffer.from(resp).toString('hex')
            }
            console.log("output: ",output)
            res.status(200).json(output)
          } else if(req.method === 'POST') {
            let body = req.body
            let msg = Buffer.from(body.data, "hex")
            transport.writeChunk(msg)
            console.log("input: ",msg)
            res.status(200).json({ })
          } else {
            throw Error('unhandled')
          }
          next()
        }catch(e){
          log.error(e)
          throw e
        }
      });

      //catchall
      server.use((err, req, res, next) => {
        const { status = 500, message = 'something went wrong. ', data = {} } = err
        log.error(message)
        res.status(status).json({ message, data })
      })

      //port
      server.listen( API_PORT, () => {
        console.log( `server started at http://localhost:${ API_PORT }` );
      } );

    } else {
      console.log("Can not start! waiting for device connect")
    }
  }catch(e){
    console.error(e)
  }
}

ipcMain.on('onStartBridge', async (event, data) => {
  const tag = TAG + ' | onStartBridge | '
  try {
    start_bridge()

    usb.on('attach', function(device) {
      console.log("attach device: ",device)
      start_bridge()
    })

    usb.on('detach', function(device) {
      console.log("detach device: ",device)
    })

  } catch (e) {
    console.error(tag, e)
  }
})
