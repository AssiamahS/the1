
import React, { useState, useCallback } from 'react';
import { Task, Agent, Status, ChatMessage, MessageSender } from './types';
import { INITIAL_TASKS } from './constants';
import { TaskList } from './components/TaskList';
import { ChatPanel } from './components/ChatPanel';
import { Sidebar } from './components/Sidebar';
import { TaskChatModal } from './components/TaskChatModal';
import { processUserRequest } from './services/geminiService';
import type { FunctionCall } from '@google/genai';

const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: MessageSender.AGENT,
      text: "I am the Task Manager Agent (TMA). How can I assist you with your tasks today?",
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [modalTask, setModalTask] = useState<Task | null>(null);

  const getNextTaskId = useCallback(() => {
    const maxId = tasks.reduce((max, task) => {
      const idNum = parseInt(task.id.split('-')[1]);
      return idNum > max ? idNum : max;
    }, 0);
    return `TSK-${String(maxId + 1).padStart(3, '0')}`;
  }, [tasks]);

  const handleGetTaskData = useCallback((args: { [key: string]: any }) => {
    let filteredTasks = [...tasks];
    if (args.task_id) {
      filteredTasks = filteredTasks.filter(t => t.id === args.task_id);
    }
    if (args.status_filter) {
      filteredTasks = filteredTasks.filter(t => t.status.toLowerCase() === args.status_filter.toLowerCase());
    }
    if (args.assigned_agent) {
      filteredTasks = filteredTasks.filter(t => t.agent.toLowerCase() === args.assigned_agent.toLowerCase());
    }

    const responseText = filteredTasks.length > 0
      ? `Here are the tasks matching your criteria:`
      : `I couldn't find any tasks matching your criteria.`;

    setMessages(prev => [...prev, {
      sender: MessageSender.AGENT,
      text: responseText,
      tasks: filteredTasks,
    }]);
  }, [tasks]);
  
  const handleUpdateTask = useCallback((args: { [key: string]: any }) => {
    let responseText = '';
    
    setTasks(currentTasks => {
        const taskIndex = currentTasks.findIndex(t => t.id === args.task_id);
        if (taskIndex !== -1) {
            const updatedTask = { ...currentTasks[taskIndex] };
            if (args.title) updatedTask.title = args.title;
            if (args.description) updatedTask.description = args.description;
            if (args.status) updatedTask.status = args.status as Status;
            if (args.assigned_agent) updatedTask.agent = args.assigned_agent as Agent;
            
            const newTasks = [...currentTasks];
            newTasks[taskIndex] = updatedTask;
            responseText = `Task ${args.task_id} has been updated successfully.`;
            return newTasks;
        } else {
            const newTaskId = args.task_id || getNextTaskId();
            const newTask: Task = {
                id: newTaskId,
                title: args.title || 'New Task',
                description: args.description || '',
                agent: args.assigned_agent as Agent || Agent.UNASSIGNED,
                status: args.status as Status || Status.BACKLOG,
                pinned: false,
            };
            responseText = `New task ${newTaskId} has been created successfully.`;
            return [...currentTasks, newTask];
        }
    });

    setMessages(prev => [...prev, {
      sender: MessageSender.SYSTEM,
      text: responseText,
    }]);

  }, [getNextTaskId]);

  const handleSelectTask = (task: Task) => {
    setActiveTask(task);
    setMessages([
      {
        sender: MessageSender.AGENT,
        text: `Now focused on task ${task.id}: "${task.title}". How can I assist with this task?`
      }
    ]);
  };

  const handleClearActiveTask = () => {
    setActiveTask(null);
    setMessages([
      {
        sender: MessageSender.AGENT,
        text: "I am the Task Manager Agent (TMA). How can I assist you with your tasks today?",
      }
    ]);
  };

  const handleSendMessage = async (message: string) => {
    const userMessage: ChatMessage = { sender: MessageSender.USER, text: message };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await processUserRequest(message, activeTask);
      
      if (response.type === 'functionCall') {
          const fnCall = response.data as FunctionCall;
          if (fnCall.name === 'get_task_data') {
              handleGetTaskData(fnCall.args);
          } else if (fnCall.name === 'update_task_or_create_new') {
              handleUpdateTask(fnCall.args);
          }
      } else if (response.type === 'text') {
        const agentMessage: ChatMessage = { sender: MessageSender.AGENT, text: response.data as string };
        setMessages(prev => [...prev, agentMessage]);
      }
    } catch (error) {
      console.error("Error processing request:", error);
      const errorMessage: ChatMessage = { sender: MessageSender.SYSTEM, text: "Sorry, an error occurred while processing your request." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenTaskChat = (task: Task) => {
    setModalTask(task);
  };

  const handleCloseTaskChat = () => {
    setModalTask(null);
  };

  return (
    <div className="flex h-screen font-sans antialiased">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen">
        <div className="flex-shrink-0 p-6 border-b border-border">
          <header className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-text-primary">AI Workspace Dashboard</h1>
            {/* Additional header icons can go here */}
          </header>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex-1 relative">
                <input type="text" placeholder="Filter tasks..." className="w-full bg-sidebar border border-border rounded-md pl-10 pr-4 py-2 focus:ring-2 focus:ring-accent focus:outline-none"/>
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary"/>
            </div>
            <button className="bg-card border border-border px-4 py-2 rounded-md text-text-secondary">Status: All</button>
            <button className="bg-card border border-border px-4 py-2 rounded-md text-text-secondary">Assignee: All</button>
          </div>
        </div>
        
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-6 p-6 overflow-hidden">
          <div className="lg:col-span-3 flex flex-col h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto pr-2">
              <TaskList 
                tasks={tasks} 
                setTasks={setTasks} 
                onSelectTask={handleSelectTask}
                onOpenTaskChat={handleOpenTaskChat}
                activeTaskId={activeTask?.id || null}
              />
            </div>
          </div>

          <div className="lg:col-span-2 h-full overflow-hidden">
            <ChatPanel 
              messages={messages} 
              onSendMessage={handleSendMessage} 
              isLoading={isLoading} 
              activeTask={activeTask}
              onClearActiveTask={handleClearActiveTask}
            />
          </div>
        </div>
      </main>
      {modalTask && (
        <TaskChatModal
          task={modalTask}
          onClose={handleCloseTaskChat}
          onUpdateTask={handleUpdateTask}
        />
      )}
    </div>
  );
};

export default App;
