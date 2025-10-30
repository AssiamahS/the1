import React from 'react';

export enum Agent {
  QWEN_DEV = 'QwenDev',
  CLAUDE_DESIGNER = 'ClaudeDesigner',
  UNASSIGNED = 'Unassigned',
}

export enum Status {
  BACKLOG = 'Backlog',
  IN_PROGRESS = 'In Progress',
  BLOCKED = 'Blocked',
  COMPLETED = 'Completed',
}

export interface Task {
  id: string;
  title: string;
  description: string;
  agent: Agent;
  status: Status;
  pinned: boolean;
  archived?: boolean;
}

export enum MessageSender {
  USER = 'user',
  AGENT = 'agent',
  SYSTEM = 'system',
}

export interface ChatMessage {
  sender: MessageSender;
  text: string;
  tasks?: Task[];
}

export interface Point {
  x: number;
  y: number;
}

export interface WorkflowNode {
  id: string;
  type: string;
  label: string;
  position: Point;
  // Fix: Replaced JSX.Element with React.ReactElement to resolve missing JSX namespace error.
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement;
}

export interface WorkflowConnection {
  from: string;
  to: string;
}

export interface StickyNote {
  id: string;
  content: string;
  position: Point;
  color: string;
}
