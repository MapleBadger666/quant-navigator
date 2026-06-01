const { app, BrowserWindow, shell } = require('electron');
const path = require('node:path');

const isHttpUrl = (url) => url.startsWith('http://') || url.startsWith('https://');
const devServerUrl = process.env.ELECTRON_START_URL;

const isAllowedAppUrl = (targetUrl) => {
  if (targetUrl.startsWith('file://')) {
    return true;
  }

  if (!devServerUrl) {
    return false;
  }

  try {
    return new URL(targetUrl).origin === new URL(devServerUrl).origin;
  } catch {
    return false;
  }
};

const openExternalUrl = (targetUrl) => {
  if (isHttpUrl(targetUrl)) {
    shell.openExternal(targetUrl);
  }
};

const createMainWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1100,
    minHeight: 720,
    title: 'Quant Navigator',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    openExternalUrl(url);
    return { action: 'deny' };
  });

  mainWindow.webContents.on('will-navigate', (event, targetUrl) => {
    if (isAllowedAppUrl(targetUrl)) {
      return;
    }

    event.preventDefault();
    openExternalUrl(targetUrl);
  });

  if (devServerUrl) {
    mainWindow.loadURL(devServerUrl);
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }
};

app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
