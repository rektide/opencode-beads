import { x } from "tinyexec";
import type { ToolContext } from "@opencode-ai/plugin";
import { tool } from "@opencode-ai/plugin";

export const epicStatusSchema = {
	eligibleOnly: tool.schema.boolean().optional().describe("Show only epics eligible for closure"),
};

export type EpicStatusArgs = {
	eligibleOnly?: boolean;
};

export function parseEpicStatusArgs(args: EpicStatusArgs): string[] {
	const params = ["epic", "status"];
	
	if (args.eligibleOnly !== undefined) params.push("--eligible-only");
	
	return params;
}

export async function executeEpicStatus(args: EpicStatusArgs, context: ToolContext) {
	const params = parseEpicStatusArgs(args);
	
	const result = await x("bd", params);

	if (result.exitCode) {
		throw new Error(
			`bd failed when trying to get epic status`,
		);
	}

	return result.stdout;
}