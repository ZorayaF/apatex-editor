# APATEX - Editor de Texto Académico (v0.1.0)

**APATEX** es un sistema de redacción estructurada diseñado específicamente para automatizar el cumplimiento de las normas de presentación de trabajos de grado de la **Universidad de Boyacá (Politeca)**.

El sistema utiliza una arquitectura **WYSIWYM** (Lo que ves es lo que quieres decir), donde el usuario se enfoca en el contenido semántico (Títulos, Párrafos, Tablas) y el software se encarga de aplicar las reglas de formato estrictas (márgenes, tipografía, interlineado) de manera automática.

## 🛠️ Stack Tecnológico
| Tecnología | Versión | Propósito |
| :--- | :--- | :--- |
| **Node.js** | `v20.20.0` | Entorno de ejecución principal (LTS). |
| **Electron** | `v31.7.7` | Motor de escritorio para integración con el sistema de archivos. |
| **React** | `v18.x` | Librería de interfaz para la construcción de componentes. |
| **Vite** | `v5.x` | Empaquetador de módulos y servidor de desarrollo rápido. |
| **Mantine** | `v8.x` | Sistema de diseño y componentes UI. |
| **Zustand** | `v4/5` | Gestión de estado global (Store) para los bloques de texto. |
| **WSL2** | `Ubuntu` | Entorno de desarrollo sobre Windows. |


## Arquitectura del Proyecto

El código sigue una estructura modular para facilitar el mantenimiento:

```
```
```
```
```
frontend/src/features/editor/: Contiene la lógica principal del editor.

  Canvas.jsx: El área de escritura central.

  Sidebar.jsx: Navegación por capítulos.

  Inspector.jsx: Panel de asistente y metadatos.

  Editor.jsx: Organiza los anteriores componentes en una sola pantalla.

frontend/src/features/home/: Página principial para iniciar o continuar un proyecto.

src/store/: Contiene useDocStore.js, gestiona el estado de los bloques (JSON).

src/components/: Componentes visuales genéricos (Botones, Layouts).


```
```
```
```
```
```
```
```
