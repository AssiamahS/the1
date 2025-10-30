import React, { useState, useRef, useEffect } from 'react';
import { Task, ChatMessage, MessageSender } from '../types';
import { processUserRequest } from '../services/geminiService';
import type { FunctionCall } from '@google/genai';

interface TaskChatModalProps {
  task: Task;
  onClose: () => void;
  onUpdateTask: (args: { [key: string]: any }) => void;
}

type DisplayMode = 'modal' | 'minimized' | 'docked';

const SendIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
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

const DockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-4.5 0V6.75A.75.75 0 0 1 14.25 6h3.75a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-.75.75h-3.75a.75.75 0 0 1-.75-.75Z" />
    </svg>
);


const LoadingIndicator: React.FC = () => (
  <div className="flex items-center gap-2">
    <div className="h-2 w-2 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="h-2 w-2 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="h-2 w-2 bg-accent rounded-full animate-bounce"></div>
  </div>
);

export const TaskChatModal: React.FC<TaskChatModalProps> = ({ task, onClose, onUpdateTask }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: MessageSender.AGENT, text: `What can I do for task ${task.id}?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [displayMode, setDisplayMode] = useState<DisplayMode>('modal');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (displayMode === 'modal' && modalContentRef.current && !modalContentRef.current.contains(event.target as Node)) {
            onClose();
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, displayMode]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleSendMessage = async (message: string) => {
    const userMessage: ChatMessage = { sender: MessageSender.USER, text: message };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await processUserRequest(message, task);

      if (response.type === 'functionCall') {
        const fnCall = response.data as FunctionCall;
        if (fnCall.name === 'update_task_or_create_new') {
          onUpdateTask(fnCall.args);
          const systemMessage: ChatMessage = { sender: MessageSender.SYSTEM, text: `Task ${task.id} updated.` };
          setMessages(prev => [...prev, systemMessage]);
          if(displayMode === 'modal') setTimeout(onClose, 1000);
        } else {
            const agentMessage: ChatMessage = { sender: MessageSender.AGENT, text: "This action is not supported in task chat. Please use the main chat window." };
            setMessages(prev => [...prev, agentMessage]);
        }
      } else if (response.type === 'text') {
        const agentMessage: ChatMessage = { sender: MessageSender.AGENT, text: response.data as string };
        setMessages(prev => [...prev, agentMessage]);
      }
    } catch (error) {
      console.error("Error processing request:", error);
      const errorMessage: ChatMessage = { sender: MessageSender.SYSTEM, text: "An error occurred." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      handleSendMessage(input.trim());
      setInput('');
    }
  };

  const wrapperClasses = {
    modal: "fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4",
    minimized: "fixed bottom-4 right-4 z-50",
    docked: "fixed top-0 right-0 h-full z-40 p-4",
  };

  const modalContainerClasses = {
      modal: "bg-card border border-border rounded-lg flex flex-col h-full max-h-[80vh] w-full max-w-lg shadow-2xl",
      minimized: "bg-card border border-border rounded-lg flex items-center shadow-2xl cursor-pointer hover:bg-card-hover",
      docked: "bg-card border-l border-border rounded-l-lg flex flex-col h-full w-full max-w-md shadow-2xl"
  }

  if (displayMode === 'minimized') {
      return (
          <div className={wrapperClasses.minimized} onClick={() => setDisplayMode('modal')}>
              <div className={modalContainerClasses.minimized}>
                 <div className="p-3">
                    <h3 className="font-semibold text-text-primary text-sm truncate pr-12">{task.id}: {task.title}</h3>
                 </div>
                 <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="text-text-secondary hover:text-text-primary p-2 transition-colors absolute top-1/2 right-1 -translate-y-1/2" aria-label="Close modal">
                    <CloseIcon className="w-4 h-4"/>
                </button>
              </div>
          </div>
      )
  }

  return (
    <div className={wrapperClasses[displayMode]} aria-modal={displayMode === 'modal'}>
      <div className={modalContainerClasses[displayMode]} ref={modalContentRef}>
        <div className="p-4 border-b border-border flex justify-between items-center flex-shrink-0">
            <div className="overflow-hidden">
                <h3 className="font-semibold text-text-primary truncate pr-2">{task.id}: {task.title}</h3>
                <p className="text-xs text-text-secondary">Task-specific Chat</p>
            </div>
            <div className="flex items-center gap-1">
                <button onClick={() => setDisplayMode('minimized')} className="text-text-secondary hover:text-text-primary p-1 rounded-full hover:bg-sidebar transition-colors" aria-label="Minimize modal">
                    <MinimizeIcon className="w-5 h-5"/>
                </button>
                 <button onClick={() => setDisplayMode(displayMode === 'docked' ? 'modal' : 'docked')} className="text-text-secondary hover:text-text-primary p-1 rounded-full hover:bg-sidebar transition-colors" aria-label="Dock modal">
                    <DockIcon className="w-5 h-5"/>
                </button>
                <button onClick={onClose} className="text-text-secondary hover:text-text-primary p-1 rounded-full hover:bg-sidebar transition-colors" aria-label="Close modal">
                    <CloseIcon className="w-5 h-5"/>
                </button>
            </div>
        </div>
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
            <div key={index} className={`flex flex-col ${msg.sender === MessageSender.USER ? 'items-end' : 'items-start'}`}>
                <div className={`p-3 rounded-lg max-w-md text-sm ${msg.sender === MessageSender.USER ? 'bg-accent text-white' : msg.sender === MessageSender.AGENT ? 'bg-sidebar text-text-primary' : 'bg-transparent text-text-tertiary text-center w-full'}`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
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
        <div className="border-t border-border p-4 flex-shrink-0">
            <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g., 'Mark as complete'"
                disabled={isLoading}
                className="flex-1 bg-sidebar border border-border rounded-md px-4 py-2 focus:ring-2 focus:ring-accent focus:outline-none disabled:opacity-50"
                autoComplete="off"
                autoFocus
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
    </div>
  );
};