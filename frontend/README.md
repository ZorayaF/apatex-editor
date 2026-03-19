# **APATEX \- Núcleo del Editor (Frontend)**

Esta subcarpeta contiene la lógica de renderizado, gestión de estado y motores de procesamiento de texto de la aplicación APATEX. El sistema está diseñado bajo un paradigma de edición basada en bloques atómicos para garantizar el cumplimiento estricto de normas editoriales y un alto rendimiento en el manejo de documentos extensos.

## **Especificaciones del Entorno**

| Herramienta | Versión | Función                                             |
| :---------- | :------ | :-------------------------------------------------- |
| React       | 18.x    | Biblioteca de interfaz de usuario.                  |
| Zustand     | 5.x     | Gestión de estado global y persistencia de bloques. |
| Mantine UI  | 8.x     | Sistema de diseño y componentes base.               |
| Vite        | 5.x     | Entorno de construcción y servidor de desarrollo.   |

## **Arquitectura de Software**

La estructura del código sigue un modelo de diseño basado en características (Feature-Based Design), organizado de la siguiente manera:

- `components/blocks`: Contiene la lógica de los bloques editables. Utiliza un sistema de registro (`BlockRegistry`) y una fábrica (`BlockFactory`) para instanciar componentes dinámicamente.
- `components/canvas`: Gestiona el área de visualización. Incluye el componente `Page`, que actúa como contenedor físico (tamaño carta), y `ConnectedBlock`, que optimiza el rendimiento mediante suscripciones atómicas al estado.
- `logic/engine`: Motores de cálculo puro encargados de la inteligencia del editor.
- `logic/rules`: Centralización de las normas de estilo (APA 7\) y configuraciones de interlineado y sangría.
- `hooks`: Utilidades para el manejo del cursor (`useCaret`) y la detección de desbordamiento de página (`usePagePagination`).

## **Motores de Procesamiento (Engines)**

El editor delega las tareas complejas a módulos especializados de JavaScript:

1. **Motor de Inserción (Insertion Engine)**: Define las reglas para dividir bloques (tecla Enter) y unirlos (tecla Backspace), gestionando la herencia de estilos entre párrafos, títulos y viñetas.
2. **Motor de Paginación (Pagination Engine)**: Realiza cálculos de altura en píxeles basados en unidades reales (cm) para detectar el desbordamiento de contenido y redistribuir los bloques entre páginas.
3. **Motor de Limpieza (Parser)**: Procesa el contenido del portapapeles para extraer únicamente texto plano, eliminando formatos externos que puedan comprometer la integridad visual del documento.

## **Configuración Documental**

Las reglas de formato están centralizadas en los siguientes archivos:

- `core/utils/measurements.js`: Define las constantes de DPI, dimensiones de papel carta y márgenes de encuadernación.
- `logic/rules/documentStyles.js`: Controla el interlineado global (1.5), las sangrías de primera línea (1.27 cm) y la jerarquía de títulos del nivel 1 al 5\.

## **Flujo de Desarrollo**

El entorno de pruebas actual se encuentra en `LabPage.jsx`. Este componente actúa como laboratorio para la implementación de nuevas funcionalidades antes de su integración en el flujo principal del editor.

Para iniciar el entorno de desarrollo del frontend:

Bash

```

npm run dev

```

---

El resultado final de este módulo es una interfaz que garantiza una distancia uniforme entre bloques, idéntica al interlineado interno de los párrafos, manteniendo la coherencia visual requerida en documentos académicos.
