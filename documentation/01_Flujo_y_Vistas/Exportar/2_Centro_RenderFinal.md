> [!abstract] Lienzo Central: Renderizado Final
> Vista panorámica y de estricta solo lectura que muestra el documento ensamblado en su totalidad, uniendo la configuración preliminar, el cuerpo redactado y las referencias.

### Comportamiento de la Vista

**1. Ensamblaje Completo**
* Concatena automáticamente todas las secciones: Portada, índices dinámicos (calculando los números de página finales), capítulos redactados y la lista de referencias bibliográficas ordenada alfabéticamente.

**2. Simulación de Impresión**
* Desactiva cualquier control de edición.
* Aplica las reglas CSS de impresión definitivas para garantizar que la previsualización en pantalla sea una copia exacta (1:1) del PDF que se va a generar.

---

### Flujo de Datos
* **Entrada:** Recopila el estado global consolidado de toda la aplicación (metadatos, bloques de texto, citas y configuraciones).
* **Salida:** Proporciona el código visual exacto (HTML/CSS) que el motor de exportación capturará para crear el archivo PDF.