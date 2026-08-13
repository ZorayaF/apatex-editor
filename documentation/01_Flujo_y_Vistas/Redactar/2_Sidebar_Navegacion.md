> [!info] Menú Lateral: Navegación del Documento
> Panel izquierdo de la vista "Redactar". Actúa como un mapa interactivo del documento, extrayendo la estructura en tiempo real.

### Funciones Principales

**1. Árbol de Contenido Jerárquico**
* Rastrea dinámicamente el texto del panel central y genera un índice visual basado en los niveles de encabezado (H1, H2 y H3).
* Permite al usuario tener una visión global de la estructura de su redacción.

**2. Aislamiento de Capítulos (Modo Enfoque)**
* Herramienta para aislar capítulos específicos (Nivel H1).
* Al activarse, oculta visualmente el resto del texto en el **[[3_Centro_Paginas|Lienzo Central]]**, permitiendo al usuario concentrarse exclusivamente en la redacción de esa sección particular sin distracciones.

---

### Flujo de Datos e Interacción

* **Entrada (Sincronización):** Escucha constantemente las actualizaciones de texto provenientes del **[[3_Centro_Paginas|Lienzo Central]]** para actualizar los nombres de los títulos en el menú.
* **Salida (Navegación):** Al hacer clic en un título de la lista, envía una instrucción de desplazamiento al lienzo central para ubicar el cursor exactamente en esa sección.