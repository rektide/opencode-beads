import { x } from "tinyexec";
import type { ToolContext } from "@opencode-ai/plugin";
import { tool } from "@opencode-ai/plugin";

export const listSchema = {
  all: tool.schema.boolean().optional().describe("Show all issues (default behavior; flag provided for CLI familiarity)"),
  assignee: tool.schema.string().optional().describe("Filter by assignee"),
  closedAfter: tool.schema.string().optional().describe("Filter issues closed after date (YYYY-MM-DD or RFC3339)"),
  closedBefore: tool.schema.string().optional().describe("Filter issues closed before date (YYYY-MM-DD or RFC3339)"),
  createdAfter: tool.schema.string().optional().describe("Filter issues created after date (YYYY-MM-DD or RFC3339)"),
  createdBefore: tool.schema.string().optional().describe("Filter issues created before date (YYYY-MM-DD or RFC3339)"),
  descContains: tool.schema.string().optional().describe("Filter by description substring (case-insensitive)"),
  emptyDescription: tool.schema.boolean().optional().describe("Filter issues with empty or missing description"),
  format: tool.schema.string().optional().describe("Output format: 'digraph' (for golang.org/x/tools/cmd/digraph), 'dot' (Graphviz), or Go template"),
  id: tool.schema.string().optional().describe("Filter by specific issue IDs (comma-separated, e.g., bd-1,bd-5,bd-10)"),
  label: tool.schema.array(tool.schema.string()).optional().describe("Filter by labels (AND: must have ALL). Can combine with --label-any"),
  labelAny: tool.schema.array(tool.schema.string()).optional().describe("Filter by labels (OR: must have AT LEAST ONE). Can combine with --label"),
  limit: tool.schema.number().int().positive().optional().describe("Limit results"),
  long: tool.schema.boolean().optional().describe("Show detailed multi-line output for each issue"),
  noAssignee: tool.schema.boolean().optional().describe("Filter issues with no assignee"),
  noLabels: tool.schema.boolean().optional().describe("Filter issues with no labels"),
  notesContains: tool.schema.string().optional().describe("Filter by notes substring (case-insensitive)"),
  priority: tool.schema.string().optional().describe("Priority (0-4 or P0-P4, 0=highest)"),
  priorityMax: tool.schema.string().optional().describe("Filter by maximum priority (inclusive, 0-4 or P0-P4)"),
  priorityMin: tool.schema.string().optional().describe("Filter by minimum priority (inclusive, 0-4 or P0-P4)"),
  reverse: tool.schema.boolean().optional().describe("Reverse sort order"),
  sort: tool.schema.enum(["priority", "created", "updated", "closed", "status", "id", "title", "type", "assignee"]).optional().describe("Sort by field"),
  status: tool.schema.enum(["open", "in_progress", "blocked", "closed"]).optional().describe("Filter by status"),
  title: tool.schema.string().optional().describe("Filter by title text (case-insensitive substring match)"),
  titleContains: tool.schema.string().optional().describe("Filter by title substring (case-insensitive)"),
  type: tool.schema.enum(["bug", "feature", "task", "epic", "chore"]).optional().describe("Filter by type"),
  updatedAfter: tool.schema.string().optional().describe("Filter issues updated after date (YYYY-MM-DD or RFC3339)"),
  updatedBefore: tool.schema.string().optional().describe("Filter issues updated before date (YYYY-MM-DD or RFC3339)"),
};

export type ListArgs = {
  all?: boolean;
  assignee?: string;
  closedAfter?: string;
  closedBefore?: string;
  createdAfter?: string;
  createdBefore?: string;
  descContains?: string;
  emptyDescription?: boolean;
  format?: string;
  id?: string;
  label?: string[];
  labelAny?: string[];
  limit?: number;
  long?: boolean;
  noAssignee?: boolean;
  noLabels?: boolean;
  notesContains?: string;
  priority?: string;
  priorityMax?: string;
  priorityMin?: string;
  reverse?: boolean;
  sort?: "priority" | "created" | "updated" | "closed" | "status" | "id" | "title" | "type" | "assignee";
  status?: "open" | "in_progress" | "blocked" | "closed";
  title?: string;
  titleContains?: string;
  type?: "bug" | "feature" | "task" | "epic" | "chore";
  updatedAfter?: string;
  updatedBefore?: string;
};

export function parseListArgs(args: ListArgs): string[] {
  const params = ["list"];

  if (args.all !== undefined) params.push("--all");
  if (args.assignee !== undefined) params.push("--assignee", args.assignee);
  if (args.closedAfter !== undefined) params.push("--closed-after", args.closedAfter);
  if (args.closedBefore !== undefined) params.push("--closed-before", args.closedBefore);
  if (args.createdAfter !== undefined) params.push("--created-after", args.createdAfter);
  if (args.createdBefore !== undefined) params.push("--created-before", args.createdBefore);
  if (args.descContains !== undefined) params.push("--desc-contains", args.descContains);
  if (args.emptyDescription !== undefined) params.push("--empty-description");
  if (args.format !== undefined) params.push("--format", args.format);
  if (args.id !== undefined) params.push("--id", args.id);
  if (args.label !== undefined && args.label.length > 0) {
    args.label.forEach((l) => params.push("--label", l));
  }
  if (args.labelAny !== undefined && args.labelAny.length > 0) {
    args.labelAny.forEach((l) => params.push("--label-any", l));
  }
  if (args.limit !== undefined) params.push("--limit", args.limit.toString());
  if (args.long !== undefined) params.push("--long");
  if (args.noAssignee !== undefined) params.push("--no-assignee");
  if (args.noLabels !== undefined) params.push("--no-labels");
  if (args.notesContains !== undefined) params.push("--notes-contains", args.notesContains);
  if (args.priority !== undefined) params.push("--priority", args.priority);
  if (args.priorityMax !== undefined) params.push("--priority-max", args.priorityMax);
  if (args.priorityMin !== undefined) params.push("--priority-min", args.priorityMin);
  if (args.reverse !== undefined) params.push("--reverse");
  if (args.sort !== undefined) params.push("--sort", args.sort);
  if (args.status !== undefined) params.push("--status", args.status);
  if (args.title !== undefined) params.push("--title", args.title);
  if (args.titleContains !== undefined) params.push("--title-contains", args.titleContains);
  if (args.type !== undefined) params.push("--type", args.type);
  if (args.updatedAfter !== undefined) params.push("--updated-after", args.updatedAfter);
  if (args.updatedBefore !== undefined) params.push("--updated-before", args.updatedBefore);

  return params;
}

export async function executeList(args: ListArgs, context: ToolContext) {
  const params = parseListArgs(args);

  // TODO: add `navState` filters for any filters not set by args
  const result = await x("bd", params);

  if (result.exitCode) {
    throw new Error(`bd failed when trying to list issues`);
  }

  return result.stdout;
}