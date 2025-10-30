import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, MessageSender, Task } from '../types';
import { TaskList } from './TaskList';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  activeTask: Task | null;
  onClearActiveTask: () => void;
}

const SendIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
);

const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
);

const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const MinimizeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
    </svg>
);

const LoadingIndicator: React.FC = () => (
  <div className="flex items-center gap-2">
    <div className="h-2 w-2 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="h-2 w-2 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="h-2 w-2 bg-accent rounded-full animate-bounce"></div>
  </div>
);

export const ChatPanel: React.FC<ChatPanelProps> = ({ messages, onSendMessage, isLoading, activeTask, onClearActiveTask }) => {
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };
  
  if (isMinimized) {
    return (
      <div className="bg-card border border-border rounded-lg flex h-full items-center justify-center">
        <button 
          onClick={() => setIsMinimized(false)}
          className="bg-accent text-white font-semibold rounded-md hover:bg-accent-hover focus:ring-2 focus:ring-accent focus:outline-none transition-colors px-4 py-2"
        >
          Show Chat
        </button>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg flex flex-col h-full">
      <div className="p-4 border-b border-border flex justify-between items-center min-h-[73px]">
        <div className="flex flex-col overflow-hidden">
            <h3 className="font-semibold text-text-primary">{activeTask ? 'Task Chat' : 'Lobe Chat'}</h3>
            {/* FIX: Changed `active.title` to `activeTask.title` to correctly reference the active task prop. */}
            {activeTask && <p className="text-xs text-text-secondary truncate pr-2" title={activeTask.title}>{activeTask.id}: {activeTask.title}</p>}
        </div>
        <div className="flex items-center gap-2">
          {activeTask && (
              <button onClick={onClearActiveTask} className="text-text-secondary hover:text-text-primary p-1 rounded-full hover:bg-sidebar transition-colors" aria-label="Close task chat">
                  <CloseIcon className="w-5 h-5"/>
              </button>
          )}
          <button onClick={() => setIsMinimized(true)} className="text-text-secondary hover:text-text-primary p-1 rounded-full hover:bg-sidebar transition-colors" aria-label="Minimize chat">
              <MinimizeIcon className="w-5 h-5"/>
          </button>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-6">
        {messages.map((msg, index) => (
          <div key={index} className={`flex flex-col ${msg.sender === MessageSender.USER ? 'items-end' : 'items-start'}`}>
            <div className={`p-3 rounded-lg max-w-lg ${msg.sender === MessageSender.USER ? 'bg-accent text-white' : 'bg-sidebar text-text-primary'}`}>
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
            </div>
             {msg.tasks && msg.tasks.length > 0 && (
                <div className="mt-4 w-full">
                    <TaskList tasks={msg.tasks} setTasks={() => {}} onSelectTask={() => {}} onOpenTaskChat={() => {}} activeTaskId={null} />
                </div>
            )}
          </div>
        ))}
         {isLoading && (
          <div className="flex flex-col items-start">
            <div className="p-3 rounded-lg bg-sidebar text-text-primary">
                <LoadingIndicator />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t border-border p-4">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-sidebar flex items-center justify-center border border-border text-text-secondary">
                <UserIcon className="w-5 h-5"/>
            </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your command..."
            disabled={isLoading}
            className="flex-1 bg-sidebar border border-border rounded-md px-4 py-2 focus:ring-2 focus:ring-accent focus:outline-none disabled:opacity-50"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2 bg-accent text-white font-semibold rounded-md hover:bg-accent-hover focus:ring-2 focus:ring-accent focus:outline-none disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            aria-label="Send message"
          >
             <SendIcon className="w-5 h-5"/>
          </button>
        </form>
      </div>
    </div>
  );
};