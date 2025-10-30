import React, { useState, useRef, useEffect } from 'react';
import { Task, ChatMessage, MessageSender, Agent, Status } from '../types';
import { processUserRequest } from '../services/geminiService';
import type { FunctionCall } from '@google/genai';

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


const LoadingIndicator: React.FC = () => (
  <div className="flex items-center gap-2">
    <div className="h-2 w-2 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="h-2 w-2 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="h-2 w-2 bg-accent rounded-full animate-bounce"></div>
  </div>
);

interface ChatPanelProps {
    tasks: Task[];
    setTasks: (tasks: Task[] | ((prevTasks: Task[]) => Task[])) => void;
    selectedTask: Task | null;
    setSelectedTask: (task: Task | null) => void;
    isMinimized: boolean;
    isClosed: boolean;
    onMinimize: () => void;
    onClose: () => void;
    onOpen: () => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ tasks, setTasks, selectedTask, setSelectedTask, isMinimized, isClosed, onMinimize, onClose, onOpen }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { sender: MessageSender.AGENT, text: "Hello! How can I help you manage your tasks today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    useEffect(() => {
        if(selectedTask) {
            const systemMessage: ChatMessage = {
                sender: MessageSender.SYSTEM,
                text: `Task context set to ${selectedTask.id}: "${selectedTask.title}". Future commands will apply to this task unless specified otherwise.`
            };
            setMessages(prev => [...prev, systemMessage]);
        }
    }, [selectedTask]);


    const handleFunctionCall = (fnCall: FunctionCall) => {
        if (fnCall.name === 'get_task_data') {
            let results = [...tasks];
            if(fnCall.args.task_id) {
                // Fix: Cast fnCall.args property to string to resolve type error.
                results = results.filter(t => t.id === (fnCall.args.task_id as string));
            }
            if(fnCall.args.status_filter) {
                // Fix: Cast fnCall.args property to string to resolve type error.
                results = results.filter(t => t.status === (fnCall.args.status_filter as string));
            }
            if(fnCall.args.assigned_agent) {
                // Fix: Cast fnCall.args property to string to resolve type error.
                results = results.filter(t => t.agent === (fnCall.args.assigned_agent as string));
            }

            if(results.length > 0) {
                 const systemMessage: ChatMessage = { sender: MessageSender.SYSTEM, text: `Found ${results.length} tasks.`, tasks: results };
                 setMessages(prev => [...prev, systemMessage]);
            } else {
                 const systemMessage: ChatMessage = { sender: MessageSender.SYSTEM, text: `No tasks found matching your criteria.` };
                 setMessages(prev => [...prev, systemMessage]);
            }

        } else if (fnCall.name === 'update_task_or_create_new') {
            const { task_id, ...updates } = fnCall.args;
            let taskExists = false;

            const updatedTasks = tasks.map(t => {
                if (t.id === task_id) {
                    taskExists = true;
                    return { ...t, ...updates };
                }
                return t;
            });

            if (taskExists) {
                setTasks(updatedTasks);
            } else {
                // Create new task
                const newTask: Task = {
                    id: task_id as string,
                    title: (updates.title as string) || 'New Task',
                    description: (updates.description as string) || '',
                    agent: (updates.assigned_agent as Agent) || Agent.UNASSIGNED,
                    status: (updates.status as Status) || Status.BACKLOG,
                    pinned: false,
                };
                setTasks(prev => [...prev, newTask]);
            }

            const confirmationText = taskExists ? `Task ${task_id} updated successfully.` : `New task ${task_id} created.`;
            const systemMessage: ChatMessage = { sender: MessageSender.SYSTEM, text: confirmationText };
            setMessages(prev => [...prev, systemMessage]);
        }
    };


    const handleSendMessage = async (message: string) => {
        const userMessage: ChatMessage = { sender: MessageSender.USER, text: message };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        setInput('');

        try {
            const response = await processUserRequest(message, selectedTask);

            if (response.type === 'functionCall') {
                handleFunctionCall(response.data as FunctionCall);
            } else if (response.type === 'text') {
                const agentMessage: ChatMessage = { sender: MessageSender.AGENT, text: response.data as string };
                setMessages(prev => [...prev, agentMessage]);
            }
        // Fix: Corrected the syntax of the catch block.
        } catch (error) {
            console.error("Error processing request:", error);
            const errorMessage: ChatMessage = { sender: MessageSender.SYSTEM, text: "An error occurred while processing your request." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            handleSendMessage(input.trim());
        }
    };

    const renderTaskSnippet = (task: Task) => (
        <div key={task.id} className="bg-card border border-border-hover rounded-lg p-3 my-2 text-xs">
            <p className="font-bold text-text-primary">{task.id}: {task.title}</p>
            <p className="text-text-secondary mt-1">{task.status} - {task.agent}</p>
        </div>
    );
    
    if (isClosed) {
        return null;
    }

    if (isMinimized) {
        return (
            <div className="fixed bottom-4 right-4 z-50">
                <button onClick={onOpen} className="bg-card border border-border rounded-lg shadow-2xl px-4 py-3 hover:bg-card-hover">
                    <h3 className="font-semibold text-text-primary text-sm truncate">Task Manager Agent</h3>
                </button>
            </div>
        )
    }

    return (
        <aside className="w-96 bg-card border-l border-border flex flex-col h-full">
            <div className="p-4 border-b border-border flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-semibold text-text-primary">Task Manager Agent</h2>
                    <p className="text-sm text-text-secondary">Your AI assistant.</p>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={onMinimize} className="text-text-secondary hover:text-text-primary p-1 rounded-full hover:bg-sidebar transition-colors" aria-label="Minimize chat">
                        <MinimizeIcon className="w-5 h-5"/>
                    </button>
                    <button onClick={onClose} className="text-text-secondary hover:text-text-primary p-1 rounded-full hover:bg-sidebar transition-colors" aria-label="Close chat">
                        <CloseIcon className="w-5 h-5"/>
                    </button>
                </div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex flex-col ${msg.sender === MessageSender.USER ? 'items-end' : 'items-start'}`}>
                        <div className={`p-3 rounded-lg max-w-sm text-sm ${msg.sender === MessageSender.USER ? 'bg-accent text-white' : msg.sender === MessageSender.AGENT ? 'bg-sidebar text-text-primary' : 'bg-transparent text-text-tertiary text-center w-full text-xs italic'}`}>
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                            {msg.tasks && msg.tasks.length > 0 && (
                                <div className="mt-2">
                                    {msg.tasks.map(renderTaskSnippet)}
                                </div>
                            )}
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
             {selectedTask && (
                <div className="p-3 border-t border-b border-border bg-sidebar text-xs text-text-secondary flex justify-between items-center">
                    <span className="truncate pr-2">Context: {selectedTask.id}</span>
                    <button onClick={() => setSelectedTask(null)} className="p-1 rounded-full hover:bg-card-hover" aria-label="Clear context">
                        <CloseIcon className="w-4 h-4" />
                    </button>
                </div>
            )}
            <div className="border-t border-border p-4">
                <form onSubmit={handleSubmit} className="flex items-center gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about tasks..."
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
        </aside>
    );
};
