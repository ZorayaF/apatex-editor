# **APATEX \- Sistema de Redacción Académica Estructurada**

APATEX es un editor de texto especializado en la automatización de formatos de redacción académica. Utiliza un modelo basado en bloques semánticos (WYSIWYM), lo que permite al usuario centrarse en la estructura del contenido mientras el sistema gestiona de forma automática las reglas de estilo, márgenes y paginación.

## **Estructura del Proyecto**

El proyecto está dividido en dos capas principales para separar el entorno de ejecución de escritorio de la lógica del editor:

* **Raíz (/):** Contiene la configuración de Electron, la gestión del ciclo de vida de la aplicación de escritorio y los scripts de empaquetamiento.  
* **Frontend (/frontend):** Contiene el núcleo del editor desarrollado en React, incluyendo los motores de paginación, inserción de bloques y gestión de estado global.

## **Especificaciones Técnicas**

| Componente | Tecnología | Versión |
| :---- | :---- | :---- |
| Entorno de ejecución | Node.js | ^20.x (LTS) |
| Contenedor de escritorio | Electron | 31.x |
| Biblioteca de interfaz | React | 18.x |
| Gestión de estado | Zustand | 5.x |
| Herramienta de construcción | Vite | 5.x |
| Sistema de diseño | Mantine UI | 7.x / 8.x |

## **Requisitos Previos**

* Node.js en su versión Long Term Support (LTS).  
* Gestor de paquetes npm o yarn.  
* Entorno de ejecución compatible con Electron (Windows, macOS o Linux).

## **Instalación y Configuración**

Para poner en marcha el entorno de desarrollo, es necesario instalar las dependencias en ambos niveles del proyecto:

**Instalación de dependencias del contenedor:**  
   Bash

```
npm install
```  

**Instalación de dependencias del editor (frontend):**  
   Bash

```
cd frontend
npm install
```

## **Comandos de Ejecución**

Debido a la naturaleza desacoplada del proyecto, se pueden ejecutar los entornos de forma independiente o conjunta:

* **Solo Frontend (Navegador):** Útil para el desarrollo de componentes y lógica de bloques.  
  Bash

```
cd frontend
npm run dev
```

* **Aplicación Completa (Electron \+ React):** Ejecuta el contenedor de escritorio vinculando el servidor de desarrollo del frontend.  
  Bash

```
npm run start
``` 

## **Metodología de Trabajo**

El sistema implementa una arquitectura de motores internos encargados de tareas específicas:

1. **Motor de Inserción:** Gestiona la partición y unión de bloques de texto.  
2. **Motor de Paginación:** Calcula el desbordamiento de contenido en tiempo real según medidas físicas reales (cm).  
3. **Gestión Atómica:** Cada bloque de texto funciona como una unidad independiente que se comunica directamente con el estado global para optimizar el rendimiento.

---

Para detalles específicos sobre la lógica del editor, consulte el archivo README dentro de la carpeta /frontend.
