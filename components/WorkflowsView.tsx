import React, { useState, useRef, useCallback } from 'react';
import { WorkflowNode, Point } from '../types';

// Icons for the toolbar and nodes
const StarIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>
);
const AiIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 21v-1.5M12 5.25v.01M12 12v.01M12 18.75v.01M15.75 5.25v.01M15.75 12v.01M15.75 18.75v.01M19.5 8.25v.01M19.5 15.75v.01" /></svg>
);
const FlowIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.94l-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01l-.01.01" /></svg>
);
const IntegrationsIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
);
const SpecialIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 1 0 0-13.5h9a9.75 9.75 0 1 0 0 13.5Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12.75 5.25v2.058a4.5 4.5 0 0 1 0 8.884v2.058m-1.5-13.001v2.058a4.5 4.5 0 0 0 0 8.884v2.058" /></svg>
);


const toolbarItems = [
    { type: 'most_used', label: 'Most used', icon: StarIcon },
    { type: 'ai', label: 'AI', icon: AiIcon },
    { type: 'flow', label: 'Flow', icon: FlowIcon },
    { type: 'integrations', label: 'Integrations', icon: IntegrationsIcon },
    { type: 'special', label: 'Special', icon: SpecialIcon }
];

const DraggableNode: React.FC<{ node: WorkflowNode; onMove: (id: string, pos: Point) => void; }> = ({ node, onMove }) => {
    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('nodeId', node.id);
        const style = window.getComputedStyle(e.currentTarget);
        const offsetX = parseInt(style.getPropertyValue('left'), 10) - e.clientX;
        const offsetY = parseInt(style.getPropertyValue('top'), 10) - e.clientY;
        e.dataTransfer.setData('dragOffset', JSON.stringify({ x: offsetX, y: offsetY }));
    };

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            className="absolute bg-card border border-border rounded-lg p-3 cursor-grab flex items-center gap-3 shadow-lg"
            style={{ left: node.position.x, top: node.position.y }}
        >
            <node.icon className="w-5 h-5 text-accent"/>
            <span className="font-semibold text-sm">{node.label}</span>
        </div>
    );
};


export const WorkflowsView: React.FC = () => {
    const [nodes, setNodes] = useState<WorkflowNode[]>([]);
    const canvasRef = useRef<HTMLDivElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const canvasBounds = canvasRef.current?.getBoundingClientRect();
        if (!canvasBounds) return;

        const nodeId = e.dataTransfer.getData('nodeId');
        // If moving an existing node
        if (nodeId) {
            const offset = JSON.parse(e.dataTransfer.getData('dragOffset'));
            const newPosition = {
                x: e.clientX + offset.x,
                y: e.clientY + offset.y,
            };
            setNodes(currentNodes => currentNodes.map(n => n.id === nodeId ? { ...n, position: newPosition } : n));
            return;
        }

        // If dropping a new node from toolbar
        const type = e.dataTransfer.getData('toolbarItemType');
        const item = toolbarItems.find(it => it.type === type);
        if (item && canvasRef.current) {
            const position = {
                x: e.clientX - canvasBounds.left,
                y: e.clientY - canvasBounds.top,
            };
            const newNode: WorkflowNode = {
                id: `node_${Date.now()}`,
                type: item.type,
                label: item.label,
                position: position,
                icon: item.icon,
            };
            setNodes(prev => [...prev, newNode]);
        }
    };
    
    const handleNodeMove = useCallback((id: string, newPosition: Point) => {
        setNodes(currentNodes => currentNodes.map(n => n.id === id ? { ...n, position: newPosition } : n));
    }, []);

    const handleDragStart = (e: React.DragEvent, type: string) => {
        e.dataTransfer.setData('toolbarItemType', type);
    };

    return (
        <div className="flex h-full overflow-hidden">
            <aside className="w-64 bg-sidebar border-r border-border p-4 flex-col space-y-4">
                <h2 className="text-lg font-bold">Blocks</h2>
                {toolbarItems.map(item => (
                    <div
                        key={item.type}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item.type)}
                        className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg cursor-grab hover:bg-card-hover transition-colors"
                    >
                        <item.icon className="w-6 h-6 text-accent" />
                        <span className="font-semibold">{item.label}</span>
                    </div>
                ))}
            </aside>
            <main
                ref={canvasRef}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="flex-1 relative overflow-hidden bg-[radial-gradient(#30363D_1px,transparent_1px)] [background-size:16px_16px]"
            >
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-background to-transparent h-24"></div>
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-text-primary">Workflow Editor</h1>
                    <p className="text-text-secondary">Drag blocks from the left panel to build your automation.</p>
                </div>
                {nodes.map(node => (
                    <DraggableNode key={node.id} node={node} onMove={handleNodeMove} />
                ))}
            </main>
        </div>
    );
};
