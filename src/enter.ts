import { tool } from '@opencode-ai/plugin';
import type { ToolContext } from '@opencode-ai/plugin';

interface EnterState {
  parent?: string;
  prefix?: string;
  [key: string]: any;
}

const sessionStates = new Map<string, EnterState>();

export const enterSchema = {
  parent: tool.schema.string().optional().describe('Parent issue ID to limit operations to'),
  prefix: tool.schema.string().optional().describe('ID prefix for auto-completion (e.g., "bd-", "gh-", "issue-")'),
};

export type EnterArgs = {
  parent?: string;
  prefix?: string;
};

export function parseEnterArgs(args: EnterArgs): string[] {
  const params = [];
  
  if (args.parent !== undefined) params.push('--parent', args.parent);
  if (args.prefix !== undefined) params.push('--prefix', args.prefix);
  
  return params;
}

export async function executeEnter(args: EnterArgs, context: ToolContext) {
  const state: EnterState = {};
  
  if (args.parent !== undefined) {
    state.parent = args.parent;
  }
  
  if (args.prefix !== undefined) {
    state.prefix = args.prefix;
  }
  
  sessionStates.set(context.sessionID, state);
  
  let message = `Entered session ${context.sessionID}`;
  if (args.parent) message += ` with parent limit: ${args.parent}`;
  if (args.prefix) message += ` with ID prefix: ${args.prefix}`;
  
  return message;
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

export function applyIdPrefix(prefix: string, id: string): string {
  // Don't prefix if already has a prefix or is external reference
  if (id.includes('-') || id.includes(':')) {
    return id;
  }
  return prefix + id;
}

export function applyPrefixToIds(prefix: string, ids: string[]): string[] {
  return ids.map(id => applyIdPrefix(prefix, id));
}

export function applyPrefixToDependencyString(prefix: string, deps: string): string {
  // Handle complex dependency formats like "discovered-from:bd-20,blocks:bd-15"
  return deps.split(',').map(dep => {
    if (dep.includes(':')) {
      const [type, id] = dep.split(':');
      return `${type}:${applyIdPrefix(prefix, id)}`;
    }
    return applyIdPrefix(prefix, dep);
  }).join(',');
}

export function applyPrefixToCommaSeparatedIds(prefix: string, ids: string): string {
  // Handle comma-separated ID lists like "123,456,789"
  return ids.split(',').map(id => applyIdPrefix(prefix, id.trim())).join(',');
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