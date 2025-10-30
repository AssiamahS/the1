import React, { useState, useMemo } from 'react';
import { Task, Agent, Status } from '../types';
import { Header } from './Header';
import { TaskList } from './TaskList';

interface TasksViewProps {
  tasks: Task[];
  onSelectTask: (task: Task | null) => void;
  onOpenTaskChat: (task: Task) => void;
  onPinTask: (taskId: string) => void;
  onArchiveTask: (taskId: string) => void;
  activeTaskId: string | null;
  isChatClosed: boolean;
  onOpenChat: () => void;
}

export const TasksView: React.FC<TasksViewProps> = ({ tasks, onSelectTask, onOpenTaskChat, onPinTask, onArchiveTask, activeTaskId, isChatClosed, onOpenChat }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeFilters, setActiveFilters] = useState<{ status: Status | null, agent: Agent | null }>({
    status: null,
    agent: null,
  });

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            task.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = activeFilters.status ? task.status === activeFilters.status : true;
      const matchesAgent = activeFilters.agent ? task.agent === activeFilters.agent : true;
      
      return matchesSearch && matchesStatus && matchesAgent;
    });
  }, [tasks, searchTerm, activeFilters]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header 
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        activeFilters={activeFilters}
        onActiveFiltersChange={setActiveFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        isChatClosed={isChatClosed}
        onOpenChat={onOpenChat}
      />
      <div className="flex-1 overflow-y-auto p-6">
        <TaskList 
          tasks={filteredTasks}
          onSelectTask={onSelectTask}
          onOpenTaskChat={onOpenTaskChat}
          onPinTask={onPinTask}
          onArchiveTask={onArchiveTask}
          activeTaskId={activeTaskId}
          viewMode={viewMode}
        />
      </div>
    </div>
  );
};
