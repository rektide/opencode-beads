import { x } from "tinyexec";
import type { ToolContext } from "@opencode-ai/plugin";
import { tool } from "@opencode-ai/plugin";

// Schema for adding labels
export const labelAddSchema = {
	ids: tool.schema.array(tool.schema.string()).describe("Issue IDs to add label to"),
	label: tool.schema.string().describe("Label to add"),
};

// Schema for removing labels
export const labelRemoveSchema = {
	ids: tool.schema.array(tool.schema.string()).describe("Issue IDs to remove label from"),
	label: tool.schema.string().describe("Label to remove"),
};

// Schema for listing labels on an issue
export const labelListSchema = {
	issueId: tool.schema.string().describe("Issue ID to list labels for"),
};

// Schema for listing all unique labels
export const labelListAllSchema = {};

export type LabelAddArgs = {
	ids: string[];
	label: string;
};

export type LabelRemoveArgs = {
	ids: string[];
	label: string;
};

export type LabelListArgs = {
	issueId: string;
};

export type LabelListAllArgs = {};

export function parseLabelAddArgs(args: LabelAddArgs): string[] {
	return ["label", "add", ...args.ids, args.label];
}

export function parseLabelRemoveArgs(args: LabelRemoveArgs): string[] {
	return ["label", "remove", ...args.ids, args.label];
}

export function parseLabelListArgs(args: LabelListArgs): string[] {
	return ["label", "list", args.issueId];
}

export function parseLabelListAllArgs(args: LabelListAllArgs): string[] {
	return ["label", "list-all"];
}

export async function executeLabelAdd(args: LabelAddArgs, context: ToolContext) {
	const params = parseLabelAddArgs(args);
	
	const result = await x("bd", params);

	if (result.exitCode) {
		throw new Error(
			`bd failed when trying to add label`,
		);
	}

	return result.stdout;
}

export async function executeLabelRemove(args: LabelRemoveArgs, context: ToolContext) {
	const params = parseLabelRemoveArgs(args);
	
	const result = await x("bd", params);

	if (result.exitCode) {
		throw new Error(
			`bd failed when trying to remove label`,
		);
	}

	return result.stdout;
}

export async function executeLabelList(args: LabelListArgs, context: ToolContext) {
	const params = parseLabelListArgs(args);
	
	const result = await x("bd", params);

	if (result.exitCode) {
		throw new Error(
			`bd failed when trying to list labels`,
		);
	}

	return result.stdout;
}

export async function executeLabelListAll(args: LabelListAllArgs, context: ToolContext) {
	const params = parseLabelListAllArgs(args);
	
	const result = await x("bd", params);

	if (result.exitCode) {
		throw new Error(
			`bd failed when trying to list all labels`,
		);
	}

	return result.stdout;
}