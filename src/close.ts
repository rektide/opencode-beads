import { x } from "tinyexec";
import type { ToolContext } from "@opencode-ai/plugin";
import { tool } from "@opencode-ai/plugin";

export const closeSchema = {
	ids: tool.schema.array(tool.schema.string()).describe("Issue IDs to close"),
	reason: tool.schema.string().optional().describe("Reason for closing"),
};

export type CloseArgs = {
	ids: string[];
	reason?: string;
};

export function parseCloseArgs(args: CloseArgs): string[] {
	const params = ["close", ...args.ids];
	
	if (args.reason !== undefined) params.push("--reason", args.reason);
	
	return params;
}

export async function executeClose(args: CloseArgs, context: ToolContext) {
	const params = parseCloseArgs(args);
	
	const result = await x("bd", params);

	if (result.exitCode) {
		throw new Error(
			`bd failed when trying to close issues`,
		);
	}

	return result.stdout;
}