# Changelog

Todos los cambios notables y capacidades técnicas implementadas en el proyecto **APATEX** se documentan en este archivo.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/) y el proyecto se rige bajo la licencia **GNU General Public License v3.0 (GPLv3)**.

---

## [0.1.0] - 2026-09-17

### Añadido

#### Núcleo del Editor y Paradigma WYSIWYM

- **Arquitectura de edición basada en bloques atómicos:** Desacoplamiento estricto entre el contenido textual (serializado en árbol JSON) y la presentación visual, garantizando la inmutabilidad de la plantilla normativa institucional.
- **Sistema dinámico de bloques (`BlockRegistry` y `BlockFactory`):** Componentes independientes conectados al estado (`ConnectedBlock`) y encapsulados mediante `BlockWrapper` para párrafos, listas, títulos (niveles H1 a H5), tablas y figuras.
- **Gestión de estado global y optimización:** Integración de Zustand (v5.x) para actualizaciones atómicas del árbol de datos sin provocar re-renderizados globales en documentos extensos.

#### Motores de Procesamiento y Automatización Normativa

- **Motor de Inserción (`insertionEngine.js`):** Gestión lógica de división de bloques al presionar la tecla _Enter_ y consolidación al pulsar _Backspace_, conservando la jerarquía y herencia de estilos.
- **Motor de Paginación y Desborde (`paginationEngine.js`):** Detección reactiva de desbordamiento basada en dimensiones físicas reales (cm convertidos por `measurements.js` a DPI de pantalla) y redistribución continua de bloques entre páginas carta.
- **Motor de Reglas Institucionales (`documentStyles.js` y `blockRules.js`):**
  - Aplicación inalterable de tipografía Times New Roman a 12 pt, alineación justificada e interlineado de 1.5 líneas.
  - Márgenes normalizados asimétricos para la Universidad de Boyacá (3.0 cm superior e izquierdo; 2.54 cm derecho e inferior).
  - Sangría de primera línea obligatoria de 1.27 cm en párrafos y entradas de glosario.
- **Motor de Numeración Jerárquica (`numberingEngine.js`):** Asignación y recálculo automático de títulos multinivel (1, 1.1, 1.1.1, etc.) a lo largo del documento.
- **Motor de Tablas de Contenido (`tocEngine.js`):** Generación y sincronización en tiempo real del índice general y listas auxiliares vinculados a los números de página exactos.
- **Motor de Limpieza y Sanitización (`parser`):** Extracción de texto plano desde el portapapeles al pegar texto externo, previniendo alteraciones estéticas en el lienzo.

#### Gestión de Citas y Referencias Bibliográficas

- **Motor de Citación (`citationEngine.js`):** Soporte para inyección de citas parentéticas y narrativas, gestión de múltiples autores y aplicación automática de la regla _et al._ y fechas.
- **Analizador y Renderizador Bibliográfico (`referenceParser.js` y `bibliographyRenderer.js`):** Estructuración de fuentes (libros, artículos, páginas web) y generación automática de la bibliografía final ordenada alfabéticamente y con sangría francesa estandarizada.

#### Interfaz Gráfica y Flujo de Trabajo (Mantine UI v8.x / React v18.x)

- **Módulo de Configuración de Preliminares:** Panel de 3 columnas para captura estructurada de metadatos (título, running head, autores, asesores, facultad), control por interruptores booleanos de secciones opcionales (Dedicatoria, Agradecimientos, Glosario, Anexos) y previsualización a escala 1:1.
- **Secuencia de Foliado Normativo:** Numeración continua que contabiliza portada y contraportada (páginas 1 y 2 ocultas) e inicia su visibilidad a partir de la página 3 (Nota de Aceptación).
- **Módulo de Redacción:** Lienzo paginado con barra superior de herramientas semánticas, árbol interactivo de navegación por títulos a la izquierda y panel lateral contextual para edición paramétrica de tablas y figuras (restringidas para impedir desbordes de margen).
- **Módulo de Previsualización y Auditoría:** Vista previa concatenada linealmente con filtros por secciones (Todas, Solo Preliminares, Solo Redacción) antes de la exportación.

#### Persistencia, Plataforma de Escritorio y Compilación

- **Contenedor Nativo en Electron (v31.x):** Arquitectura desacoplada de dos procesos (Main Process en Node.js y Renderer Process en Chromium).
- **Persistencia Local Segura vía IPC:** Guardado y apertura directa en disco mediante cuadros de diálogo nativos del sistema operativo bajo el formato de archivo propio `.apatex`.
- **Exportación a PDF Vectorial (`DocumentExporter.jsx`):** Ensamblaje e impresión directa mediante Chromium hacia archivos PDF locales a escala 1:1.
- **Pipeline de Construcción Windows:** Script de empaquetado para generar ejecutables e instaladores de escritorio (`.exe`) en el directorio `release/` mediante el comando `npm run dist`.
- **Licenciamiento Abierto:** Adopción de la licencia GNU GPLv3 para la distribución del código fuente y sus trabajos derivados.

### Corregido

- **Ajustes de Validación Normativa Institucional (Politeca):**
  - Sincronización métrica en los números de página listados en la Tabla de Contenido.
  - Inyección automática de etiquetas obligatorias "Título:" y "Title:" junto con la justificación del bloque de palabras clave en el Resumen y Abstract.
  - Restricción de la cursiva tipográfica exclusivamente al prefijo `"Nota."` en notas al pie de tablas y figuras.
  - Eliminación de saltos de línea verticales sobrantes entre entradas bibliográficas.
  - Corrección de la posición inicial superior de la sección de Anexos (2.54 cm del margen superior).
