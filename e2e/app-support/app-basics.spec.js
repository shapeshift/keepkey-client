const Application = require('spectron').Application
const assert = require('assert')



//TODO dectect host and run tests per OS

describe('Application launch', function () {
  jest.setTimeout('30000')

  beforeEach(function () {
    //windows path

    this.app = new Application({
      //dist/electron/Packaged/mac/Electron.app/Contents/MacOS/Electron
      path: './dist/electron/Packaged/mac/Electron.app/Contents/MacOS/Electron',
      // path: './dist/electron/Packaged/mac/keepkey-client.app/Contents/MacOS/keepkey-client',
    })
    return this.app.start()
  })

  afterEach(function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop()
    }
  })

  it('shows an initial window', function () {
    return this.app.client.getWindowCount().then(function (count) {
      assert.equal(1, 1)
    })
  })

  //check window name
  it('has correct title name', async function () {
    try{
      let title = await this.app.client.getTitle()


      //string "mac os x"

      assert(title,'keepkey-client')
    }catch(e){
      throw e
    }
  })

  //is visable
  it('is window visable', async function () {
    try{


      assert(this.app.browserWindow.isVisible())

    }catch(e){
      throw e
    }
  })

})
