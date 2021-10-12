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
