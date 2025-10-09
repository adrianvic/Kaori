const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const sqlite = require('sqlite-electron');

function createWindow() {
    const win = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
          preload: path.join(__dirname, 'preload.js'),
          contextIsolation: true,
          nodeIntegration: false
        }
    });

    const indexPath = path.join(__dirname, '..', 'www', 'index.html');
    win.loadFile(indexPath);
}

app.whenReady().then(createWindow);

ipcMain.handle('databasePath', (event, dbPath) => {
    sqlite.dbPath = dbPath
    return true
})
ipcMain.handle('executeQuery', async (event_name, query_name, fetch_name, val) => {
    return await sqlite.executeQuery(query_name, fetch_name, val);
})
