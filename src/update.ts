import { x } from "tinyexec";
import type { ToolContext } from "@opencode-ai/plugin";
import { tool } from "@opencode-ai/plugin";

export const updateSchema = {
	ids: tool.schema.array(tool.schema.string()).describe("Issue IDs to update"),
	title: tool.schema.string().optional().describe("New title"),
	status: tool.schema.string().optional().describe("New status"),
	priority: tool.schema.number().int().min(0).max(4).optional().describe("Priority (0-4)"),
	assignee: tool.schema.string().optional().describe("Assignee"),
	description: tool.schema.string().optional().describe("Issue description"),
	acceptance: tool.schema.string().optional().describe("Acceptance criteria"),
	design: tool.schema.string().optional().describe("Design notes"),
	externalRef: tool.schema.string().optional().describe("External reference (e.g., 'gh-9', 'jira-ABC')"),
	notes: tool.schema.string().optional().describe("Additional notes"),
	addLabel: tool.schema.array(tool.schema.string()).optional().describe("Add labels (repeatable)"),
	removeLabel: tool.schema.array(tool.schema.string()).optional().describe("Remove labels (repeatable)"),
	setLabels: tool.schema.array(tool.schema.string()).optional().describe("Set labels, replacing all existing (repeatable)"),
};

export type UpdateArgs = {
	ids: string[];
	title?: string;
	status?: string;
	priority?: number;
	assignee?: string;
	description?: string;
	acceptance?: string;
	design?: string;
	externalRef?: string;
	notes?: string;
	addLabel?: string[];
	removeLabel?: string[];
	setLabels?: string[];
};

export function parseUpdateArgs(args: UpdateArgs): string[] {
	const params = ["update", ...args.ids];
	
	if (args.title !== undefined) params.push("--title", args.title);
	if (args.status !== undefined) params.push("--status", args.status);
	if (args.priority !== undefined) params.push("--priority", args.priority.toString());
	if (args.assignee !== undefined) params.push("--assignee", args.assignee);
	if (args.description !== undefined) params.push("--description", args.description);
	if (args.acceptance !== undefined) params.push("--acceptance", args.acceptance);
	if (args.design !== undefined) params.push("--design", args.design);
	if (args.externalRef !== undefined) params.push("--external-ref", args.externalRef);
	if (args.notes !== undefined) params.push("--notes", args.notes);
	if (args.addLabel !== undefined && args.addLabel.length > 0) {
		args.addLabel.forEach(l => params.push("--add-label", l));
	}
	if (args.removeLabel !== undefined && args.removeLabel.length > 0) {
		args.removeLabel.forEach(l => params.push("--remove-label", l));
	}
	if (args.setLabels !== undefined && args.setLabels.length > 0) {
		args.setLabels.forEach(l => params.push("--set-labels", l));
	}
	
	return params;
}

export async function executeUpdate(args: UpdateArgs, context: ToolContext) {
	const params = parseUpdateArgs(args);
	
	const result = await x("bd", params);

	if (result.exitCode) {
		throw new Error(
			`bd failed when trying to update issues`,
		);
	}

	return result.stdout;
}