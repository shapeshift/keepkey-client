const Application = require('spectron').Application
const assert = require('assert')



//TODO dectect host and run tests per OS

describe('Application launch', function () {
  jest.setTimeout('30000')

  beforeEach(function () {
    this.app = new Application({
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
    //TODO Curl bridge and verify if online

    assert(true)
    return
  })


  //TODO
  //use test seed, verify hdwallet operating correctly
  //verify can load seed
  //verify get address

})
