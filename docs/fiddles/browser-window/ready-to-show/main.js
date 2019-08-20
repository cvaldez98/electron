// Instantiate a new window and focus on it
//
// For more info, see:
// https://electronjs.org/docs/api/browser-window

const { app, BrowserView, BrowserWindow } = require('electron')

app.on('ready', () => {
  
  let win = new BrowserWindow({ show: false });
  win.loadURL('https://electronjs.org');
  win.once('ready-to-show', () => {
    win.show();
  });
})
