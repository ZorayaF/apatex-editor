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
  mainWindow.loadURL("http://localhost:5173");
}

app.whenReady().then(createWindow);

// ==========================================
// THE NATIVE PDF EXPORT ENGINE
// ==========================================
ipcMain.handle("save-project", async (event, projectData) => {
  const win = BrowserWindow.fromWebContents(event.sender);

  // 1. Abrir la ventana nativa de "Guardar como"
  const { canceled, filePath } = await dialog.showSaveDialog(win, {
    title: "Guardar Proyecto APATEX",
    defaultPath: "Mi_Tesis.apatex",
    filters: [
      { name: "Documento APATEX", extensions: ["apatex"] }, // ¡Aquí creamos tu extensión!
    ],
  });

  if (canceled || !filePath) return { success: false };

  try {
    // 2. Convertir los datos a texto y guardarlos en el disco duro
    fs.writeFileSync(filePath, JSON.stringify(projectData, null, 2), "utf-8");

    return { success: true, filePath: filePath };
  } catch (error) {
    console.error("Error saving file: ", error);
    return { success: false, error: error.message };
  }
});
