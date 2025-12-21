import { useState } from 'react';
import { useProjects } from '../ProjectContext';
import type { Project } from '../types';
import './ProjectList.css';

interface ProjectListProps {
  onAddTask: (projectId: string) => void;
}

export const ProjectList = ({ onAddTask }: ProjectListProps) => {
  const { projects, deleteProject } = useProjects();
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  const toggleProject = (id: string) => {
    setExpandedProject(expandedProject === id ? null : id);
  };

  const getStatusColor = (status: Project['status']) => {
    const colors = {
      planning: '#3b82f6',
      active: '#10b981',
      completed: '#6b7280',
      'on-hold': '#f59e0b',
    };
    return colors[status];
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: '#10b981',
      medium: '#f59e0b',
      high: '#ef4444',
    };
    return colors[priority as keyof typeof colors];
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="project-list">
      <h2>Proyectos</h2>
      {projects.length === 0 ? (
        <p className="empty-state">
          No hay proyectos. Crea uno nuevo para comenzar.
        </p>
      ) : (
        <div className="projects-container">
          {projects.map(project => (
            <div key={project.id} className="project-card">
              <div
                className="project-header"
                onClick={() => toggleProject(project.id)}
              >
                <div className="project-info">
                  <div
                    className="project-color"
                    style={{ backgroundColor: project.color }}
                  />
                  <div>
                    <h3>{project.name}</h3>
                    <p className="project-description">{project.description}</p>
                  </div>
                </div>
                <div className="project-meta">
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(project.status) }}
                  >
                    {project.status}
                  </span>
                  <span className="task-count">{project.tasks.length} tareas</span>
                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('¿Estás seguro de eliminar este proyecto?')) {
                        deleteProject(project.id);
                      }
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {expandedProject === project.id && (
                <div className="project-details">
                  <div className="project-dates">
                    <span>📅 {formatDate(project.startDate)} → {formatDate(project.endDate)}</span>
                  </div>
                  <div className="tasks-list">
                    <div className="tasks-header">
                      <h4>Tareas</h4>
                      <button
                        className="btn-add-task"
                        onClick={() => onAddTask(project.id)}
                      >
                        ➕ Agregar Tarea
                      </button>
                    </div>
                    {project.tasks.length === 0 ? (
                      <p className="empty-tasks">No hay tareas en este proyecto</p>
                    ) : (
                      project.tasks.map(task => (
                        <div key={task.id} className="task-item">
                          <div className="task-info">
                            <span
                              className="priority-dot"
                              style={{ backgroundColor: getPriorityColor(task.priority) }}
                            />
                            <div>
                              <h5>{task.title}</h5>
                              <p>{task.description}</p>
                              <small>{formatDate(task.startDate)} → {formatDate(task.endDate)}</small>
                            </div>
                          </div>
                          <span
                            className="task-status"
                            style={{
                              backgroundColor:
                                task.status === 'completed'
                                  ? '#10b981'
                                  : task.status === 'in-progress'
                                  ? '#f59e0b'
                                  : '#6b7280',
                            }}
                          >
                            {task.status}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
