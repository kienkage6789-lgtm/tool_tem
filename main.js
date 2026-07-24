const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    icon: path.join(__dirname, 'web_offline', 'icon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      plugins: true // Bật plugins để đọc PDF
    }
  });

  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadFile(path.join(__dirname, 'web_offline', 'app.html'));
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// Xử lý sự kiện in ấn
ipcMain.on('preview-print', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  const pdfPath = path.join(os.tmpdir(), `DEZEN_Label_${Date.now()}.pdf`);
  
  win.webContents.printToPDF({
    printBackground: true,
    pageSize: 'A4'
  }).then(data => {
    fs.writeFile(pdfPath, data, (error) => {
      if (error) {
        console.error('Lỗi lưu PDF:', error);
        return;
      }
      
      // Bật cửa sổ xem trước PDF
      const previewWindow = new BrowserWindow({
        width: 1000,
        height: 800,
        parent: win,
        modal: true,
        title: 'Print Preview - DEZEN Label Tool',
        icon: path.join(__dirname, 'web_offline', 'icon.png'),
        webPreferences: {
          plugins: true
        }
      });
      
      previewWindow.setMenuBarVisibility(false);
      // Mở file PDF, Electron sẽ dùng trình đọc PDF nội bộ (Chromium PDF Viewer)
      previewWindow.loadFile(pdfPath);
    });
  }).catch(error => {
    console.error('Lỗi khi xuất PDF:', error);
  });
});
