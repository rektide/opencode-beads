import { x } from "tinyexec";
import type { ToolContext } from "@opencode-ai/plugin";
import { tool } from "@opencode-ai/plugin";

export const searchSchema = {
	query: tool.schema.string().optional().describe("Search query (search across title, description, and ID)"),
	assignee: tool.schema.string().optional().describe("Filter by assignee"),
	label: tool.schema.array(tool.schema.string()).optional().describe("Filter by labels (AND: must have ALL)"),
	labelAny: tool.schema.array(tool.schema.string()).optional().describe("Filter by labels (OR: must have AT LEAST ONE)"),
	status: tool.schema.enum(["open", "in_progress", "blocked", "closed"]).optional().describe("Filter by status"),
	type: tool.schema.enum(["bug", "feature", "task", "epic", "chore"]).optional().describe("Filter by type"),
	priorityMin: tool.schema.number().int().min(0).max(4).optional().describe("Filter by minimum priority (inclusive, 0-4)"),
	priorityMax: tool.schema.number().int().min(0).max(4).optional().describe("Filter by maximum priority (inclusive, 0-4)"),
	limit: tool.schema.number().int().positive().optional().describe("Limit results (default: 50)"),
	sort: tool.schema.enum(["priority", "created", "updated", "closed", "status", "id", "title", "type", "assignee"]).optional().describe("Sort by field"),
	reverse: tool.schema.boolean().optional().describe("Reverse sort order"),
	long: tool.schema.boolean().optional().describe("Show detailed multi-line output for each issue"),
	createdAfter: tool.schema.string().optional().describe("Filter issues created after date (YYYY-MM-DD or RFC3339)"),
	createdBefore: tool.schema.string().optional().describe("Filter issues created before date (YYYY-MM-DD or RFC3339)"),
	updatedAfter: tool.schema.string().optional().describe("Filter issues updated after date (YYYY-MM-DD or RFC3339)"),
	updatedBefore: tool.schema.string().optional().describe("Filter issues updated before date (YYYY-MM-DD or RFC3339)"),
	closedAfter: tool.schema.string().optional().describe("Filter issues closed after date (YYYY-MM-DD or RFC3339)"),
	closedBefore: tool.schema.string().optional().describe("Filter issues closed before date (YYYY-MM-DD or RFC3339)"),
};

export type SearchArgs = {
	query?: string;
	assignee?: string;
	label?: string[];
	labelAny?: string[];
	status?: "open" | "in_progress" | "blocked" | "closed";
	type?: "bug" | "feature" | "task" | "epic" | "chore";
	priorityMin?: number;
	priorityMax?: number;
	limit?: number;
	sort?: "priority" | "created" | "updated" | "closed" | "status" | "id" | "title" | "type" | "assignee";
	reverse?: boolean;
	long?: boolean;
	createdAfter?: string;
	createdBefore?: string;
	updatedAfter?: string;
	updatedBefore?: string;
	closedAfter?: string;
	closedBefore?: string;
};

export function parseSearchArgs(args: SearchArgs): string[] {
	const params = ["search"];
	
	// Add query as positional argument if provided
	if (args.query !== undefined) {
		params.push(args.query);
	}
	
	if (args.assignee !== undefined) params.push("--assignee", args.assignee);
	if (args.label !== undefined && args.label.length > 0) {
		args.label.forEach(l => params.push("--label", l));
	}
	if (args.labelAny !== undefined && args.labelAny.length > 0) {
		args.labelAny.forEach(l => params.push("--label-any", l));
	}
	if (args.status !== undefined) params.push("--status", args.status);
	if (args.type !== undefined) params.push("--type", args.type);
	if (args.priorityMin !== undefined) params.push("--priority-min", args.priorityMin.toString());
	if (args.priorityMax !== undefined) params.push("--priority-max", args.priorityMax.toString());
	if (args.limit !== undefined) params.push("--limit", args.limit.toString());
	if (args.sort !== undefined) params.push("--sort", args.sort);
	if (args.reverse !== undefined) params.push("--reverse");
	if (args.long !== undefined) params.push("--long");
	if (args.createdAfter !== undefined) params.push("--created-after", args.createdAfter);
	if (args.createdBefore !== undefined) params.push("--created-before", args.createdBefore);
	if (args.updatedAfter !== undefined) params.push("--updated-after", args.updatedAfter);
	if (args.updatedBefore !== undefined) params.push("--updated-before", args.updatedBefore);
	if (args.closedAfter !== undefined) params.push("--closed-after", args.closedAfter);
	if (args.closedBefore !== undefined) params.push("--closed-before", args.closedBefore);
	
	return params;
}

export async function executeSearch(args: SearchArgs, context: ToolContext) {
	const params = parseSearchArgs(args);
	
	const result = await x("bd", params);

	if (result.exitCode) {
		throw new Error(
			`bd failed when trying to search issues`,
		);
	}

	return result.stdout;
}