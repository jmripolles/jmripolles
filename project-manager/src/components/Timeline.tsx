import { useMemo } from 'react';
import { useProjects } from '../ProjectContext';
import './Timeline.css';

export const Timeline = () => {
  const { projects } = useProjects();

  const { minDate, maxDate, months } = useMemo(() => {
    if (projects.length === 0) {
      const now = new Date();
      return {
        minDate: now,
        maxDate: new Date(now.getFullYear(), now.getMonth() + 6, 1),
        months: [],
      };
    }

    const allDates = projects.flatMap(p => [
      new Date(p.startDate),
      new Date(p.endDate),
      ...p.tasks.flatMap(t => [new Date(t.startDate), new Date(t.endDate)]),
    ]);

    const min = new Date(Math.min(...allDates.map(d => d.getTime())));
    const max = new Date(Math.max(...allDates.map(d => d.getTime())));

    min.setDate(1);
    max.setMonth(max.getMonth() + 1);
    max.setDate(1);

    const monthsList = [];
    const current = new Date(min);
    while (current <= max) {
      monthsList.push(new Date(current));
      current.setMonth(current.getMonth() + 1);
    }

    return { minDate: min, maxDate: max, months: monthsList };
  }, [projects]);

  const getPositionAndWidth = (start: Date, end: Date) => {
    const totalDuration = maxDate.getTime() - minDate.getTime();
    const startOffset = new Date(start).getTime() - minDate.getTime();
    const duration = new Date(end).getTime() - new Date(start).getTime();

    const left = (startOffset / totalDuration) * 100;
    const width = (duration / totalDuration) * 100;

    return { left: `${left}%`, width: `${width}%` };
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
  };

  if (projects.length === 0) {
    return (
      <div className="timeline">
        <h2>Cronograma</h2>
        <p className="empty-state">
          No hay proyectos para mostrar en el cronograma.
        </p>
      </div>
    );
  }

  return (
    <div className="timeline">
      <h2>Cronograma</h2>

      <div className="timeline-header">
        {months.map((month, i) => (
          <div
            key={i}
            className="timeline-month"
            style={{ width: `${100 / months.length}%` }}
          >
            {formatMonth(month)}
          </div>
        ))}
      </div>

      <div className="timeline-content">
        {projects.map(project => (
          <div key={project.id} className="timeline-project">
            <div className="timeline-project-label">
              <div
                className="project-color-indicator"
                style={{ backgroundColor: project.color }}
              />
              <span>{project.name}</span>
            </div>

            <div className="timeline-bars">
              <div
                className="timeline-bar project-bar"
                style={{
                  ...getPositionAndWidth(project.startDate, project.endDate),
                  backgroundColor: project.color,
                }}
                title={`${project.name}: ${new Date(project.startDate).toLocaleDateString()} - ${new Date(project.endDate).toLocaleDateString()}`}
              >
                <span className="bar-label">{project.name}</span>
              </div>

              {project.tasks.map(task => (
                <div
                  key={task.id}
                  className="timeline-bar task-bar"
                  style={{
                    ...getPositionAndWidth(task.startDate, task.endDate),
                    backgroundColor: project.color,
                    opacity: 0.6,
                  }}
                  title={`${task.title}: ${new Date(task.startDate).toLocaleDateString()} - ${new Date(task.endDate).toLocaleDateString()}`}
                >
                  <span className="bar-label">{task.title}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="timeline-legend">
        <div className="legend-item">
          <div className="legend-box project-box" />
          <span>Proyecto</span>
        </div>
        <div className="legend-item">
          <div className="legend-box task-box" />
          <span>Tarea</span>
        </div>
      </div>
    </div>
  );
};
