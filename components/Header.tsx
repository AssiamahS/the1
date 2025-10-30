import React from 'react';
import { Agent, Status } from '../types';
import { FilterDropdown } from './FilterDropdown';

const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

interface HeaderProps {
    searchTerm: string;
    onSearchTermChange: (term: string) => void;
    activeFilters: { status: Status | null, agent: Agent | null };
    onActiveFiltersChange: React.Dispatch<React.SetStateAction<{ status: Status | null; agent: Agent | null; }>>;
}

export const Header: React.FC<HeaderProps> = ({ searchTerm, onSearchTermChange, activeFilters, onActiveFiltersChange }) => {

  const statusOptions = Object.values(Status);
  const agentOptions = Object.values(Agent);

  return (
    <header className="flex-shrink-0 p-6 border-b border-border">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text-primary">AI Workspace Dashboard</h1>
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
