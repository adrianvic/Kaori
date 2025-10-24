const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('./db');

db.run("CREATE TABLE IF NOT EXISTS preferences (key TEXT PRIMARY KEY, value TEXT)");
db.run(`CREATE TABLE IF NOT EXISTS foods (
  name TEXT PRIMARY KEY,
  calories INT,
  serving INT,
  description TEXT
  )`);

app.whenReady().then(async () => {
  let page = 'index.html';

  const res = await getAsync("SELECT value FROM preferences WHERE key = 'setupComplete'");

  console.log(res.value);

  if(!res.value || res.value == 'false') page = "setup.html";

  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  const indexPath = path.join(__dirname, '..', 'www', page);
  win.loadFile(indexPath);
  win.webContents.openDevTools();

});

function getAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => err ? reject(err) : resolve(row));
  });
}

function allAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
  });
}

function runAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

ipcMain.handle('db:getPreference', async (event, key) => {
  row = await getAsync('SELECT value FROM preferences WHERE key = ?', [key])
  return row ? row.value : null;
});

ipcMain.handle('db:setPreference', async (event, key, value) => {
  return runAsync('INSERT OR REPLACE INTO preferences (key, value) VALUES (?, ?)', [key, value]);
});