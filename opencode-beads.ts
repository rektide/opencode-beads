import type { Plugin, ToolContext } from "@opencode-ai/plugin";
import { tool } from "@opencode-ai/plugin";
import { x } from "tinyexec";
import { readySchema, parseReadyArgs } from "./src/ready.js";

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
				args: readySchema,
				execute: executeReady,
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
