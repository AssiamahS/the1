import React from 'react';
import { Task } from '../types';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void; // Or a more specific update function
  onSelectTask: (task: Task | null) => void;
  onOpenTaskChat: (task: Task) => void;
  activeTaskId: string | null;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onSelectTask, onOpenTaskChat, activeTaskId }) => {
  if (tasks.length === 0) {
    return <div className="text-center text-text-secondary py-10">No tasks found.</div>
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {tasks.map(task => (
        <TaskCard 
          key={task.id} 
          task={task}
          onSelect={() => onSelectTask(task)}
          onOpenChat={onOpenTaskChat}
          isActive={task.id === activeTaskId}
        />
      ))}
    </div>
  );
};
