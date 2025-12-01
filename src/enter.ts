import { tool } from '@opencode-ai/plugin';
import type { ToolContext } from '@opencode-ai/plugin';

interface EnterState {
  parent?: string;
  [key: string]: any;
}

const sessionStates = new Map<string, EnterState>();

export const enterSchema = {
  parent: tool.schema.string().optional().describe('Parent issue ID to limit operations to'),
};

export type EnterArgs = {
  parent?: string;
};

export function parseEnterArgs(args: EnterArgs): string[] {
  const params = [];
  
  if (args.parent !== undefined) params.push('--parent', args.parent);
  
  return params;
}

export async function executeEnter(args: EnterArgs, context: ToolContext) {
  const state: EnterState = {};
  
  if (args.parent !== undefined) {
    state.parent = args.parent;
  }
  
  sessionStates.set(context.sessionID, state);
  
  return `Entered session ${context.sessionID}${args.parent ? ` with parent limit: ${args.parent}` : ''}`;
}

export const leaveSchema = {};

export type LeaveArgs = {};

export async function executeLeave(args: LeaveArgs, context: ToolContext) {
  const state = sessionStates.get(context.sessionID);
  
  if (!state) {
    throw new Error(`Session ${context.sessionID} not found`);
  }
  
  sessionStates.delete(context.sessionID);
  
  return `Left session ${context.sessionID}`;
}

export function getSessionState(sessionId: string): EnterState | undefined {
  return sessionStates.get(sessionId);
}

export function getCurrentSessionState(context: ToolContext): EnterState | undefined {
  return sessionStates.get(context.sessionID);
}

export function applySessionLimits(sessionId: string, args: string[]): string[] {
  const state = sessionStates.get(sessionId);
  if (!state) {
    return args;
  }
  
  const modifiedArgs = [...args];
  
  if (state.parent && !args.includes('--parent')) {
    modifiedArgs.push('--parent', state.parent);
  }
  
  return modifiedArgs;
}