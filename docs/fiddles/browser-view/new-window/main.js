// Instantiate a new window and focus on it
//
// For more info, see:
// https://electronjs.org/docs/api/browserview

const { app, BrowserView, BrowserWindow } = require('electron')

app.on('ready', () => {
  let win = new BrowserWindow({ width: 800, height: 600 })
  win.on('closed', () => {
    win = null
  })

  let view = new BrowserView();
  win.setBrowserView(view);
  view.setBounds({ x: 0, y: 0, width: 300, height: 300 });
  view.webContents.loadURL('https://electronjs.org');
})
