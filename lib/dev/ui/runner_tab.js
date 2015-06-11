/*

runner_tabs.js
==============

Implementation of the tabbed UI. Each tab contains its own log panel.
When the tab is not selected, it hides the associated log panel.

*/

// var SplitLogPanel = require('./split_log_panel')
// var View = require('./view')
// var Backbone = require('backbone')
// var pad = require('../../strutils').pad
// var log = require('npmlog')
// var Chars = require('../../chars')
// var assert = require('assert')
// var Screen = require('./screen')
// var growl = require('growl')
// var constants = require('./constants')
// var TabWidth = constants.TabWidth
// var TabStartLine = constants.TabStartLine
// var TabHeight = constants.TabHeight
// var TabStartCol = constants.TabStartCol
// var LogPanelUnusedLines = constants.LogPanelUnusedLines
var blessed = require('blessed');
var log = require('npmlog')

function RunnerTab(runner, layout, position) {
  this.runner = runner;
  this.layout = layout;
  this.position = position;
}

RunnerTab.prototype.render = function (count) {
  log.info('RunnerTab:render')
  var width = Math.round(100 / count);
  log.info('RunnerTab:render', width + '%+1', this.position * width + '%-' + (this.position + 1));
  // if (this.box) {
  //   this.box.destroy();
  // }



  this.box = blessed.box({
    parent: this.layout,
    width: width + '%+1',
    height: 4,
    content: 'Browser ' + this.position,
    border: 'line',
    align: 'center',
    top: 2,
    left: this.position * width + '%-' + (this.position + 1)
  });

  log.info('RunnerTab:render', width + '%+1', this.position * width + '%-' + (this.position + 1));
}
//   defaults: {
//     allPassed: true
//   },
//   col: TabStartCol,
//   line: TabStartLine,
//   height: TabHeight,
//   width: TabWidth,
//   initialize: function(){
//
//   },
//   updateSplitPanelVisibility: function(){
//     var appview = this.get('appview')
//     this.splitPanel.set('visible', this.get('selected') && !appview.isPopupVisible())
//   },
//   color: function(){
//     var appview = this.get('appview')
//     var config = appview.app.config
//     var runner = this.get('runner')
//     var results = runner.get('results')
//     var equal = true
//     var hasTests = false
//     if (results) {
//       var passed = results.get('passed')
//       var pending = results.get('pending')
//       var total = results.get('total')
//       var equal = (passed + pending) === total
//       var hasTests = total > 0
//     }
//     var failCuzNoTests = !hasTests && config.get('fail_on_zero_tests')
//     var success = !failCuzNoTests && equal
//     return success ? (pending ? 'yellow' : 'green') : 'red'
//   },
//   startSpinner: function(){
//     this.stopSpinner()
//     var self = this
//     function render(){
//       self.renderResults()
//       self.setTimeoutID = setTimeout(render, 150)
//     }
//     render()
//   },
//   stopSpinner: function(){
//     if (this.setTimeoutID){
//       clearTimeout(this.setTimeoutID)
//     }
//   },
//   isPopupVisible: function isPopupVisible(){
//     var appview = this.get('appview')
//     return appview && appview.isPopupVisible()
//   },
//   render: function(){
//     if (this.isPopupVisible()) return
//     this.renderTab()
//     this.renderRunnerName()
//     this.renderResults()
//   },
//   renderRunnerName: function(){
//     if (this.isPopupVisible()) return
//
//     var screen = this.get('screen')
//     var index = this.get('index')
//     var line = this.line
//     var width = this.width
//     var col = this.col + index * width
//     var runner = this.get('runner')
//     var runnerName = runner.get('name')
//     // write line 1
//     screen
//       .foreground(this.color())
//
//     if (this.get('selected'))
//       screen.display('bright')
//
//     var runnerDisplayName = pad(runnerName || '', width - 2, ' ', 2)
//     screen
//       .position(col + 1, line + 1)
//       .write(runnerDisplayName)
//       .display('reset')
//   },
//   renderResults: function(){
//     if (this.isPopupVisible()) return
//
//     var screen = this.get('screen')
//     var index = this.get('index')
//     var line = this.line
//     var width = this.width
//     var col = this.col + index * width
//     var runner = this.get('runner')
//     var results = runner.get('results')
//     var resultsDisplay = ''
//     var equal = true
//
//     if (results) {
//       var total = results.get('total')
//       var passed = results.get('passed')
//       var pending = results.get('pending')
//       resultsDisplay = passed + '/' + total
//       equal = (passed + pending) === total
//     }
//
//     if (results && results.get('all')){
//       resultsDisplay += ' ' + ((this.get('allPassed') && equal) ? Chars.success : Chars.fail)
//     }else if (!results && runner.get('allPassed') !== undefined){
//       resultsDisplay = runner.get('allPassed') ? Chars.success : Chars.fail
//     }else{
//       resultsDisplay += ' ' + Chars.spinner[this.spinnerIdx++]
//       if (this.spinnerIdx >= Chars.spinner.length) this.spinnerIdx = 0
//     }
//
//     resultsDisplay = pad(resultsDisplay, width - 4, ' ', 2)
//     // write line 1
//     screen
//       .foreground(this.color())
//
//     if (this.get('selected'))
//       screen.display('bright')
//
//     screen
//       .position(col + 1, line + 2)
//       .write(resultsDisplay)
//       .display('reset')
//   },
//   growlResults: function(){
//     var runner = this.get('runner')
//     var results = runner.get('results')
//     var name = runner.get('name')
//     var resultsDisplay = results
//       ? (results.get('passed') + '/' + results.get('total')) : 'finished'
//     var msg = "Test'em : " + name + ' : ' + resultsDisplay
//     growl(msg)
//   },
//   renderTab: function(){
//     if (this.isPopupVisible()) return
//     if (this.get('selected'))
//       this.renderSelected()
//     else
//       this.renderUnselected()
//   },
//   renderUnselected: function(){
//     if (this.isPopupVisible()) return
//
//     var screen = this.get('screen')
//     var index = this.get('index')
//     var width = this.width
//     var height = this.height
//     var line = this.line
//     var col = this.col + index * width
//     var firstCol = index === 0
//     screen.position(col, line)
//
//     screen.write(Array(width + 1).join(' '))
//     for (var i = 1; i < height - 1; i++){
//       if (!firstCol){
//         screen.position(col, line + i)
//         screen.write(' ')
//       }
//       screen.position(col + width - 1, line + i)
//       screen.write(' ')
//     }
//
//     var bottomLine = Array(width + 1).join(Chars.horizontal)
//     screen.position(col, line + height - 1)
//     screen.write(bottomLine)
//   },
//   renderSelected: function(){
//     if (this.isPopupVisible()) return
//     var screen = this.get('screen')
//     var index = this.get('index')
//     var width = this.width
//     var height = this.height
//     var line = this.line
//     var col = this.col + index * width
//     var firstCol = index === 0
//     screen.position(col, line)
//
//     screen.write((firstCol ? Chars.horizontal : Chars.topLeft) +
//       Array(width - 1).join(Chars.horizontal) +
//         Chars.topRight)
//     for (var i = 1; i < height - 1; i++){
//       if (!firstCol){
//         screen.position(col, line + i)
//         screen.write(Chars.vertical)
//       }
//       screen.position(col + width - 1, line + i)
//       screen.write(Chars.vertical)
//     }
//
//     var bottomLine = (firstCol ? ' ' : Chars.bottomRight) +
//       Array(width - 1).join(' ') + Chars.bottomLeft
//     screen.position(col, line + height - 1)
//     screen.write(bottomLine)
//   },
//   destroy: function(){
//     this.stopSpinner()
//     this.splitPanel.destroy()
//     View.prototype.destroy.call(this)
//   }
// })

module.exports = RunnerTab;
