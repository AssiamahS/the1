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
    return tasks
      .filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              task.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = activeFilters.status ? task.status === activeFilters.status : true;
        const matchesAgent = activeFilters.agent ? task.agent === activeFilters.agent : true;
        
        return matchesSearch && matchesStatus && matchesAgent;
      });
  }, [tasks, searchTerm, activeFilters]);

  const pinnedTasks = useMemo(() => filteredTasks.filter(t => t.pinned).sort((a,b) => a.id.localeCompare(b.id)), [filteredTasks]);
  const otherTasks = useMemo(() => filteredTasks.filter(t => !t.pinned).sort((a,b) => a.id.localeCompare(b.id)), [filteredTasks]);


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
        {pinnedTasks.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xs font-semibold uppercase text-text-secondary tracking-wider mb-4">Pinned</h2>
            <TaskList
              tasks={pinnedTasks}
              onSelectTask={onSelectTask}
              onOpenTaskChat={onOpenTaskChat}
              onPinTask={onPinTask}
              onArchiveTask={onArchiveTask}
              activeTaskId={activeTaskId}
              viewMode={viewMode}
            />
          </div>
        )}
        
        {pinnedTasks.length > 0 && otherTasks.length > 0 && (
            <div className="border-t border-border mb-8"></div>
        )}
        
        {otherTasks.length > 0 && (
            <TaskList
              tasks={otherTasks}
              onSelectTask={onSelectTask}
              onOpenTaskChat={onOpenTaskChat}
              onPinTask={onPinTask}
              onArchiveTask={onArchiveTask}
              activeTaskId={activeTaskId}
              viewMode={viewMode}
            />
        )}
        
        {filteredTasks.length === 0 && (
            <div className="text-center text-text-secondary py-10">No tasks found.</div>
        )}
      </div>
    </div>
  );
};