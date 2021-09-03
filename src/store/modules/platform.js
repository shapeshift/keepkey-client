const state = {
    testnet:false,
    blockchains:[],
    locale:"english",
    context:null,
    invocationContext:null,
    invocationContextState:"",
    username:"",
    pioneerUrl:"",
    pioneerLive:false,
    usersOnline:[],
    coins: [],
    paths: [],
    pubkeys: [],
    apps: [],
    totalUsd: 0,
    viewSeed: "",
    layout:[],
    wallets: [],
    walletContexts: [],
    devices: [],
    allUsbDevices:[],
    allKeepKeys:[],
    keepKeyState:0,
    keepKeyStatus:"unknown",
    walletInfo: {}, //Current wallet context
    mnemonic: null,
    walltedLoaded: false,
    walletSendInfo:{},
    recentEvents:[],
    walletStart: {},
    assetLoading: false,
    txBuilding: false,
    keepkeyConnected:false
}

const getters = {
    // isTestnet:state => state.testnet,
    username:state => state.username,
    getUsername:state => state.username,
    getTotal:state => state.totalUsd,
    wallets:state => state.wallets,
    getWallets:state => state.wallets,
    layout:state => state.layout,
    devices:state => state.devices,
    getDevices:state => state.devices,
    getWalletContexts:state => state.walletContexts,
    getCoins:state => state.coins,
    context:state => state.context,
    getContext:state => state.context,
    getKeepKeyState:state => state.keepKeyState,
    getKeepKeyStatus:state => state.keepKeyStatus,
    getInvocationContext:state => state.invocationContext,
    getInvocationContextState:state => state.invocationContextState,
    getPubkeys:state => state.pubkeys,
    getPioneerLive: state => state.pioneerLive,
    getPioneerUrl: state => state.pioneerUrl,
    getMnemonic: state => state.mnemonic,
    getUsersOnline: state => state.usersOnline,
    getAllUsbDevices: state => state.allUsbDevices,
    getAllKeepKeys: state => state.allKeepKeys,
    walletStart: (state) => state.walletStart,
    getWalletSendInfo: state => state.walletSendInfo,
    getMasterAddresses: state => state.masterAddresses,
    getBalances: state => state.balances,
    getWalletInfo: state => state.walletInfo,
    getWalletLoaded: state => state.walltedLoaded,
    getAssetLoading: state => state.assetLoading,
    getKeepkeyConnected: state => state.keepkeyConnected,
    txBuilding: state => state.txBuilding
}

const actions = {
    updatePrice({ commit }, payload) {
        commit('SetPrice', payload)
    }
}

const mutations = {
    registerApp(state, app) {
      if (state.layout.filter(e => e.type === app.type).length === 0) {
        state.layout.push(app)
      } else {
        console.log("app already in dashboard")
      }
    },
    setLocale(state, locale) {
      state.locale = locale
    },
    setBlockchains(state, blockchains) {
      state.blockchains = blockchains
    },
    registerWallets(state, wallets) {
      for(let i = 0; i < wallets.length; i++){
        const wallet = wallets[i]
        if (state.wallets.filter(e => e.context === wallet.context).length === 0) {
          state.walletContexts.push(wallet.context)
          state.wallets.push(wallet)
        }
      }
    },
    registerWallet(state, wallet) {
      state.walletContexts.push(wallet.context)
      state.wallets.push(wallet)
    },
    setKeepKeyState(state, stateKeepKey) {
      state.keepKeyState = stateKeepKey
    },
    setKeepKeyStatus(state, statusKeepKey) {
      state.keepKeyStatus = statusKeepKey
    },
    viewSeed(state, apps) {
      //
    },
    addApps(state, apps) {
      for(let i = 0; i < apps.length; i++){
        const app = apps[i]
        state.apps.push(app)
        if(map[app]) state.apps.push(map[app])
      }
    },
    addCoins(state, coins) {
        for(let i = 0; i < coins.length; i++){
          const coin = coins[i]
          state.coins.push(coin)
          if(map[app]) state.coins.push(map[coin])
        }
    },
    addCoin(state, coin) {
        state.coins.push([coin])
        if(map[coin]) state.coins.push(map[coin])
    },
    addUsbDevices(state, devices) {
      for(let i = 0; i < devices.length; i++){
        const device = devices[i]
        if (state.allUsbDevices.filter(e => e.deviceName === device.deviceName).length === 0) {
          state.allUsbDevices.push(device)
        }
      }
    },
    addUsbDevice(state, device) {
      state.allUsbDevices.push(device)
    },
    addKeepKeys(state, devices) {
      for(let i = 0; i < devices.length; i++){
        const device = devices[i]
        if (state.allKeepKeys.filter(e => e.deviceName === device.deviceName).length === 0) {
          state.allKeepKeys.push(device)
        }
      }
    },
    addKeepKey(state, device) {
      state.allKeepKeys.push(device)
    },
    appPubkeys(state, pubkeys) {
      for(let i = 0; i < pubkeys.length; i++){
        const pubkey = pubkeys[i]
        if (state.pubkeys.filter(e => e.pubkey === pubkey.pubkey).length === 0) {
          state.pubkeys.push(device)
        }
      }
    },
    addPubkey(state, pubkey) {
      state.pubkeys.push(pubkey)
    },
    addMasterAddress(state,asset,address){
        state.masterAddresses[asset] = address
    },
    setBalance(state,payload){
        const { symbol, balance } = payload
        const asset = state.coins.find(a => a.symbol === symbol)
        asset.balance = balance
    },
    setAssets: (state, assets) => state.coins = assets,
    setTotal(state,value){
      state.totalUsd = value
    },
    addDevice(state,value){
      if (state.devices.filter(e => e.deviceId === value.deviceId).length === 0) {
        state.devices.push(value)
      } else {
        console.log("device already loaded!")
      }
    },
    setInvocationContext(state,value){
      state.invocationContext = value
    },
    setContext(state,value){
      // console.log("** Setting context: ",value)
      // console.log("** Setting state.context: ",state.context)
      state.context = value
      // console.log("** Setting state.context: ",state.context)
    },
    setInvocationContextState(state,value){
      state.invocationContextState = value
    },
    setViewSeed(state,value){
      state.mnemonic = value
    },
    setUsername(state,value){
      console.log("set username: ",value)
      state.username = value
    },
    setPioneerUrl(state,value){
      state.pioneerUrl = value
    },
    setPioneerLive(state,value){
      state.pioneerLive = value
    },
    setUsersOnline(state,value){
      state.usersOnline = value
    },
    setTestnet(state,value){
      state.testnet = value
    },
    setSendInfo(state,params){
        state.walletSendInfo = params
    },
    clearSendInfo(state,params){
        state.walletSendInfo = {}
    },
    setSendStatus(state,params){
        state.walletSendInfo.status = params.status
    },
    setSendTxid(state,params){
      state.walletSendInfo.txid = params.txid
    },
    setTxBuilding(state, param) {
        state.txBuilding = param
    },
    setMnemonic(state, mnemonic) {
        state.mnemonic = mnemonic
    },
    setWalletLoaded(state) {
        state.walltedLoaded = true
    },
    setAssetLoading(state, value) {
        state.assetLoading = value
    },
    updateAsset(state, {symbol, price}) {
        const item = state.coins.find(e => e.symbol === symbol)
        item.price = price
        Object.assign(item, asset)
    },
    connectKeepkey(state) {
      state.keepkeyConnected = true
    },
    disconnectKeepkey(state) {
      state.keepkeyConnected = false
    },
    SOCKET_ONOPEN(state) {
        state.isConnected = true
    },
    SOCKET_ONCLOSE(state) {
        state.isConnected = false
    },
    SOCKET_ONMESSAGE(state, message) {
        // const data = JSON.parse(message.data)
        // const keys = Object.keys(data)
        // keys.forEach(key => {
        //     const item = state.coins.find(e => e.displayName.replace(/\s+/g, '-').toLowerCase() === key)
        //     if(item) {
        //         const update = {
        //             ...item,
        //             price: data[key]
        //         }
        //         Object.assign(item, update)
        //     }
        // })
    },
}

export default {
    state,
    getters,
    actions,
    mutations
}
