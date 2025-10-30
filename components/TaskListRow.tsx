import React, { useState, useRef, useEffect } from 'react';
import { Task, Agent, Status } from '../types';
import { AGENT_COLORS, STATUS_COLORS } from '../constants';

const DotsVerticalIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
  </svg>
);

const PlusCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

interface TaskListRowProps {
  task: Task;
  onSelect: () => void;
  onOpenChat: (task: Task) => void;
  onPin: (taskId: string) => void;
  onArchive: (taskId: string) => void;
  isActive: boolean;
}

export const TaskListRow: React.FC<TaskListRowProps> = ({ task, onSelect, onOpenChat, onPin, onArchive, isActive }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const agentColor = AGENT_COLORS[task.agent] || AGENT_COLORS[Agent.UNASSIGNED];
  const statusColor = STATUS_COLORS[task.status] || 'bg-gray';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(prev => !prev);
  };
  
  return (
    <div 
      onClick={onSelect}
      className={`bg-card border rounded-lg px-4 py-3 grid grid-cols-12 gap-4 items-center transition-all duration-200 cursor-pointer hover:bg-card-hover ${isActive ? 'ring-2 ring-accent' : 'border-border'}`}
    >
      <div className="col-span-1 text-sm font-medium text-text-secondary">{task.id}</div>
      <div className="col-span-5 font-semibold text-text-primary">{task.title}</div>
      <div className="col-span-2">
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ring-1 ring-inset ${agentColor}`}>
          {task.agent}
        </span>
      </div>
      <div className="col-span-2">
        <div className="flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-full ${statusColor}`}></span>
            <span className="text-xs text-text-secondary">{task.status}</span>
        </div>
      </div>
      <div className="col-span-2 flex items-center justify-end gap-2">
        <button
            onClick={(e) => { e.stopPropagation(); onOpenChat(task); }}
            className="text-text-secondary hover:text-accent p-1 rounded-full hover:bg-sidebar"
            aria-label="Open task chat"
        >
            <PlusCircleIcon className="w-5 h-5" />
        </button>
        <div className="relative" ref={menuRef}>
            <button 
              onClick={handleMenuToggle}
              className="text-text-secondary hover:text-accent p-1 rounded-full hover:bg-sidebar"
            >
              <DotsVerticalIcon className="w-5 h-5" />
            </button>
            {isMenuOpen && (
              <div className="absolute top-full right-0 mt-1 w-36 bg-card-hover border border-border rounded-md shadow-lg z-10">
                <button onClick={(e) => { e.stopPropagation(); onPin(task.id); setIsMenuOpen(false);}} className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-sidebar">{task.pinned ? 'Unpin Task' : 'Pin Task'}</button>
                <button onClick={(e) => { e.stopPropagation(); onArchive(task.id); setIsMenuOpen(false);}} className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-sidebar">Archive Task</button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};