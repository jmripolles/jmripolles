# 📊 Aplicación de Gestión de Proyectos con Cronograma

Una aplicación web moderna para gestionar proyectos y visualizarlos en un cronograma interactivo. Desarrollada con React, TypeScript y Vite.

## 🚀 Características

- ✅ **Gestión de Proyectos**: Crea, edita y elimina proyectos
- 📋 **Gestión de Tareas**: Añade tareas a cada proyecto con prioridades y estados
- 📅 **Vista de Cronograma**: Visualiza todos los proyectos y tareas en una línea de tiempo
- 🎨 **Personalización**: Asigna colores a cada proyecto
- 💾 **Persistencia Local**: Los datos se guardan automáticamente en localStorage
- 📱 **Diseño Responsivo**: Funciona en escritorio y móviles

## 🛠️ Tecnologías

- **React 18** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático
- **Vite** - Herramienta de construcción rápida
- **CSS3** - Estilos modernos con gradientes y animaciones

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd project-manager
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

4. Abre tu navegador en `http://localhost:5173`

## 🏗️ Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la versión de producción
- `npm run lint` - Ejecuta el linter

## 📖 Uso

### Crear un Proyecto

1. Haz clic en el botón "➕ Nuevo Proyecto"
2. Completa los campos del formulario:
   - Nombre del proyecto
   - Descripción
   - Fechas de inicio y fin
   - Estado (Planificación, Activo, En pausa, Completado)
   - Color personalizado
3. Haz clic en "Crear Proyecto"

### Agregar Tareas

1. Expande un proyecto haciendo clic en su tarjeta
2. Haz clic en "➕ Agregar Tarea"
3. Completa los detalles de la tarea:
   - Título y descripción
   - Fechas (dentro del rango del proyecto)
   - Estado (Pendiente, En progreso, Completada)
   - Prioridad (Baja, Media, Alta)
4. Haz clic en "Crear Tarea"

### Vistas

- **Vista de Lista** (📋): Muestra todos los proyectos en tarjetas expandibles
- **Vista de Cronograma** (📅): Visualiza proyectos y tareas en una línea de tiempo

## 🎨 Estructura del Proyecto

```
src/
├── components/
│   ├── ProjectList.tsx       # Lista de proyectos
│   ├── ProjectList.css
│   ├── Timeline.tsx           # Vista de cronograma
│   ├── Timeline.css
│   ├── ProjectForm.tsx        # Formulario de proyecto
│   ├── TaskForm.tsx           # Formulario de tarea
│   └── ProjectForm.css        # Estilos de formularios
├── ProjectContext.tsx         # Contexto de gestión de estado
├── types.ts                   # Definiciones de tipos
├── App.tsx                    # Componente principal
├── App.css
├── index.css
└── main.tsx
```

## 💡 Características Técnicas

- **Gestión de Estado**: Context API de React para estado global
- **Persistencia**: localStorage para guardar datos automáticamente
- **TypeScript**: Tipado completo para mayor seguridad
- **Componentes Modulares**: Arquitectura basada en componentes reutilizables
- **Responsive Design**: Adaptable a diferentes tamaños de pantalla

## 📝 Modelo de Datos

### Proyecto
```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  color: string;
  tasks: Task[];
}
```

### Tarea
```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}
```

## 🌟 Próximas Funcionalidades

- [ ] Edición de proyectos y tareas existentes
- [ ] Exportación de datos (JSON, CSV)
- [ ] Filtros y búsqueda
- [ ] Notificaciones de plazos
- [ ] Colaboración en tiempo real
- [ ] Tema oscuro

## 📄 Licencia

MIT License - Ver archivo LICENSE para más detalles

## 👨‍💻 Desarrollo

Construido con ❤️ usando React + TypeScript + Vite
