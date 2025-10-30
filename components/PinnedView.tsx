import React from 'react';
import { Task } from '../types';
import { TaskList } from './TaskList';

interface PinnedViewProps {
  tasks: Task[];
  onSelectTask: (task: Task | null) => void;
  onOpenTaskChat: (task: Task) => void;
  onPinTask: (taskId: string) => void;
  onArchiveTask: (taskId: string) => void;
  activeTaskId: string | null;
}

export const PinnedView: React.FC<PinnedViewProps> = ({ 
  tasks, 
  onSelectTask, 
  onOpenTaskChat,
  onPinTask,
  onArchiveTask,
  activeTaskId
}) => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="flex-shrink-0 p-6 border-b border-border">
          <h1 className="text-2xl font-bold text-text-primary">Pinned Tasks</h1>
          <p className="text-text-secondary mt-1">Your most important tasks, front and center.</p>
      </header>
      <div className="flex-1 overflow-y-auto p-6">
        <TaskList 
          tasks={tasks}
          onSelectTask={onSelectTask}
          onOpenTaskChat={onOpenTaskChat}
          onPinTask={onPinTask}
          onArchiveTask={onArchiveTask}
          activeTaskId={activeTaskId}
          viewMode="grid"
        />
      </div>
    </div>
  );
};
