import { ipcRenderer } from 'electron'

function playSound(type) {
  if(type === 'send') {
    const audio = new Audio(require('../../assets/sounds/send.mp3'))
    audio.play()
  }
  if(type === 'receive') {
    const audio = new Audio(require('../../assets/sounds/chaching.mp3'))
    audio.play()
  }
  if(type === 'success') {
    const audio = new Audio(require('../../assets/sounds/success.wav'))
    audio.play()
  }
  if(type === 'fail') {
    const audio = new Audio(require('../../assets/sounds/fail.mp3'))
    audio.play()
  }
}


export default store => {
  ipcRenderer.on('payments', (event, data) => {
    console.log(event, data)
    store.commit('newTx', data)
    playSound('receive')
    // const myNotification = new Notification(`You just received ${data.asset}!`, {
    //   body: `You just got ${data.amount} ${data.asset}!`,
    //   silent: true
    // })
  })
  ipcRenderer.on('hardware', (event, data) => {
    //event
    //console.log('hardware event: ', data)

    switch(data.event.event) {
      case "connect":
        playSound('success')
        store.commit('connectKeepkey',true)
        // code block
        break;
      case "disconnect":
        playSound('fail')
        store.commit('disconnectKeepkey',false)
        // code block
        break;
      default:
        //TODO Spammy
        //console.log("unhandled event! ",data.event)
    }

    //

    //if connect show icon

    //if disconect hide icon

  })
  ipcRenderer.on('latencyReport', (event, data) => {
    console.log('latencyReport event! ')
    console.log('data: ', data)

  })
  ipcRenderer.on('dashboard', (event, data) => {
    console.log('dashboard event! ')
    console.log('data: ', data)

    for(let i = 0; i < data.layout.length; i++){
      let app = data.layout[i]
      store.commit('registerApp',app)
    }
  })
  ipcRenderer.on('loadConfig', (event, data) => {
    console.log(' loadConfig event! ',data)
    console.log('data: ', data)
    if(data){
      store.commit('setLocale',data.locale)
      store.commit('setUsername',data.username)
      store.commit('setQueryKey',data.queryKey)
      store.commit('setBlockchains',data.blockchains)
      //store.commit('isTestnet',data.isTestnet)
    }
  })
  ipcRenderer.on('setContext', (event, data) => {
    console.log(' setContext event! ',data)
    console.log('data: ', data)
    if(data.context){
      store.commit('setContext',data.context)
    }
  })
  ipcRenderer.on('setContextInvoke', (event, data) => {
    console.log(' setContext event! ',data)
    console.log('data: ', data)
    if(data){
      store.commit('setInvocationContext',data)
    }
  })
  ipcRenderer.on('setInvocationContext', (event, data) => {
    console.log(' setContext event! ',data)
    console.log('data: ', data)
    if(data.invocationId){
      store.commit('setInvocationContext',data.invocationId)
    }
  })
  ipcRenderer.on('pushPioneerStatus', (event, data) => {
    console.log(' pushPioneerStatus! ',data)
    console.log('data: ', data)
    //
    if(data.online){
      store.commit('setPioneerLive',true)
    }
    if(data.pioneerUrl){
      store.commit('setPioneerUrl',data.pioneerUrl)
    }
    //usersOnline
    if(data.global && data.global.online){
      store.commit('setUsersOnline',data.global.online)
    }
  })
  ipcRenderer.on('loadDevices', (event, data) => {
    console.log(' loadDevices event! ')
    console.log('data: ', data)
    for(let i = 0; i < data.devices.length; i++){
      let device = data.devices[i]
      store.commit('addDevice',device)
    }
  })
  ipcRenderer.on('setWalletInfoContext', (event, data) => {
    console.log(' setWalletInfoContext event! ')
    console.log('data: ', data)
    // store.commit('setWalletInfo',data)
  })
  ipcRenderer.on('init', (event, data) => {
    console.log('init event! ')
    console.log('data: ', data)
    console.log('totalValueUsd: ', data.TOTAL_VALUE_USD_LOADED)

    //total USD value
    store.commit('setTotal',data.TOTAL_VALUE_USD_LOADED)

    for(let i = 0; i < data.wallets.length; i++){
      let wallet = data.wallets[i]
      console.log("wallet: ",wallet)

      store.commit('registerWallet',wallet)
    }

    //for each coin

    //set state

    //load wallet info

  })
  ipcRenderer.on('updateWallets', (event, data) => {
    console.log('updateWallets: ', data)
    store.commit('registerWallets',data)
  })
  //appPubkeys
  ipcRenderer.on('updateTotalValue', (event, data) => {
    console.log('updateTotalValue: ', data)
    store.commit('setTotal',data)
  })
  ipcRenderer.on('addPubkeys', (event, data) => {
    console.log('appPubkeys event: ', data)
    if(data.pubkeys){
      store.commit('appPubkeys',data.pubkeys)
    }
  })
  ipcRenderer.on('transactionBuilt', (event, data) => {
    console.log('transactionBuilt event! ')
    //invocation context state to sign
    store.commit('setInvocationContextState','built')
  })
  ipcRenderer.on('transactionSigned', (event, data) => {
    console.log('transactionBuilt event! ',data)
    //invocation context state to broadcast
    store.commit('setInvocationContextState','signed')
  })
  ipcRenderer.on('invocations', (event, data) => {
    console.log('invocations event! ')
    console.log('data: ', data)

    for(let i = 0; i < data.length; i++){
      const invocation = data[i]
      store.commit('addInvocation',invocation)
    }
  })
  ipcRenderer.on('addInvocation', (event, data) => {
    console.log('invocations event! ')
    console.log('data: ', data)
    if(data.invocationId){
      store.commit('addInvocation',data)
    }
  })
  ipcRenderer.on('loadApps', (event, data) => {
    console.log('loadApps event! ')
    console.log('data: ', data)
    console.log('APPS: ', data.APPS)

    for(let i = 0; i < data.APPS.length; i++){
      const app = data.APPS[i]
      store.commit('addApp',app)
    }

    //for each coin

    //set state

    //load wallet info

  })
  ipcRenderer.on('updateConfig', (event, data) => {
    //blockchains
    if(data.blockchains){
      store.commit('setBlockchains',data.blockchains)
    }
    //username
    if(data.username){
      store.commit('setUsername',data.username)
    }
    //queryKey
    if(data.queryKey){
      store.commit('setQueryKey',data.queryKey)
    }
    //locale
    if(data.locale){
      store.commit('setLocale',data.locale)
    }
    //wss

    //spec
    if(data.pioneerUrl){
      store.commit('setPioneerUrl',data.pioneerUrl)
    }
    //password
  })
  ipcRenderer.on('checkPioneerUrl', (event, data) => {
    console.log('checkPioneerUrl: ', data)
    console.log('checkPioneerUrl: online: ', data.online)
    store.commit('setPioneerLive',data.online)
  })
  ipcRenderer.on('setPioneerUrl', (event, data) => {
    //event
    console.log('setPioneerUrl', data.urlSpec)
    store.commit('setPioneerUrl',data.urlSpec)
  })
  ipcRenderer.on('setUsername', (event, data) => {
    //event
    console.log('**** setUsername', data)
    store.commit('setUsername',data.username)
    store.commit('setQueryKey',data.queryKey)
    //store.commit('setUsername',data.username)
  })
  ipcRenderer.on('hardwareInit', (event, data) => {
    console.log('**** hardwareInit', data)
    //TODO if not already in state
    //
    // //enable keepkey icon
    // store.commit('connectKeepkey',true)
    //
    // //push device info to devices
    // store.commit('registerDevice',data.info)
  })
  ipcRenderer.on('pairKeepkey', (event, data) => {
    console.log('**** pairKeepkey', data)
    if(data.success){
      //paired
      //....
    }
  })
  ipcRenderer.on('allUsbDevices', (event, data) => {
    console.log('allUsbDevices event: ', data.allUsbDevices)
    if(data && data.allUsbDevices){
      store.commit('addUsbDevices',data.allUsbDevices)
    }
  })
  ipcRenderer.on('allKeepKeys', (event, data) => {
    console.log('allKeepKeys event: ', data.allKeepKeys)
    if(data && data.allKeepKeys){
      store.commit('addKeepKeys',data.allKeepKeys)
    }
  })
  ipcRenderer.on('hardwareState', (event, data) => {
    console.log('hardwareState state: ', data.state)
    if(data && data.state){
      console.log('hardwareState state: data.state.state **** ', data.state.state)
      store.commit('setKeepKeyState',{state:data.state.state})
    }
  })
  ipcRenderer.on('hardwareStatus', (event, data) => {
    console.log('hardwareStatus msg: ', data.state.msg)
    if(data && data.state && data.state.msg){
      console.log('hardwareState state: data.state.state **** ', data.state.msg)
      store.commit('setKeepKeyStatus',{status:data.state.msg})
    }
  })
  ipcRenderer.on('events', (event, data) => {
    //event
    console.log('event', data)
  })
  // ipcRenderer.on('startup', (event, data) => {
  //   //store.commit('hideModal','Connect')
  //
  //   //if setup
  //   //else
  // })
  ipcRenderer.on('viewSeed', (event, data) => {
    console.log('viewSeed!', data)
    store.commit('setViewSeed',data.seed)
  })
  // ipcRenderer.on('registerWallet', (event, data) => {
  //   console.log('wallet registered!', data)
  //   store.commit('registerWallet',data)
  // })
  ipcRenderer.on('navigation', (event, data) => {
    if(data.dialog){
      if(data.action === 'close'){
        store.commit('hideModal',data.dialog)
      }else if(data.action === 'open'){
        store.commit('showModal',data.dialog)
      }
    }
  })
  store.subscribe(( mutation) => {
    if (mutation.type === 'Something') {
      console.log('something called')
    }
  })
  store.subscribeAction({
    after: (action) => {
      if(action.type === 'load') {
        console.log('birds')
      }
    }
  })
}
