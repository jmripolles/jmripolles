import { useState } from 'react';
import { ProjectProvider } from './ProjectContext';
import { ProjectList } from './components/ProjectList';
import { Timeline } from './components/Timeline';
import { ProjectForm } from './components/ProjectForm';
import { TaskForm } from './components/TaskForm';
import type { ViewMode } from './types';
import './App.css';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [taskFormProjectId, setTaskFormProjectId] = useState<string | null>(null);

  return (
    <ProjectProvider>
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <h1>📊 Gestión de Proyectos</h1>
            <p>Organiza y visualiza tus proyectos en un cronograma</p>
          </div>
          <div className="header-actions">
            <div className="view-toggle">
              <button
                className={viewMode === 'list' ? 'active' : ''}
                onClick={() => setViewMode('list')}
              >
                📋 Lista
              </button>
              <button
                className={viewMode === 'timeline' ? 'active' : ''}
                onClick={() => setViewMode('timeline')}
              >
                📅 Cronograma
              </button>
            </div>
            <button
              className="btn-new-project"
              onClick={() => setShowProjectForm(true)}
            >
              ➕ Nuevo Proyecto
            </button>
          </div>
        </header>

        <main className="app-main">
          {viewMode === 'list' ? (
            <ProjectList onAddTask={(projectId) => setTaskFormProjectId(projectId)} />
          ) : (
            <Timeline />
          )}
        </main>

        {showProjectForm && (
          <ProjectForm onClose={() => setShowProjectForm(false)} />
        )}

        {taskFormProjectId && (
          <TaskForm
            projectId={taskFormProjectId}
            onClose={() => setTaskFormProjectId(null)}
          />
        )}
      </div>
    </ProjectProvider>
  );
}

export default App;
