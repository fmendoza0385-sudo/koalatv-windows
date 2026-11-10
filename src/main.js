const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const https = require('https');
const http = require('http');
const zlib = require('zlib');

let win;
function createWindow() {
  win = new BrowserWindow({
    width: 1366, height: 768, minWidth: 900, minHeight: 560,
    backgroundColor: '#050a13',
    title: 'KoalaTV',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });
  win.loadFile(path.join(__dirname, 'index.html'));
}
app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });

const dataFile = () => path.join(app.getPath('userData'), 'sources.json');
ipcMain.handle('sources:get', () => {
  try { return JSON.parse(fs.readFileSync(dataFile(), 'utf8')); } catch { return []; }
});
ipcMain.handle('sources:add', (_e, source) => {
  const list = (() => { try { return JSON.parse(fs.readFileSync(dataFile(), 'utf8')); } catch { return []; } })();
  if (!list.some(x => x.location === source.location)) list.push(source);
  fs.writeFileSync(dataFile(), JSON.stringify(list, null, 2));
  return list;
});
ipcMain.handle('sources:remove', (_e, location) => {
  let list = (() => { try { return JSON.parse(fs.readFileSync(dataFile(), 'utf8')); } catch { return []; } })();
  list = list.filter(x => x.location !== location);
  fs.writeFileSync(dataFile(), JSON.stringify(list, null, 2));
  return list;
});
ipcMain.handle('file:pick', async () => {
  const result = await dialog.showOpenDialog({ properties: ['openFile'], filters: [{ name: 'Listas IPTV', extensions: ['m3u','m3u8','txt'] }] });
  if (result.canceled || !result.filePaths[0]) return null;
  return { path: result.filePaths[0], content: fs.readFileSync(result.filePaths[0], 'utf8') };
});
ipcMain.handle('playlist:base', () => fs.readFileSync(path.join(__dirname, '..', 'assets', 'canales.m3u8'), 'utf8'));

ipcMain.handle('playlist:fetch', async (_e, address) => {
  if (!/^https?:\/\//i.test(address || '')) throw new Error('URL no válida');
  return new Promise((resolve, reject) => {
    const lib = address.startsWith('https:') ? https : http;
    const req = lib.get(address, { headers: { 'User-Agent': 'KoalaTV/1.0' } }, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
    req.setTimeout(20000, () => req.destroy(new Error('Tiempo de espera agotado')));
    req.on('error', reject);
  });
});

ipcMain.handle('epg:fetch', async (_e, address) => {
  if (!/^https?:\/\//i.test(address || '')) throw new Error('URL EPG no válida');
  return new Promise((resolve, reject) => {
    const lib = address.startsWith('https:') ? https : http;
    const req = lib.get(address, { headers: { 'User-Agent': 'KoalaTV/1.0' } }, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        let data = Buffer.concat(chunks);
        try { if (address.endsWith('.gz') || res.headers['content-encoding'] === 'gzip') data = zlib.gunzipSync(data); } catch {}
        resolve(data.toString('utf8'));
      });
    });
    req.setTimeout(20000, () => req.destroy(new Error('Tiempo de espera agotado al descargar EPG')));
    req.on('error', reject);
  });
});
