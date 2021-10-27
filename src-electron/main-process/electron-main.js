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

const TAG = " | KK-MAIN | ";
const log = require("electron-log");
import { app, Menu, Tray, BrowserWindow, nativeTheme, ipcMain } from "electron";
const usb = require("usb");
const AutoLaunch = require("auto-launch");
import * as core from "@shapeshiftoss/hdwallet-core";
import { NodeWebUSBKeepKeyAdapter } from "@shapeshiftoss/hdwallet-keepkey-nodewebusb";
const adapter = NodeWebUSBKeepKeyAdapter.useKeyring(new core.Keyring());
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const appExpress = express();
appExpress.use(cors());
appExpress.use(bodyParser.urlencoded({ extended: false }));
appExpress.use(bodyParser.json());
const path = require("path");
let server;
let tray;
let STATE = 0;
let isQuitting = false;
let eventIPC;

const assetsDirectory = path.join(__dirname, "assets");
const EVENT_LOG = [];

/*
    Electron Settings
 */

try {
  if (
    process.platform === "win32" &&
    nativeTheme.shouldUseDarkColors === true
  ) {
    require("fs").unlinkSync(
      require("path").join(app.getPath("userData"), "DevTools Extensions")
    );
  }
} catch (_) {}

/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD) {
  global.__statics = __dirname;
}

let mainWindow;
const lightDark = nativeTheme.shouldUseDarkColors ? "dark" : "light";

const menuTemplate = [
  {
    label: "Bridge Not Running",
    enabled: false,
    type: "normal",
    icon: path.join(assetsDirectory, "status/unknown.png"),
  },
  { label: "", type: "separator" },
  {
    label: "Start Bridge",
    click: function(event) {
      start_bridge(eventIPC);
      console.log("start bridge!!");
    },
    enabled: true,
  },
  {
    label: "Stop Bridge",
    enabled: false,
    click: function(event) {
      console.log("stop bridge");
      stop_bridge(eventIPC);
    },
  },
  //
  { label: "", type: "separator" },
  {
    label: "Toggle App",
    click: function(event) {
      console.log("show App");
      if (mainWindow.isVisible()) {
        mainWindow.hide();
        app.dock.hide();
      } else {
        mainWindow.show();
        app.dock.hide();
      }
    },
  },
  {
    label: "Disable Auto Launch",
    click: function(event) {
      console.log("show App");
      kkAutoLauncher.disable();
    },
  },
  {
    label: "Quit KeepKey Bridge",
    type: "normal",
    click: function(event) {
      console.log("quit bridge");
      app.quit();
      process.exit(0);
    },
  },
];

const createTray = (eventIpc) => {
  eventIPC = eventIpc;
  const trayIcon = `${lightDark}/keepKey/unknown.png`;
  tray = new Tray(path.join(assetsDirectory, trayIcon));
  const contextMenu = Menu.buildFromTemplate(menuTemplate);
  tray.setContextMenu(contextMenu);
};

const updateMenu = (status) => {
  let icon = "unknown";
  switch (status) {
    case -1:
      menuTemplate[0].label = "Error";
      menuTemplate[0].icon = path.join(assetsDirectory, "status/error.png");
      icon = "error";
      break;
    case 0:
      menuTemplate[0].label = "Initializing";
      menuTemplate[0].icon = path.join(assetsDirectory, "status/unknown.png");
      icon = "unknown";
      break;
    case 1:
      menuTemplate[0].label = "No Devices";
      menuTemplate[0].icon = path.join(assetsDirectory, "status/unknown.png");
      icon = "unknown";
      break;
    case 2:
      menuTemplate[0].label = "Bridge Not Running";
      menuTemplate[0].icon = path.join(assetsDirectory, "status/unknown.png");
      icon = "unknown";
      break;
    case 3:
      menuTemplate[0].label = "Bridge Running";
      menuTemplate[0].icon = path.join(assetsDirectory, "status/success.png");
      menuTemplate[2].enabled = false;
      menuTemplate[3].enabled = true;
      icon = "success";
      break;
  }
  const updatedMenu = Menu.buildFromTemplate(menuTemplate);
  tray.setContextMenu(updatedMenu);
  tray.setImage(path.join(assetsDirectory, `${lightDark}/keepKey/${icon}.png`));
};

function createWindow() {
  /**
   * Menu Bar
   */
  log.info("Creating window!");

  //Auto launch on startup
  let kkAutoLauncher = new AutoLaunch({
    name: "keepkey-client",
    path: "/Applications/kkAutoLauncher.app",
  });
  kkAutoLauncher.enable();
  kkAutoLauncher
    .isEnabled()
    .then(function(isEnabled) {
      if (isEnabled) {
        return;
      }
      kkAutoLauncher.enable();
    })
    .catch(function(err) {
      console.error("failed to enable auto launch: ", kkAutoLauncher);
    });

  /**
   * Initial window options
   *
   * more options: https://www.electronjs.org/docs/api/browser-window
   */
  mainWindow = new BrowserWindow({
    width: 400,
    height: 250,
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
    },
  });

  mainWindow.loadURL(process.env.APP_URL);

  mainWindow.on("close", (e) => {
    if (!isQuitting) {
      e.preventDefault();
      mainWindow.hide();
      app.dock.hide();
    }
  });

  // mainWindow.on("closed", () => {

  // });
}

app.setAsDefaultProtocolClient("keepkey");
// Export so you can access it from the renderer thread

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on("before-quit", () => {
  isQuitting = true;
});

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

let STATUS = "preInit";

const start_bridge = async function(event) {
  try {
    let device;
    try {
      device = await adapter.getDevice();
    } catch (e) {
      STATE = 1;
      STATUS = `no devices`;
      event.sender.send("setKeepKeyState", { state: STATE });
      event.sender.send("setKeepKeyStatus", { status: STATUS });
      console.log(tray);
    }

    if (device) {
      let transport = await adapter.getTransportDelegate(device);
      await transport.connect?.();
      STATE = 2;
      STATUS = "keepkey connected";
      event.sender.send("setKeepKeyState", { state: STATE });
      event.sender.send("setKeepKeyStatus", { status: STATUS });

      let API_PORT = process.env["API_PORT_BRIDGE"] || "1646";
      //bridge
      appExpress.all("/exchange/device", async function(req, res, next) {
        try {
          if (req.method === "GET") {
            let resp = await transport.readChunk();
            let output = {
              data: Buffer.from(resp).toString("hex"),
            };
            console.log("output: ", output);
            EVENT_LOG.push({ read: output });
            event.sender.send("dataSent", { output });
            res.status(200).json(output);
          } else if (req.method === "POST") {
            let body = req.body;
            let msg = Buffer.from(body.data, "hex");
            transport.writeChunk(msg);
            console.log("input: ", msg);
            EVENT_LOG.push({ write: output });
            event.sender.send("dataReceive", { output: msg });
            res.status(200).json({});
          } else {
            throw Error("unhandled");
          }
          next();
        } catch (e) {
          log.error(e);
          throw e;
        }
      });

      //catchall
      appExpress.use((err, req, res, next) => {
        const {
          status = 500,
          message = "something went wrong. ",
          data = {},
        } = err;
        log.error(message);
        res.status(status).json({ message, data });
      });

      //port
      try {
        server = appExpress.listen(API_PORT, () => {
          event.sender.send("playSound", { sound: "success" });
          console.log(`server started at http://localhost:${API_PORT}`);
          STATE = 3;
          STATUS = "bridge online";
          event.sender.send("setKeepKeyState", { state: STATE });
          event.sender.send("setKeepKeyStatus", { status: STATUS });
          updateMenu(STATE);
        });
      } catch (e) {
        event.sender.send("playSound", { sound: "fail" });
        STATE = -1;
        STATUS = "bridge error";
        event.sender.send("setKeepKeyState", { state: STATE });
        event.sender.send("setKeepKeyStatus", { status: STATUS });
        updateMenu(STATE);
        console.log("e: ", e);
      }
    } else {
      console.log("Can not start! waiting for device connect");
    }
  } catch (e) {
    console.error(e);
  }
};

const stop_bridge = async function(event) {
  try {
    event.sender.send("playSound", { sound: "fail" });
    console.log("server: ", server);
    server.close(() => {
      console.log("Closed out remaining connections");
      STATE = 2;
      STATUS = "device connected";
      event.sender.send("setKeepKeyState", { state: STATE });
      event.sender.send("setKeepKeyStatus", { status: STATUS });
      updateMenu(STATE);
    });
  } catch (e) {
    console.error(e);
  }
};

ipcMain.on("onStopBridge", async (event, data) => {
  const tag = TAG + " | onStartBridge | ";
  try {
    stop_bridge(event);
  } catch (e) {
    console.error(tag, e);
  }
});

ipcMain.on("onStartBridge", async (event, data) => {
  const tag = TAG + " | onStartBridge | ";
  try {
    start_bridge(event);
  } catch (e) {
    console.error(tag, e);
  }
});

ipcMain.on("onStartApp", async (event, data) => {
  const tag = TAG + " | onStartApp | ";
  try {
    createTray(event);

    usb.on("attach", function(device) {
      console.log("attach device: ", device);
      event.sender.send("attach", { device });
      start_bridge(event);
    });

    usb.on("detach", function(device) {
      console.log("detach device: ", device);
      event.sender.send("detach", { device });
      stop_bridge(event);
    });
  } catch (e) {
    console.error(tag, e);
  }
});
