import React, { useState, useRef, useEffect } from 'react';
import { Task, Agent } from '../types';
import { AGENT_COLORS, STATUS_COLORS } from '../constants';

const PinIcon: React.FC<{ pinned: boolean }> = ({ pinned }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={pinned ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 text-accent">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 17.25V3.75m0 13.5L9.75 21m2.25-3.75L14.25 21M9 3v1.5a3 3 0 01-3 3H3m18 0h-3a3 3 0 01-3-3V3m-9 1.5h6" />
  </svg>
);

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


interface TaskCardProps {
  task: Task;
  onSelect: () => void;
  onOpenChat: (task: Task) => void;
  onPin: (taskId: string) => void;
  onArchive: (taskId: string) => void;
  isActive: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onSelect, onOpenChat, onPin, onArchive, isActive }) => {
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
  }

  const handlePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPin(task.id);
    setIsMenuOpen(false);
  }
  
  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    onArchive(task.id);
    setIsMenuOpen(false);
  }

  return (
    <div 
      onClick={onSelect}
      className={`bg-card border rounded-lg p-4 flex flex-col justify-between transition-all duration-200 cursor-pointer hover:shadow-lg hover:-translate-y-1 ${isActive ? 'ring-2 ring-accent shadow-xl' : 'border-border hover:border-border-hover'}`}
    >
      <div>
        <div className="flex justify-between items-start mb-2">
          <span className="text-sm font-medium text-text-secondary">{task.id}</span>
           <div className="flex items-center gap-2">
            {task.pinned && <PinIcon pinned={true} />}
            <div className="relative" ref={menuRef}>
              <button 
                onClick={handleMenuToggle}
                className="text-text-secondary hover:text-accent p-1 rounded-full hover:bg-card-hover"
              >
                <DotsVerticalIcon className="w-5 h-5" />
              </button>
              {isMenuOpen && (
                <div className="absolute top-full right-0 mt-1 w-36 bg-card-hover border border-border rounded-md shadow-lg z-10">
                  <button onClick={handlePin} className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-sidebar">{task.pinned ? 'Unpin Task' : 'Pin Task'}</button>
                  <button onClick={handleArchive} className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-sidebar">Archive Task</button>
                </div>
              )}
            </div>
           </div>
        </div>
        <h3 className="font-semibold text-text-primary mb-2">{task.title}</h3>
        <p className="text-sm text-text-secondary line-clamp-3">{task.description}</p>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ring-1 ring-inset ${agentColor}`}>
            {task.agent}
          </span>
          <div className="flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-full ${statusColor}`}></span>
            <span className="text-xs text-text-secondary">{task.status}</span>
          </div>
        </div>
        <button
            onClick={(e) => { e.stopPropagation(); onOpenChat(task); }}
            className="text-text-secondary hover:text-accent p-1 rounded-full hover:bg-card-hover"
            aria-label="Open task chat"
        >
            <PlusCircleIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
