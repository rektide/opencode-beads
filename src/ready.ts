import { x } from "tinyexec";
import type { ToolContext } from "@opencode-ai/plugin";
import { tool } from "@opencode-ai/plugin";

export const readySchema = {
	assignee: tool.schema.string().optional().describe("Filter by assignee"),
	label: tool.schema
		.array(tool.schema.string())
		.optional()
		.describe("Filter by labels (AND: must have ALL)"),
	labelAny: tool.schema
		.array(tool.schema.string())
		.optional()
		.describe("Filter by labels (OR: must have AT LEAST ONE)"),
	limit: tool.schema
		.number()
		.int()
		.positive()
		.optional()
		.describe("Maximum issues to show"),
	priority: tool.schema
		.number()
		.int()
		.min(0)
		.max(4)
		.optional()
		.describe("Filter by priority (0-4)"),
	sort: tool.schema
		.enum(["hybrid", "priority", "oldest"])
		.optional()
		.describe("Sort policy"),
	unassigned: tool.schema
		.boolean()
		.optional()
		.describe("Show only unassigned issues"),
};

export type ReadyArgs = {
	assignee?: string;
	label?: string[];
	labelAny?: string[];
	limit?: number;
	priority?: number;
	sort?: "hybrid" | "priority" | "oldest";
	unassigned?: boolean;
};

export function parseReadyArgs(args: ReadyArgs): string[] {
	const params = ["ready"];

	if (args.assignee !== undefined) params.push("--assignee", args.assignee);
	if (args.label !== undefined && args.label.length > 0) {
		args.label.forEach((l) => params.push("--label", l));
	}
	if (args.labelAny !== undefined && args.labelAny.length > 0) {
		args.labelAny.forEach((l) => params.push("--label-any", l));
	}
	if (args.limit !== undefined) params.push("--limit", args.limit.toString());
	if (args.priority !== undefined) {
		params.push("--priority", args.priority.toString());
	}
	if (args.sort !== undefined) params.push("--sort", args.sort);
	if (args.unassigned !== undefined) params.push("--unassigned");

	return params;
}

export async function executeReady(args: ReadyArgs, context: ToolContext) {
	const params = parseReadyArgs(args);

	// TODO: add `navState` filters for any filters not set by args
	const result = await x("bd", params);

	if (result.exitCode) {
		throw new Error(`bd failed when trying to get a list of ready tasks`);
	}

	return result.stdout;
}

