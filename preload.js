const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  exportToPDF: (documentName) => {
    ipcRenderer.send("generate-pdf", documentName);
  },
  onPDFStatus: (callback) =>
    ipcRenderer.on("pdf-status", (event, response) => callback(response)),

  saveProject: (payload) => {
    return ipcRenderer.invoke("save-project", payload);
  },

  // NUEVA FUNCIÓN DE LECTURA
  openProject: () => {
    return ipcRenderer.invoke("open-project");
  },
});
