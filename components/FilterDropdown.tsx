import React, { useState, useRef, useEffect } from 'react';

interface FilterDropdownProps {
  label: string;
  options: string[];
  selectedValue: string | null;
  onSelect: (value: string | null) => void;
}

const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
);


export const FilterDropdown: React.FC<FilterDropdownProps> = ({ label, options, selectedValue, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: string | null) => {
    onSelect(option);
    setIsOpen(false);
  }

  return (
    <div className="relative w-full md:w-auto" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full md:w-auto bg-card border border-border px-4 py-2 rounded-md text-text-secondary flex items-center justify-between gap-2"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span>{label}: {selectedValue || 'All'}</span>
        <ChevronDownIcon className="w-4 h-4" />
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-card-hover border border-border rounded-md shadow-lg z-20">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); handleSelect(null); }}
            className={`block px-4 py-2 text-sm ${!selectedValue ? 'text-accent font-semibold' : 'text-text-secondary'} hover:bg-sidebar`}
          >
            All
          </a>
          {options.map(option => (
            <a
              key={option}
              href="#"
              onClick={(e) => { e.preventDefault(); handleSelect(option); }}
              className={`block px-4 py-2 text-sm ${selectedValue === option ? 'text-accent font-semibold' : 'text-text-secondary'} hover:bg-sidebar`}
            >
              {option}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
