import type { Plugin, ToolContext } from "@opencode-ai/plugin";
import { tool } from "@opencode-ai/plugin";
import { x } from "tinyexec";
import { z } from "zod";

interface NavState {
	parentId: string;
	ancestorIds: Iterator<string>;
}

export const BeadsPlugin: Plugin = async (ctx) => {
	// TODO: create an epic for navState handling. learn how to use/beg OpenCode storage for holding state information, if at all possible.
	const navState: Record<string, NavState> = {};

	return {
		tool: {
			explore: tool({
				description: "Explore how plugin integration works in opencode",
				args: {},
				async execute(args, context: ToolContext) {
					const { agent, sessionID, messageID } = context;
					return `Agent: ${agent}, Session: ${sessionID}, Message: ${messageID}`;
				},
			}),

			ready: tool({
				description: "List ready tasks",
				args: z.object({
					assignee: z.string().optional().describe("Filter by assignee"),
					label: z.array(z.string()).optional().describe("Filter by labels (AND: must have ALL)"),
					labelAny: z.array(z.string()).optional().describe("Filter by labels (OR: must have AT LEAST ONE)"),
					limit: z.number().int().positive().default(10).describe("Maximum issues to show"),
					priority: z.number().int().min(0).max(4).optional().describe("Filter by priority (0-4)"),
					sort: z.enum(["hybrid", "priority", "oldest"]).default("hybrid").describe("Sort policy"),
					unassigned: z.boolean().optional().describe("Show only unassigned issues"),
				}),
				async execute(args, context: ToolContext) {
					const params = ["ready"];
					
					if (args.assignee) params.push("--assignee", args.assignee);
					if (args.label && args.label.length > 0) {
						args.label.forEach(l => params.push("--label", l));
					}
					if (args.labelAny && args.labelAny.length > 0) {
						args.labelAny.forEach(l => params.push("--label-any", l));
					}
					if (args.limit !== 10) params.push("--limit", args.limit.toString());
					if (args.priority !== undefined) params.push("--priority", args.priority.toString());
					if (args.sort !== "hybrid") params.push("--sort", args.sort);
					if (args.unassigned) params.push("--unassigned");
					
					// TODO: add `navState` filters for any filters not set by args
					const result = await x("bd", params);

					if (result.exitCode) {
						throw new Error(
							`bd failed when trying to get a list of ready tasks`,
						);
					}

					return result.stdout;
				},
			}),

			create_task: tool({
				description: "Create a new epic",
				args: {
					// TODO: zod schema for all options available to `bd create` issue creation.
				},
				async execute(args: Record<string, never>, context: ToolContext) {
					const params = ["ready"];
					// TODO: add all filters from args as parameters here
					// TODO: look at `navState` and set our parent id to the parent id there
					const result = await x("bd", params);

					if (result.exitCode) {
						throw new Error(
							`bd failed when trying to get a list of ready tasks`,
						);
					}

					// TODO: the stdout should include the new task id. set the navState task id to
					return result.stdout;
				},
			}),
			// TODO: add `list` tool.

			// TODO add a "load_todos" tool to load all tasks in the current nav into OpenCode todos
		},
	};
};
