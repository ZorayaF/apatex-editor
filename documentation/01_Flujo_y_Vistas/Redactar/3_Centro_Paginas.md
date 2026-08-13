> [!example] Lienzo Central: Páginas de Redacción
> Área de trabajo principal de la aplicación. Simula un entorno de papel físico con un motor de renderizado reactivo que protege el formato institucional mientras el usuario redacta.

### Comportamiento del Lienzo

**1. Paginación Automática (Desbordamiento)**
* El sistema calcula en tiempo real el alto del contenido ingresado.
* Cuando el texto o los bloques exceden los márgenes físicos permitidos de la hoja actual, el motor detecta el desbordamiento y genera automáticamente una nueva página, trasladando el texto sin romper el formato.

**2. Renderizado de Elementos Fijos (Solo Lectura)**
* Hereda la lógica de inmutabilidad de los paneles de previsualización.
* Inserta y actualiza de manera automática elementos estructurales repetitivos en cada hoja generada, tales como la **numeración de página** y el **encabezado (running head)**, impidiendo que el usuario los desalinee.

**3. Recepción de Bloques Estructurados**
* Funciona como el receptor principal de los elementos inyectados desde el panel auxiliar (Títulos, Listas, Imágenes, Tablas, Citas).
* Una vez insertados, los elementos complejos delegan su edición específica al **[[4_Derecha_Herramientas|Panel Derecho]]**.

---

### Flujo de Datos e Interacción
* **Entrada:** Recibe el texto directo del usuario, la inyección de componentes desde el panel de bloques y las órdenes de navegación del **[[2_Sidebar_Navegacion|Menú Lateral]]**.
* **Salida:** Emite constantemente la jerarquía de títulos actualizada hacia el menú lateral para mantener sincronizado el mapa del documento.