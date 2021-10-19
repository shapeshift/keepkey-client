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

const TAG = ' | KK-MAIN | '
const log = require('electron-log');
import { app, Menu, Tray, BrowserWindow, nativeTheme, ipcMain, Notification, shell } from 'electron'
const { menubar } = require('menubar');
const bip39 = require(`bip39`)
const wait = require('wait-promise');
const sleep = wait.sleep;
const usb = require('usb')
import * as core from "@shapeshiftoss/hdwallet-core"
import { NodeWebUSBKeepKeyAdapter } from "@shapeshiftoss/hdwallet-keepkey-nodewebusb";
const adapter = NodeWebUSBKeepKeyAdapter.useKeyring(new core.Keyring())
const express = require( "express" );
const bodyParser = require("body-parser");
const cors = require('cors')
const appExpress = express();
appExpress.use(cors())
appExpress.use(bodyParser.urlencoded({ extended: false }));
appExpress.use(bodyParser.json());
let server

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

  KeepKey Status codes

  state : status
  ---------------
     -1 : error
      0 : preInit
      1 : no devices
      2 : device connected
      3 : bridge online


 */

let STATUS = 'preInit'
let STATE = 0

const start_bridge = async function(event){
  try{
    let device
    try{
      device = await adapter.getDevice()
    }catch(e){
      STATE = 1
      STATUS = `no devices`
      event.sender.send('setKeepKeyState',{ state:STATE })
      event.sender.send('setKeepKeyStatus',{ status:STATUS })
    }

    if(device){
      let transport = await adapter.getTransportDelegate(device)
      await transport.connect?.()
      STATE = 2
      STATUS = 'keepkey connected'
      event.sender.send('setKeepKeyState',{ state:STATE })
      event.sender.send('setKeepKeyStatus',{ status:STATUS })

      let API_PORT = process.env["API_PORT_BRIDGE"] || "1646"
      //bridge
      appExpress.all('/exchange/device', async function (req, res, next) {
        try{
          if(req.method === 'GET'){
            let resp = await transport.readChunk()
            let output = {
              data:Buffer.from(resp).toString('hex')
            }
            console.log("output: ",output)
            event.sender.send('dataSent',{ output })
            res.status(200).json(output)
          } else if(req.method === 'POST') {
            let body = req.body
            let msg = Buffer.from(body.data, "hex")
            transport.writeChunk(msg)
            console.log("input: ",msg)
            event.sender.send('dataReceive',{ output:msg })
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
      appExpress.use((err, req, res, next) => {
        const { status = 500, message = 'something went wrong. ', data = {} } = err
        log.error(message)
        res.status(status).json({ message, data })
      })

      //port
      try{
        server = appExpress.listen( API_PORT, () => {
          event.sender.send('playSound',{ sound:'success' })
          console.log( `server started at http://localhost:${ API_PORT }` );
          STATE = 3
          STATUS = 'bridge online'
          event.sender.send('setKeepKeyState',{ state:STATE })
          event.sender.send('setKeepKeyStatus',{ status:STATUS })
        } );
      }catch(e){
        event.sender.send('playSound',{ sound:'fail' })
        STATE = -1
        STATUS = 'bridge error'
        event.sender.send('setKeepKeyState',{ state:STATE })
        event.sender.send('setKeepKeyStatus',{ status:STATUS })
        console.log("e: ",e)
      }


    } else {
      console.log("Can not start! waiting for device connect")
    }
  }catch(e){
    console.error(e)
  }
}

const stop_bridge = async function(event){
  try{

    event.sender.send('playSound',{ sound:'fail' })
    console.log("server: ",server)
    server.close(() => {
      console.log('Closed out remaining connections');
      STATE = 2
      STATUS = 'device connected'
      event.sender.send('setKeepKeyState',{ state:STATE })
      event.sender.send('setKeepKeyStatus',{ status:STATUS })
    });

  }catch(e){
    console.error(e)
  }
}


ipcMain.on('onStopBridge', async (event, data) => {
  const tag = TAG + ' | onStartBridge | '
  try {
    stop_bridge(event)

  } catch (e) {
    console.error(tag, e)
  }
})

ipcMain.on('onStartBridge', async (event, data) => {
  const tag = TAG + ' | onStartBridge | '
  try {

    start_bridge(event)

  } catch (e) {
    console.error(tag, e)
  }
})

ipcMain.on('onStartApp', async (event, data) => {
  const tag = TAG + ' | onStartApp | '
  try {

    usb.on('attach', function(device) {
      console.log("attach device: ",device)
      event.sender.send('attach',{ device })
      start_bridge(event)
    })

    usb.on('detach', function(device) {
      console.log("detach device: ",device)
      event.sender.send('detach',{ device })
      stop_bridge(event)
    })

  } catch (e) {
    console.error(tag, e)
  }
})
