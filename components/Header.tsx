import React from 'react';
import { Agent, Status } from '../types';
import { FilterDropdown } from './FilterDropdown';

const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);
const GridIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 8.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 8.25 20.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
  </svg>
);
const ListIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);
const ChatIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.158 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l3.662-3.738c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.206 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.344 48.344 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
  </svg>
);



interface HeaderProps {
    searchTerm: string;
    onSearchTermChange: (term: string) => void;
    activeFilters: { status: Status | null, agent: Agent | null };
    onActiveFiltersChange: React.Dispatch<React.SetStateAction<{ status: Status | null; agent: Agent | null; }>>;
    viewMode: 'grid' | 'list';
    onViewModeChange: (mode: 'grid' | 'list') => void;
    isChatClosed: boolean;
    onOpenChat: () => void;
}

export const Header: React.FC<HeaderProps> = ({ searchTerm, onSearchTermChange, activeFilters, onActiveFiltersChange, viewMode, onViewModeChange, isChatClosed, onOpenChat }) => {

  const statusOptions = Object.values(Status);
  const agentOptions = Object.values(Agent);

  return (
    <header className="flex-shrink-0 p-6 border-b border-border">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text-primary">Tasks Dashboard</h1>
         <div className="flex items-center gap-2">
            <div className="bg-card border border-border p-1 rounded-md flex">
              <button onClick={() => onViewModeChange('list')} className={`p-1 rounded ${viewMode === 'list' ? 'bg-accent text-white' : 'text-text-secondary hover:bg-sidebar'}`}><ListIcon className="w-5 h-5"/></button>
              <button onClick={() => onViewModeChange('grid')} className={`p-1 rounded ${viewMode === 'grid' ? 'bg-accent text-white' : 'text-text-secondary hover:bg-sidebar'}`}><GridIcon className="w-5 h-5"/></button>
            </div>
            {isChatClosed && (
                <button onClick={onOpenChat} className="p-2 text-text-secondary hover:text-text-primary bg-card border border-border rounded-md">
                    <ChatIcon className="w-5 h-5" />
                </button>
            )}
        </div>
      </div>
      <div className="mt-4 flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 relative w-full">
            <input 
                type="text" 
                placeholder="Filter tasks by keyword..." 
                className="w-full bg-sidebar border border-border rounded-md pl-10 pr-4 py-2 focus:ring-2 focus:ring-accent focus:outline-none"
                value={searchTerm}
                onChange={(e) => onSearchTermChange(e.target.value)}
            />
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary"/>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
            <FilterDropdown
                label="Status"
                options={statusOptions}
                selectedValue={activeFilters.status}
                onSelect={(value) => onActiveFiltersChange(prev => ({ ...prev, status: value as Status | null }))}
            />
            <FilterDropdown
                label="Assignee"
                options={agentOptions}
                selectedValue={activeFilters.agent}
                onSelect={(value) => onActiveFiltersChange(prev => ({ ...prev, agent: value as Agent | null }))}
            />
        </div>
      </div>
    </header>
  );
};
