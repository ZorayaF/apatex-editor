// main.js
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const fs = require("fs");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Determinar si estamos en modo desarrollo (Vite) o producción (Build)
  const isDev = !app.isPackaged;

  if (isDev) {
    // Desarrollo: Carga el servidor local de Vite
    mainWindow.loadURL("http://localhost:5173");
    // Opcional: Abrir las herramientas de desarrollador automáticamente
    // mainWindow.webContents.openDevTools();
  } else {
    // Producción: Carga el archivo HTML compilado
    mainWindow.loadFile(path.join(__dirname, "dist/index.html"));
  }
}

app.whenReady().then(createWindow);

// Cerrar la aplicación cuando todas las ventanas se cierran (estándar en Windows/Linux)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Re-crear ventana en macOS si se hace clic en el icono del dock
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

/* =========================================================
   1. MOTOR DE EXPORTACIÓN A PDF (printToPDF nativo)
   ========================================================= */
ipcMain.on("generate-pdf", async (event, documentName) => {
  const win = BrowserWindow.fromWebContents(event.sender);

  const { canceled, filePath } = await dialog.showSaveDialog(win, {
    title: "Exportar Documento APA 7",
    defaultPath: `${documentName || "Documento_APA"}.pdf`,
    filters: [{ name: "Documentos PDF", extensions: ["pdf"] }],
  });

  if (canceled || !filePath) {
    event.sender.send("pdf-status", {
      success: false,
      error: "Cancelado por el usuario",
    });
    return;
  }

  try {
    const pdfData = await win.webContents.printToPDF({
      printBackground: true,
      margins: { marginType: "default" }, // Respeta los márgenes @page de tu CSS
      pageSize: "Letter",
      preferCSSPageSize: true,
    });

    fs.writeFileSync(filePath, pdfData);
    event.sender.send("pdf-status", { success: true, path: filePath });
  } catch (error) {
    console.error("Error al generar PDF: ", error);
    event.sender.send("pdf-status", { success: false, error: error.message });
  }
});

/* =========================================================
   2. GUARDAR PROYECTO (.apatex) -> "Guardar" y "Guardar como"
   ========================================================= */
ipcMain.handle(
  "save-project",
  async (event, { projectData, filePath, isSaveAs }) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    let targetPath = filePath;

    // Abrir ventana de diálogo SI es un archivo nuevo o SI se pidió "Guardar como"
    if (!targetPath || isSaveAs) {
      const { canceled, filePath: dialogPath } = await dialog.showSaveDialog(
        win,
        {
          title: "Guardar Proyecto APATEX",
          defaultPath: targetPath || "Mi_Documento.apatex",
          filters: [{ name: "Documento APATEX", extensions: ["apatex"] }],
        },
      );

      if (canceled || !dialogPath) {
        return { success: false, canceled: true };
      }
      targetPath = dialogPath;
    }

    try {
      // Escribir el JSON en el disco duro
      fs.writeFileSync(
        targetPath,
        JSON.stringify(projectData, null, 2),
        "utf-8",
      );
      return { success: true, filePath: targetPath };
    } catch (error) {
      console.error("Error al guardar el archivo: ", error);
      return { success: false, error: error.message };
    }
  },
);

/* =========================================================
   3. ABRIR PROYECTO (.apatex) -> Cargar JSON al Editor
   ========================================================= */
ipcMain.handle("open-project", async (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);

  // Abrir la ventana nativa de "Abrir Archivo"
  const { canceled, filePaths } = await dialog.showOpenDialog(win, {
    title: "Abrir Proyecto APATEX",
    filters: [{ name: "Documento APATEX", extensions: ["apatex"] }],
    properties: ["openFile"], // Solo permite seleccionar un archivo a la vez
  });

  if (canceled || filePaths.length === 0) {
    return { success: false, canceled: true };
  }

  try {
    const filePath = filePaths[0];
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const projectData = JSON.parse(fileContent);

    return { success: true, projectData: projectData, filePath: filePath };
  } catch (error) {
    console.error("Error leyendo el archivo: ", error);
    return {
      success: false,
      error: "El archivo está corrupto o no es válido.",
    };
  }
});
