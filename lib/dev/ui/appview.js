/*

appview.js
==========

The actual AppView. This encapsulates the entire UI.

*/

var blessed = require('blessed');
var events = require('events');

var RunnerTab = require('./runner_tab');
//
// var tabs = 10;
//
// for(var i = 0; i < tabs; i++) {
//
//   var box = blessed.box({
//     parent: layout,
//     width: tabs + '%+1',
//     height: 4 + (i === 0 ? 1 : 0),
//     content: 'Browser ' + i,
//     border: 'line',
//     align: 'center',
//     top: 2,
//     left: i * tabs + '%-' + (i + 1)
//   })
//
// }
//
//
//

var AppView = function(attrs) {
  var app = attrs.app
  this.name = 'Testem'
  this.app = app
  this.config = app.config
  this.runners = []
  var self = this;

  this.app.on('runner-connected', function (runner) {
    this.runners.push(runner);
    self.renderRunnerTabs();
  });

  this.app.on('runner-disconnected', function (runner) {
    var index = self.runners.indexOf(runner);
    if (index > -1) {
      self.runners.splice(index, 1);
    }
    self.renderRunnerTabs();
  })

  // Create a screen object.
  this.screen = blessed.screen({
    autoPadding: true,
    smartCSR: true,
    dockBorders: true
  });

  this.screen.title = this.name;

  this.screen.key(['escape', 'q', 'C-c'], function() {
    self.emit('close');
  });

  this.layout = blessed.box({
    parent: this.screen,
    top: 'center',
    left: 'center',
    width: '100%',
    height: '100%',
    style: {
      bg: 'red',
      border: {
        fg: 'blue'
      }
    }
  });

  this.screen.append(this.layout);

  this.renderTop();
  this.renderMiddle();
  this.renderBottom();

  // this.screen.render();
}

AppView.prototype = new events.EventEmitter();

//
// updateErrorMessagesPanelSize: function(){
//   this.errorMessagesPanel.set({
//     line: 2,
//     col: 4,
//     width: this.get('cols') - 8,
//     height: this.get('lines') - 4
//   })
// },

AppView.prototype.renderTop = function() {
  var url = this.config.get('url');
  var text = 'TEST\'EM \'SCRIPTS!\n' +
    'Open the URL below in a browser to connect.\n' +
    '{underline}' + url + '{/underline}';

  blessed.text({
    parent: this.layout,
    width: '100%',
    height: 5,
    content: text,
    tags: true
  });
}

AppView.prototype.renderRunnerTabs = function() {

  this.runners.forEach(function (runner, i) {
    new RunnerTab(runner, this.layout, i, this.runners.length)
  })
  this.layout.render();
}

AppView.prototype.renderMiddle = function() {
  blessed.log({
    parent: this.layout,
    width: '100%',
    content: 'Waiting for runners...',
    top: 6,
  })
}

AppView.prototype.renderBottom = function() {
  var layout = this.layout
  var pauseStatus = this.app.paused ? '; p to unpause (PAUSED)' : '; p to pause'

  var msg = (
    this.runners.length === 1 ?
    'q to quit' :
    'Press ENTER to run tests; q to quit'
    )
  msg = '[' + msg + pauseStatus + ']'

  blessed.text({
    parent: layout,
    bottom: 0,
    left: 0,
    content: msg
  });
}

AppView.prototype.cleanup = function(cb) {
  // this.screen.clear();
  cb();
}

// runners: function(){
//   return this.app.runners
// },
// currentRunnerTab: function(){
//   var idx = this.get('currentTab')
//   return this.runnerTabs.at(idx)
// },
// onInputChar: function(buf){
//   try{
//     var chr = String(buf).charAt(0)
//     var i = chr.charCodeAt(0)
//     var key = (buf[0] === 27 && buf[1] === 91) ? buf[2] : null
//     var currentRunnerTab = this.currentRunnerTab()
//     var splitPanel = currentRunnerTab && currentRunnerTab.splitPanel
//
//     //log.info([buf[0], buf[1], buf[2]].join(','))
//     if (key === 67){ // right arrow
//       this.nextTab()
//     }else if (key === 68){ // left arrow
//       this.prevTab()
//     }else if (key === 66){ // down arrow
//       splitPanel.scrollDown()
//     }else if (key === 65){ // up arrow
//       splitPanel.scrollUp()
//     }else if (chr === '\t'){
//       splitPanel.toggleFocus()
//     }else if (chr === ' ' && splitPanel){
//       splitPanel.pageDown()
//     }else if (chr === 'b'){
//       splitPanel.pageUp()
//     }else if (chr === 'u'){
//       splitPanel.halfPageUp()
//     }else if (chr === 'd'){
//       splitPanel.halfPageDown()
//     }
//     this.trigger('inputChar', chr, i)
//   }catch(e){
//     log.error('In onInputChar: ' + e + '\n' + e.stack)
//   }
// },

//   nextTab: function(){
//     var currentTab = this.get('currentTab')
//     currentTab++
//     if (currentTab >= this.runners().length)
//       currentTab = 0
//
//     var runner = this.runners().at(currentTab)
//     this.set('currentTab', currentTab)
//   },
//   prevTab: function(){
//     var currentTab = this.get('currentTab')
//     currentTab--
//     if (currentTab < 0)
//       currentTab = this.runners().length - 1
//
//     var runner = this.runners().at(currentTab)
//     this.set('currentTab', currentTab)
//   },
//   setErrorPopupMessage: function(msg){
//     this.errorMessagesPanel.set('text', msg)
//   },
//   clearErrorPopupMessage: function(){
//     this.errorMessagesPanel.set('text', '')
//     this.render()
//   },
//   isPopupVisible: function(){
//     return !! this.get('isPopupVisible')
//   },
//   setRawMode: function() {
//     if (process.stdin.isTTY) {
//       process.stdin.setRawMode(false)
//     }
//   },
//   cleanup: function(cb){
//     var screen = this.get('screen')
//     screen.display('reset')
//     screen.erase('screen')
//     screen.position(0, 0)
//     screen.enableScroll()
//     screen.cursor(true)
//     this.setRawMode(false)
//     screen.destroy()
//     if (cb) cb()
//   }
// })

module.exports = AppView;
