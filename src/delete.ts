import { x } from "tinyexec";
import type { ToolContext } from "@opencode-ai/plugin";
import { tool } from "@opencode-ai/plugin";

export const deleteSchema = {
	ids: tool.schema.array(tool.schema.string()).optional().describe("Issue IDs to delete"),
	fromFile: tool.schema.string().optional().describe("Read issue IDs from file (one per line)"),
	force: tool.schema.boolean().optional().describe("Actually delete (without this flag, shows preview)"),
	cascade: tool.schema.boolean().optional().describe("Recursively delete all dependent issues"),
	dryRun: tool.schema.boolean().optional().describe("Preview what would be deleted without making changes"),
};

export type DeleteArgs = {
	ids?: string[];
	fromFile?: string;
	force?: boolean;
	cascade?: boolean;
	dryRun?: boolean;
};

export function parseDeleteArgs(args: DeleteArgs): string[] {
	const params = ["delete"];
	
	// Add IDs if provided
	if (args.ids !== undefined && args.ids.length > 0) {
		params.push(...args.ids);
	}
	
	if (args.fromFile !== undefined) params.push("--from-file", args.fromFile);
	if (args.force !== undefined) params.push("--force");
	if (args.cascade !== undefined) params.push("--cascade");
	if (args.dryRun !== undefined) params.push("--dry-run");
	
	return params;
}

export async function executeDelete(args: DeleteArgs, context: ToolContext) {
	const params = parseDeleteArgs(args);
	
	const result = await x("bd", params);

	if (result.exitCode) {
		throw new Error(
			`bd failed when trying to delete issues`,
		);
	}

	return result.stdout;
}