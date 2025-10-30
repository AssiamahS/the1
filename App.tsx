import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatPanel } from './components/ChatPanel';
import { TasksView } from './components/TasksView';
import { AgentsView } from './components/AgentsView';
import { WorkflowsView } from './components/WorkflowsView';
import { ArchivedView } from './components/ArchivedView';
import { PinnedView } from './components/PinnedView';
import { TaskChatModal } from './components/TaskChatModal';
import { Task } from './types';
import { INITIAL_TASKS } from './constants';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [activeView, setActiveView] = useState('tasks');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskForChatModal, setTaskForChatModal] = useState<Task | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [chatState, setChatState] = useState({ isMinimized: false, isClosed: false });

  const handleUpdateTask = (updatedArgs: { [key: string]: any }) => {
    const taskId = updatedArgs.task_id || taskForChatModal?.id;
    if (!taskId) return;
    setTasks(currentTasks =>
      currentTasks.map(t => t.id === taskId ? { ...t, ...updatedArgs } : t)
    );
    if (taskForChatModal?.id === taskId) {
        setTaskForChatModal(prev => prev ? { ...prev, ...updatedArgs } : null);
    }
  };

  const handlePinTask = (taskId: string) => {
    setTasks(currentTasks =>
      currentTasks.map(t => t.id === taskId ? { ...t, pinned: !t.pinned } : t)
    );
  };
  
  const handleArchiveTask = (taskId: string) => {
    setTasks(currentTasks =>
      currentTasks.map(t => t.id === taskId ? { ...t, archived: true } : t)
    );
  };
  
  const handleRestoreTask = (taskId: string) => {
    setTasks(currentTasks =>
      currentTasks.map(t => t.id === taskId ? { ...t, archived: false } : t)
    );
  };


  const renderActiveView = () => {
    const visibleTasks = tasks.filter(t => !t.archived);
    const archivedTasks = tasks.filter(t => t.archived);
    const pinnedTasks = tasks.filter(t => t.pinned && !t.archived);

    switch (activeView) {
      case 'tasks':
        return (
          <TasksView
            tasks={visibleTasks}
            onSelectTask={setSelectedTask}
            onOpenTaskChat={setTaskForChatModal}
            onPinTask={handlePinTask}
            onArchiveTask={handleArchiveTask}
            activeTaskId={selectedTask?.id ?? null}
            isChatClosed={chatState.isClosed}
            onOpenChat={() => setChatState({ ...chatState, isClosed: false, isMinimized: false })}
          />
        );
       case 'pinned':
        return (
          <PinnedView
            tasks={pinnedTasks}
            onSelectTask={setSelectedTask}
            onOpenTaskChat={setTaskForChatModal}
            onPinTask={handlePinTask}
            onArchiveTask={handleArchiveTask}
            activeTaskId={selectedTask?.id ?? null}
          />
        );
      case 'agents':
        return <AgentsView />;
      case 'workflows':
        return <WorkflowsView />;
      case 'archived':
        return <ArchivedView tasks={archivedTasks} onRestoreTask={handleRestoreTask} />;
      default:
        return <TasksView tasks={visibleTasks} onSelectTask={setSelectedTask} onOpenTaskChat={setTaskForChatModal} onPinTask={handlePinTask} onArchiveTask={handleArchiveTask} activeTaskId={selectedTask?.id ?? null} isChatClosed={chatState.isClosed} onOpenChat={() => setChatState({ ...chatState, isClosed: false, isMinimized: false })}/>;
    }
  };

  return (
    <div className="bg-background text-text-primary h-screen w-screen flex overflow-hidden">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        {renderActiveView()}
      </main>
      <ChatPanel 
        tasks={tasks} 
        setTasks={setTasks} 
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
        isMinimized={chatState.isMinimized}
        isClosed={chatState.isClosed}
        onMinimize={() => setChatState({ ...chatState, isMinimized: true })}
        onClose={() => setChatState({ ...chatState, isClosed: true })}
        onOpen={() => setChatState({ ...chatState, isMinimized: false, isClosed: false })}
      />
      {taskForChatModal && (
        <TaskChatModal
          task={taskForChatModal}
          onClose={() => setTaskForChatModal(null)}
          onUpdateTask={handleUpdateTask}
        />
      )}
    </div>
  );
};

export default App;
