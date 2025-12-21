import { useState } from 'react';
import type { FormEvent } from 'react';
import { useProjects } from '../ProjectContext';
import type { Task } from '../types';
import './ProjectForm.css';

interface TaskFormProps {
  projectId: string;
  onClose: () => void;
}

export const TaskForm = ({ projectId, onClose }: TaskFormProps) => {
  const { addTask, projects } = useProjects();
  const project = projects.find(p => p.id === projectId);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: project ? new Date(project.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    endDate: project ? new Date(project.endDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    status: 'pending' as Task['status'],
    priority: 'medium' as Task['priority'],
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    addTask(projectId, {
      ...formData,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
    });
    onClose();
  };

  if (!project) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Agregar Tarea a {project.name}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Título de la Tarea</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Ej: Diseñar interfaz de usuario"
            />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              placeholder="Describe la tarea..."
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Fecha de Inicio</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
                min={new Date(project.startDate).toISOString().split('T')[0]}
                max={new Date(project.endDate).toISOString().split('T')[0]}
              />
            </div>

            <div className="form-group">
              <label>Fecha de Fin</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
                min={formData.startDate}
                max={new Date(project.endDate).toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Estado</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Task['status'] })}
              >
                <option value="pending">Pendiente</option>
                <option value="in-progress">En progreso</option>
                <option value="completed">Completada</option>
              </select>
            </div>

            <div className="form-group">
              <label>Prioridad</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              Crear Tarea
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
