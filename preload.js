// preload.js
const { contextBridge, ipcRenderer } = require("electron");

// We expose a safe, custom API on the window object
contextBridge.exposeInMainWorld("electronAPI", {
  // React will call this function
  exportToPDF: (documentName) => {
    // Send a message to the main process
    ipcRenderer.send("generate-pdf", documentName);
  },

  // Optional: Listen for success/error messages back from Electron
  onPDFStatus: (callback) =>
    ipcRenderer.on("pdf-status", (event, response) => callback(response)),
});
