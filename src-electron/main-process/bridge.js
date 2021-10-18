/*
    KeepKey Bridge module
 */
import * as core from "@shapeshiftoss/hdwallet-core"
import { NodeWebUSBKeepKeyAdapter, NodeWebUSBAdapterDelegate } from "@shapeshiftoss/hdwallet-keepkey-nodewebusb";
const adapter = NodeWebUSBKeepKeyAdapter.useKeyring(new core.Keyring())
const express = require( "express" );
const bodyParser = require("body-parser");
const cors = require('cors')
const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let API_PORT = process.env["API_PORT_BRIDGE"] || "1646"
API_PORT = parseInt(API_PORT)

let WALLET_TRANSPORT = {}

//bridge
app.all('/exchange/device', async function (req, res, next) {
    try{
        if(req.method === 'GET'){
            let resp = await WALLET_TRANSPORT.readChunk()
            let output = {
                data:Buffer.from(resp).toString('hex')
            }
            res.status(200).json(output)
        } else if(req.method === 'POST') {
            let body = req.body
            let msg = Buffer.from(body.data, "hex")
            WALLET_TRANSPORT.writeChunk(msg)
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
app.use((err, req, res, next) => {
    const { status = 500, message = 'something went wrong. ', data = {} } = err
    log.error(message)
    res.status(status).json({ message, data })
})

const start_server = async function(){
    try{

        let device = await adapter.getDevice()
        WALLET_TRANSPORT = await adapter.getTransportDelegate(device)
        await WALLET_TRANSPORT.connect?.()

        app.listen( API_PORT, () => {
            console.log( `server started at http://localhost:${ API_PORT }` );
        } );
    }catch(e){
        log.error(e)
    }
}

module.exports = {
    startServer: async function () {
        return start_server();
    }
}
