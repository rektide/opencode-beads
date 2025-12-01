import { x } from "tinyexec";
import type { ToolContext } from "@opencode-ai/plugin";
import { tool } from "@opencode-ai/plugin";

// Schema for viewing comments
export const commentsViewSchema = {
	issueId: tool.schema.string().describe("Issue ID to view comments for"),
};

export type CommentsViewArgs = {
	issueId: string;
};

// Schema for adding comments
export const commentsAddSchema = {
	issueId: tool.schema.string().describe("Issue ID to add comment to"),
	text: tool.schema.string().optional().describe("Comment text"),
	file: tool.schema.string().optional().describe("Read comment text from file"),
	author: tool.schema.string().optional().describe("Add author to comment"),
};

export type CommentsAddArgs = {
	issueId: string;
	text?: string;
	file?: string;
	author?: string;
};

export function parseCommentsViewArgs(args: CommentsViewArgs): string[] {
	return ["comments", args.issueId];
}

export function parseCommentsAddArgs(args: CommentsAddArgs): string[] {
	const params = ["comments", "add", args.issueId];
	
	if (args.text !== undefined) {
		params.push(args.text);
	}
	if (args.file !== undefined) params.push("--file", args.file);
	if (args.author !== undefined) params.push("--author", args.author);
	
	return params;
}

export async function executeCommentsView(args: CommentsViewArgs, context: ToolContext) {
	const params = parseCommentsViewArgs(args);
	
	const result = await x("bd", params);

	if (result.exitCode) {
		throw new Error(
			`bd failed when trying to view comments`,
		);
	}

	return result.stdout;
}

export async function executeCommentsAdd(args: CommentsAddArgs, context: ToolContext) {
	const params = parseCommentsAddArgs(args);
	
	const result = await x("bd", params);

	if (result.exitCode) {
		throw new Error(
			`bd failed when trying to add comment`,
		);
	}

	return result.stdout;
}