# Grist LLM Widget
Proyecto desarrollado por Ramón Rodríguez Pedraza como Trabajo de Fin de Grado (TFG) para el grado de Ingeniería Multimedia de la Universidad de Alicante.

Este proyecto aborda el diseño, desarrollo e integración de un widget personalizado para [Grist](https://www.getgrist.com/) que permite la interacción con los datos a través de lenguaje natural utilizando modelos de inteligencia artificial (LLM). Además, el widget permite al usuario decidir en todo momento qué datos se envían al modelo y ofrece compatibilidad con distintos modelos de lenguaje, tanto externos como alojados localmente.


## Estructura del proyecto
El repositorio está dividido en dos partes principales:

* `/frontend`: Aplicación desarrollada con React, Vite y TypeScript. Contiene la interfaz del widget y la lógica de interacción con Grist.

* `/backend`: API Rest construida con Node.js y Express. Actúa como intermediario que gestiona las peticiones a los modelos y protege las API Keys y el system prompt.


## Tecnologías
### Frontend:
* React
* Vite
* TypeScript
* Tailwind CSS
* Grist Plugin API
* Vitest + React Testing Library (testing)

### Backend:
* Node.js + Express
* Zod
* Jest (testing)

### Servicios LLM:
* OpenRouter
* Ollama

## Configuración e instalación
### 1. Requisitos previos
* Node.js (v24.x o superior)
* Cloudflare Turnstile
* OpenRouter Key
* Ollama (opcional, para modelos locales)

### 2. Clonar el repositorio
````bash
git clone https://github.com/ramonrp99/grist-llm-widget
cd grist-llm-widget
````

### 3. Configuración del backend
````bash
cd backend
npm install
````

#### 1. Variables de entorno:
Renombra `.env.example` a `.env` (o `.env.development`) y configura tus claves y variables.

#### 2. Archivos de configuración:
* En `/config`, renombra `models.json.example` a `models.json` para listar los modelos disponibles para su utilización en el widget.

* Renombra `systemPrompt.md.example` a `systemPrompt.md` para definir las directrices de la IA.

#### 3. Iniciar:
````bash
npm run dev
````

### 4. Configuración del frontend
````bash
cd frontend
npm install
````

#### 1. Variables de entorno:
Renombra `.env.example` a `.env` (o `.env.development`) y configura la URL del backend y el site key de Cloudflare Turnstile.

#### 2. Archivos de configuración:
* En `/config`, renombra `suggestions.json.example` a `suggestions.json` para personalizar los botones de opciones predefinidas que se muestran en el widget.

#### 3. Iniciar:
````bash
npm run dev
````

## Integración con Grist
Para utilizar el widget en un documento de Grist:

1. **Añadir Widget:** `Agregar Nuevo` > `Agregar Widget a la página` > `Personalizado`.

2. **Vinculación:** Selecciona la tabla de origen y en la sección `SELECT BY` elige la tabla.

3. **URL:** Introduce la URL del frontend (desarrollo: `http://localhost:5173`).

4. **Permisos:** Ajusta el nivel de acceso en la configuración lateral:
    * **Leer tabla seleccionada:** Acceso mínimo requerido. Permite al widget acceder a los datos de la tabla.
    * **Acceso completo al documento:** Permite al widget realizar acciones de escritura sobre las celdas.

5. **Acceso a columnas:** Ajusta las columnas de la tabla a las que el widget tiene acceso en la configuración lateral.

## Licencia
Este proyecto se encuentra bajo la licencia [MIT](LICENSE).
