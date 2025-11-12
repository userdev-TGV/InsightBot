# Insight Bot

Bot de análisis de documentos con estructura similar a NotebookLM.

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ 
- npm o yarn

### Instalación

1. Instala las dependencias:
```bash
npm install
```

2. Inicia el servidor de desarrollo:
```bash
npm run dev
```

3. Abre tu navegador en `http://localhost:3000`

### Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta el linter

## 📁 Estructura del Proyecto

```
InsightBot/
├── src/
│   ├── components/
│   │   └── Insight.tsx      # Componente principal
│   ├── types/
│   │   └── insight.types.ts  # Tipos TypeScript
│   ├── App.tsx              # Componente raíz
│   ├── main.tsx             # Punto de entrada
│   └── index.css            # Estilos globales
├── index.html               # HTML principal
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🎨 Características de la Estructura

- **3 Secciones principales:**
  1. Fuentes (Conocimiento) - Para subir y gestionar documentos
  2. Chat - Para interactuar con el bot
  3. Documentos - Para generar y ver outputs

- **Funcionalidades de UI:**
  - Secciones colapsables/expandibles
  - Diseño responsive
  - Estados vacíos con placeholders
  - Interfaz moderna con Tailwind CSS

## 🛠️ Tecnologías

- **React 18** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework CSS utility-first
- **Lucide React** - Iconos

## 📋 Próximas Fases

La funcionalidad completa se implementará en las siguientes fases:
- Manejo de archivos
- Integración con API de chat
- Generación de documentos
- Persistencia de datos
