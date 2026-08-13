> [!abstract] Panel Derecho: Previsualización en Tiempo Real
> Lienzo visual de solo lectura que representa fielmente cómo se verá el documento impreso o exportado. Aplica estrictamente las reglas de la norma APA y el formato institucional.

### Comportamiento del Visor

**1. Renderizado Reactivo**
* Escucha los datos ingresados en el **[[2_Centro_Formularios|Panel Central]]**.
* Calcula y aplica automáticamente márgenes, alineaciones absolutas (como el centrado exacto de la portada), interlineado, tipografía, paginación y encabezado.

**2. Inmutabilidad (Protección de Formato)**
* Es un componente estrictamente de solo lectura. 
* El usuario no puede hacer clic, seleccionar ni alterar el texto directamente sobre este lienzo. Esto garantiza que no se rompa la estructura ni se desconfiguren las métricas calculadas.

**3. Respuesta a Navegación**
* Al recibir instrucciones de componentes como la Tabla de Contenido, el visor ejecuta un desplazamiento automático (scroll) para mostrar en pantalla la hoja solicitada.

---

### Flujo de Datos Visual
* **Entrada:** Recibe el estado actualizado de los metadatos y señales de navegación desde el panel central.
* **Salida:** Prepara visualmente el terreno para lo que el usuario verá en la sección final de **[[1_Top_Acciones|Exportar]]**.