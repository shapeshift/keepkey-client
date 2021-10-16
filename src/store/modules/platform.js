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
    username:state => state.username,
    getUsername:state => state.username,
    getTotal:state => state.totalUsd,
    wallets:state => state.wallets,
    getWallets:state => state.wallets,
    layout:state => state.layout,
    devices:state => state.devices,
    getDevices:state => state.devices,
    getCoins:state => state.coins,
    context:state => state.context,
    getContext:state => state.context,
    getKeepKeyState:state => state.keepKeyState,
    getKeepKeyStatus:state => state.keepKeyStatus,
    getAllUsbDevices: state => state.allUsbDevices,
    getAllKeepKeys: state => state.allKeepKeys,
    getWalletInfo: state => state.walletInfo,
}

const actions = {
    updatePrice({ commit }, payload) {
        commit('SetPrice', payload)
    }
}

const mutations = {
    setKeepKeyState(state, stateKeepKey) {
      state.keepKeyState = stateKeepKey
    },
    setKeepKeyStatus(state, statusKeepKey) {
      state.keepKeyStatus = statusKeepKey
    },
    viewSeed(state, apps) {
      //
    },
    setContext(state,value){
      // console.log("** Setting context: ",value)
      // console.log("** Setting state.context: ",state.context)
      state.context = value
      // console.log("** Setting state.context: ",state.context)
    },
    setAssetLoading(state, value) {
        state.assetLoading = value
    },
    connectKeepkey(state) {
      state.keepkeyConnected = true
    },
    disconnectKeepkey(state) {
      state.keepkeyConnected = false
    },
}

export default {
    state,
    getters,
    actions,
    mutations
}
