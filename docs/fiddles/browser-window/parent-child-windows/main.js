// Creating child windows by using the parent option
//
// For more info, see:
// https://electronjs.org/docs/api/browser-window#parent-and-child-windows

const { app, BrowserWindow } = require('electron');
let win = null

app.on('ready', () => {
  // Parent and child windows
  let top = new BrowserWindow();
  let child = new BrowserWindow({ parent: top });
  child.show();
  top.show();
  // Modal Windows
  let child = new BrowserWindow({ parent: top, modal: true, show: false });
  // Only the child window will be draggable.
  child.loadURL('index.html');

});
