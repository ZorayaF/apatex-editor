// main.js
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const fs = require("fs");
const path = require("path");

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      // Vital: Point this to your preload script
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true, // Security best practice
      nodeIntegration: false,
    },
  });

  // Load your Vite dev server or production build
  // mainWindow.loadURL('http://localhost:5173');
}

app.whenReady().then(createWindow);

// ==========================================
// THE NATIVE PDF EXPORT ENGINE
// ==========================================
ipcMain.on("generate-pdf", async (event, documentName) => {
  const win = BrowserWindow.fromWebContents(event.sender);

  // 1. Let the user choose where to save the file
  const { canceled, filePath } = await dialog.showSaveDialog(win, {
    title: "Guardar Documento APA 7",
    defaultPath: `${documentName || "Documento_APA"}.pdf`,
    filters: [{ name: "PDF Documents", extensions: ["pdf"] }],
  });

  if (canceled || !filePath) return;

  try {
    // 2. Generate the PDF natively via Chromium
    const pdfData = await win.webContents.printToPDF({
      printBackground: true,
      margins: { marginType: "default" }, // Uses your CSS @page margins
      pageSize: "Letter",
      preferCSSPageSize: true, // Respects your @page CSS commands
    });

    // 3. Write the file to the hard drive
    fs.writeFileSync(filePath, pdfData);

    // Tell React it worked
    event.sender.send("pdf-status", { success: true, path: filePath });
  } catch (error) {
    console.error("Error generating PDF: ", error);
    event.sender.send("pdf-status", { success: false, error: error.message });
  }
});
