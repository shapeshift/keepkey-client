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

  ipcRenderer.on('playSound', (event, data) => {
    console.log('sound: ', data)
    playSound(data.sound)
  })

  ipcRenderer.on('attach', (event, data) => {
    console.log('attach', data)
    playSound('success')
    //store.commit('deviceConnect',data.state)
  })

  ipcRenderer.on('detach', (event, data) => {
    console.log('detach', data)
    playSound('fail')
    //store.commit('deviceConnect',data.state)
  })

  ipcRenderer.on('setKeepKeyState', (event, data) => {
    console.log('setKeepKeyState', data)
    store.commit('setKeepKeyState',data.state)
  })

  ipcRenderer.on('setKeepKeyStatus', (event, data) => {
    console.log('setKeepKeyStatus', data)
    store.commit('setKeepKeyStatus',data.status)
  })

  ipcRenderer.on('setDevice', (event, data) => {
    console.log('setDevice', data)
    store.commit('setKeepKeyStatus',data.status)
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
