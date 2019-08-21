// Set the background color of a new browserwindow.
//
// For more info, see:
// https://electronjs.org/docs/api/browser-window

const { app, BrowserWindow } = require('electron');
let win = null

app.on('ready', () => {
  let win = new BrowserWindow({ backgroundColor: '#ff0000' });
  win.loadURL('index.html');
});
