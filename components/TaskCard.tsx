
import React, { useState } from 'react';
import { Task, Status } from '../types';
import { STATUS_COLORS } from '../constants';

interface TaskCardProps {
  task: Task;
  onSelectTask: (task: Task) => void;
  onOpenTaskChat: (task: Task) => void;
  isActive: boolean;
}

const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

const PinIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H12H7.5M12 3.75v10.5" />
    </svg>
);

const ArchiveIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4" />
    </svg>
);

const DotsVerticalIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
    </svg>
);

const StatusIcon: React.FC<{ status: Status }> = ({ status }) => (
  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${STATUS_COLORS[status]}`}>
    <div className="w-4 h-4 rounded-full bg-card">
      <div className={`w-2.5 h-2.5 rounded-full m-auto ${STATUS_COLORS[status]}`}></div>
    </div>
  </div>
);

export const TaskCard: React.FC<TaskCardProps> = ({ task, onSelectTask, onOpenTaskChat, isActive }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div
      onClick={() => onSelectTask(task)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectTask(task)}
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      className={`bg-card border rounded-lg p-4 group hover:border-accent transition-all duration-200 flex flex-col justify-between h-full min-h-[180px] w-full text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent relative ${isActive ? 'border-accent ring-2 ring-accent/50' : 'border-border'}`}
    >
      {task.pinned && <PinIcon className="w-4 h-4 text-accent absolute top-4 right-4" />}
      <div>
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-md font-semibold text-text-primary pr-8">{task.title}</h3>
          <StatusIcon status={task.status} />
        </div>
        <div className="space-y-1 text-sm text-text-secondary">
            <p>Agent: {task.agent}</p>
            <p>Status: {task.status}</p>
            <p>Last updated: 18m ago</p>
        </div>
      </div>
      <div className="flex justify-end items-center mt-4 gap-2">
         <button 
            onClick={(e) => { e.stopPropagation(); onOpenTaskChat(task); }}
            className="w-8 h-8 flex items-center justify-center text-text-secondary bg-sidebar border border-border rounded-full hover:text-text-primary hover:border-accent transition-colors z-10"
            aria-label="Open task chat"
         >
            <PlusIcon className="w-5 h-5"/>
         </button>
         <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
              className="w-8 h-8 flex items-center justify-center text-text-secondary bg-sidebar border border-border rounded-full hover:text-text-primary hover:border-accent transition-colors z-10"
              aria-haspopup="true"
              aria-expanded={isMenuOpen}
            >
              <DotsVerticalIcon className="w-5 h-5" />
            </button>
            {isMenuOpen && (
              <div className="absolute bottom-full right-0 mb-2 w-40 bg-card-hover border border-border rounded-md shadow-lg z-20">
                <a href="#" className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-sidebar">
                  <PinIcon className="w-4 h-4"/> Pin Task
                </a>
                <a href="#" className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-sidebar">
                  <ArchiveIcon className="w-4 h-4"/> Archive Task
                </a>
              </div>
            )}
         </div>
      </div>
    </div>
  );
};
