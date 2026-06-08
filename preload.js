const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  // Tu función PDF existente
  exportToPDF: (documentName) => {
    ipcRenderer.send("generate-pdf", documentName);
  },
  onPDFStatus: (callback) =>
    ipcRenderer.on("pdf-status", (event, response) => callback(response)),

  // NUESTRA NUEVA FUNCIÓN DE GUARDADO
  saveProject: (projectData) => {
    return ipcRenderer.invoke("save-project", projectData);
  },
});
