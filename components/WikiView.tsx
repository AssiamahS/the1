import React, { useState, useRef } from 'react';
import { Point, StickyNote } from '../types';

const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);
const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

interface StickyNoteProps {
    note: StickyNote;
    onUpdate: (id: string, content: string) => void;
    onDelete: (id: string) => void;
    onMove: (id: string, position: Point) => void;
}

const StickyNoteComponent: React.FC<StickyNoteProps> = ({ note, onUpdate, onDelete, onMove }) => {
    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('noteId', note.id);
        const style = window.getComputedStyle(e.currentTarget);
        const offsetX = parseInt(style.getPropertyValue('left'), 10) - e.clientX;
        const offsetY = parseInt(style.getPropertyValue('top'), 10) - e.clientY;
        e.dataTransfer.setData('dragOffset', JSON.stringify({ x: offsetX, y: offsetY }));
    };

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            className="absolute w-64 h-64 p-4 rounded-lg shadow-xl flex flex-col cursor-grab"
            style={{ left: note.position.x, top: note.position.y, backgroundColor: note.color }}
        >
            <textarea
                className="flex-1 bg-transparent text-gray-800 font-medium resize-none focus:outline-none placeholder-gray-600/70"
                value={note.content}
                onChange={(e) => onUpdate(note.id, e.target.value)}
                placeholder="Write something..."
            />
             <button onClick={() => onDelete(note.id)} className="absolute top-2 right-2 p-1 text-gray-700/50 hover:text-gray-800">
                <CloseIcon className="w-4 h-4" />
            </button>
        </div>
    );
}


export const WikiView: React.FC = () => {
    const [stickies, setStickies] = useState<StickyNote[]>([]);
    const canvasRef = useRef<HTMLDivElement>(null);
    
    const colors = ['#F9E79F', '#A3E4D7', '#F5B7B1', '#D7BDE2', '#AED6F1'];

    const handleAddSticky = () => {
        const newSticky: StickyNote = {
            id: `sticky_${Date.now()}`,
            content: '',
            position: { x: 50, y: 150 },
            color: colors[Math.floor(Math.random() * colors.length)]
        };
        setStickies(prev => [...prev, newSticky]);
    };

    const handleUpdateSticky = (id: string, content: string) => {
        setStickies(prev => prev.map(s => s.id === id ? { ...s, content } : s));
    };
    
    const handleDeleteSticky = (id: string) => {
        setStickies(prev => prev.filter(s => s.id !== id));
    };

    const handleStickyMove = (id: string, position: Point) => {
        setStickies(prev => prev.map(s => s.id === id ? { ...s, position } : s));
    };
    
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const canvasBounds = canvasRef.current?.getBoundingClientRect();
        if (!canvasBounds) return;

        const noteId = e.dataTransfer.getData('noteId');
        if (noteId) {
            const offset = JSON.parse(e.dataTransfer.getData('dragOffset'));
            const newPosition = {
                x: e.clientX + offset.x,
                y: e.clientY + offset.y,
            };
            handleStickyMove(noteId, newPosition);
        }
    };


    return (
        <div className="flex-1 flex flex-col overflow-hidden">
             <header className="flex-shrink-0 p-6 border-b border-border flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Good Morning Vision Board</h1>
                    <p className="text-text-secondary mt-1">Your personal space for ideas and inspiration.</p>
                </div>
                <button
                    onClick={handleAddSticky}
                    className="flex items-center gap-2 px-3 py-1.5 bg-accent text-white font-semibold rounded-md hover:bg-accent-hover focus:ring-2 focus:ring-accent focus:outline-none transition-colors"
                >
                    <PlusIcon className="w-5 h-5"/>
                    <span>Add Sticky</span>
                </button>
             </header>
             <div 
                ref={canvasRef}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="flex-1 overflow-hidden relative bg-[radial-gradient(#30363D_1px,transparent_1px)] [background-size:20px_20px]"
             >
                {stickies.map(note => (
                    <StickyNoteComponent
                        key={note.id}
                        note={note}
                        onUpdate={handleUpdateSticky}
                        onDelete={handleDeleteSticky}
                        onMove={handleStickyMove}
                    />
                ))}
             </div>
        </div>
    );
};
