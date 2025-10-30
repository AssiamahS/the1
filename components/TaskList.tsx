import React from 'react';
import { Task } from '../types';
import { TaskCard } from './TaskCard';
import { TaskListRow } from './TaskListRow';

interface TaskListProps {
  tasks: Task[];
  onSelectTask: (task: Task | null) => void;
  onOpenTaskChat: (task: Task) => void;
  onPinTask: (taskId: string) => void;
  onArchiveTask: (taskId: string) => void;
  activeTaskId: string | null;
  viewMode?: 'grid' | 'list';
}

export const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  onSelectTask, 
  onOpenTaskChat,
  onPinTask,
  onArchiveTask,
  activeTaskId,
  viewMode = 'grid'
}) => {
  if (viewMode === 'list') {
    return (
      <div className="space-y-2">
        {tasks.map(task => (
          <TaskListRow
            key={task.id}
            task={task}
            onSelect={() => onSelectTask(task)}
            onOpenChat={onOpenTaskChat}
            onPin={onPinTask}
            onArchive={onArchiveTask}
            isActive={task.id === activeTaskId}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {tasks.map(task => (
        <TaskCard 
          key={task.id} 
          task={task}
          onSelect={() => onSelectTask(task)}
          onOpenChat={onOpenTaskChat}
          onPin={onPinTask}
          onArchive={onArchiveTask}
          isActive={task.id === activeTaskId}
        />
      ))}
    </div>
  );
};