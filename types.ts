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
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
}
