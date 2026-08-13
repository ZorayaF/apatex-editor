> [!abstract] Panel Derecho: Propiedades y Referencias
> Panel contextual que se adapta dinámicamente según el elemento estructural seleccionado por el usuario. Administra los metadatos complejos y el repositorio bibliográfico.

### Edición Contextual de Bloques
Al seleccionar un elemento específico en el **[[3_Centro_Paginas|Lienzo Central]]**, el panel muestra los siguientes controles:

**1. Propiedades de Tabla**
* **Controles:** Formulario para definir el título de la tabla, la nota explicativa inferior, y la cantidad de filas y columnas.
* **Comportamiento:** Modifica la estructura general. La edición del texto interno de las celdas se delega directamente al lienzo central para mayor comodidad del usuario.

**2. Propiedades de Imagen**
* **Controles:** Ajustes de redimensionamiento visual.
* **Restricción matemática:** El motor bloquea cualquier tamaño que intente desbordar las márgenes físicas de la página renderizada, protegiendo la inmutabilidad del formato.

---

### Gestor Bibliográfico
Administrador central de las fuentes documentales del proyecto.

**1. Creación de Fuentes**
* Despliega formularios dinámicos con campos específicos dependiendo del tipo de documento seleccionado (Libro, Artículo, Página Web).

**2. Inserción de Citas**
* Muestra el repositorio con la lista completa de referencias creadas.
* **Flujo de inserción:** El usuario ubica el cursor en el texto, selecciona una fuente de este panel, elige el formato deseado (Cita Parentética o Narrativa) y el sistema inyecta la cita formateada en el lugar exacto.