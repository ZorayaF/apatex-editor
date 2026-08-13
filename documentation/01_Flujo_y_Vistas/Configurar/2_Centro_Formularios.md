> [!example] Panel Central: Formularios Dinámicos
> Contenedor principal de la vista "Configurar". Funciona como un componente dinámico que muta su estructura interna basándose en la selección del panel lateral. 

### Variantes de Renderizado

**1. Formulario Estándar de Inserción**
Se activa para secciones como Portada, Resumen, Introducción, Dedicatoria, etc.
* **Qué contiene:** Campos de texto (inputs) y áreas de texto (textareas) específicos para los metadatos requeridos.
* **Acción:** Captura los datos ingresados por el usuario y emite una señal de actualización inmediata hacia el panel de **[[3_Derecha_Preview|Previsualización]]**.

**2. Panel de Controles (Modo Navegación)**
Se activa exclusivamente para la Tabla de Contenido.
* **Qué contiene:** Botones de navegación interactivos en lugar de campos de texto.
* **Acción:** Al hacer clic, envía una instrucción al panel de **[[3_Derecha_Preview|Previsualización]]** para que realice un salto (scroll automático) hacia la sección correspondiente del índice.

**3. Vista Nula / Vacía**
Se activa para las Referencias y la Nota de Reglamento.
* **Qué contiene:** Se renderiza intencionalmente vacío o con un estado de inactividad, bloqueando la edición manual.
* **Acción:** Ninguna. Protege estas secciones para que su contenido sea auto-generado por el sistema o se mantenga estandarizado según la norma institucional.

---

### Flujo de Datos Visual
* **Entrada:** Recucha el evento de clic desde el **[[1_Sidebar_Preliminares|Menú Lateral]]**.
* **Salida:** Envía los datos capturados y las instrucciones de visualización hacia el panel derecho de **[[3_Derecha_Preview|Previsualización en tiempo real]]**.