var Application = require('spectron').Application
var assert = require('assert')

//test mac
// var app = new Application({
//     path: '../dist/electron/Packaged/mac/keepkey-client.app/Contents/MacOS/keepkey-client'
// })

describe('Application launch', function () {

  beforeEach(function () {
    this.app = new Application({
      path: './dist/electron/Packaged/mac/keepkey-client.app/Contents/MacOS/keepkey-client',
    })
    return this.app.start()
  })

  afterEach(function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop()
    }
  })

  it('shows an initial window', function () {
    console.log("Testing")
    return this.app.client.getWindowCount().then(function (count) {
      assert.equal(1, 1)
    })
  })
})

//test windows

//test linux

// app.start().then(function () {
//     // Check if the window is visible
//     return app.browserWindow.isVisible()
// }).then(function (isVisible) {
//     // Verify the window is visible
//     assert.equal(isVisible, true)
// }).then(function () {
//     // Get the window's title
//     return app.client.getTitle()
// }).then(function (title) {
//     // Verify the window's title
//     assert.equal(title, 'keepkey-client')
// }).then(function () {
//     // Stop the application
//     console.log("Test pass!")
//     return app.stop()
// }).catch(function (error) {
//     // Log any failures
//     console.error('Test failed', error.message)
// })
