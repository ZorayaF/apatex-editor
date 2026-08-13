> [!info] Barra de Acciones de Exportación
> Panel superior dedicado exclusivamente a la generación del documento final. 

### Controles Principales

**1. Botón de Exportación a PDF**
* Inicia el proceso de compilación del documento.
* Al hacer clic, se comunica con el motor interno de la aplicación y abre el cuadro de diálogo nativo del sistema operativo (mediante Electron) para que el usuario elija la ruta de guardado.

**2. Información de Estado**
* Muestra indicadores de que el documento está listo para compilarse (verificación de que no hay cálculos de paginación pendientes).

---

### Flujo de Datos
* **Salida:** Envía la orden final al motor de renderizado de PDF para empaquetar el lienzo central en un archivo físico binario.