import { x } from "tinyexec";
import type { ToolContext } from "@opencode-ai/plugin";
import { tool } from "@opencode-ai/plugin";

export const createSchema = {
	title: tool.schema.string().describe("Title of the issue"),
	type: tool.schema.enum(["bug", "feature", "task", "epic", "chore"]).optional().describe("Type of issue"),
	priority: tool.schema.number().int().min(0).max(4).optional().describe("Priority (0-4)"),
	parent: tool.schema.string().optional().describe("Parent issue ID for hierarchical child (e.g., 'bd-a3f8e9')"),
	deps: tool.schema.array(tool.schema.string()).optional().describe("Dependencies in format 'type:id' or 'id' (e.g., 'discovered-from:bd-20,blocks:bd-15' or 'bd-20')"),
	assignee: tool.schema.string().optional().describe("Assignee username"),
	label: tool.schema.array(tool.schema.string()).optional().describe("Labels to add"),
	description: tool.schema.string().optional().describe("Issue description"),
	acceptance: tool.schema.string().optional().describe("Acceptance criteria"),
	design: tool.schema.string().optional().describe("Design notes"),
	externalRef: tool.schema.string().optional().describe("External reference (e.g., 'gh-9', 'jira-ABC')"),
	file: tool.schema.string().optional().describe("Create multiple issues from markdown file"),
	force: tool.schema.boolean().optional().describe("Force creation even if prefix doesn't match database prefix"),
	fromTemplate: tool.schema.string().optional().describe("Create issue from template (e.g., 'epic', 'bug', 'feature')"),
	id: tool.schema.string().optional().describe("Explicit issue ID (e.g., 'bd-42' for partitioning)"),
	repo: tool.schema.string().optional().describe("Target repository for issue (overrides auto-routing)"),
};

export type CreateArgs = {
	title: string;
	type?: "bug" | "feature" | "task" | "epic" | "chore";
	priority?: number;
	parent?: string;
	deps?: string[];
	assignee?: string;
	label?: string[];
	description?: string;
	acceptance?: string;
	design?: string;
	externalRef?: string;
	file?: string;
	force?: boolean;
	fromTemplate?: string;
	id?: string;
	repo?: string;
};

export function parseCreateArgs(args: CreateArgs): string[] {
	const params = ["create", args.title];
	
	if (args.type !== undefined) params.push("--type", args.type);
	if (args.priority !== undefined) params.push("--priority", args.priority.toString());
	if (args.parent !== undefined) params.push("--parent", args.parent);
	if (args.deps !== undefined && args.deps.length > 0) {
		args.deps.forEach(d => params.push("--deps", d));
	}
	if (args.assignee !== undefined) params.push("--assignee", args.assignee);
	if (args.label !== undefined && args.label.length > 0) {
		args.label.forEach(l => params.push("--label", l));
	}
	if (args.description !== undefined) params.push("--description", args.description);
	if (args.acceptance !== undefined) params.push("--acceptance", args.acceptance);
	if (args.design !== undefined) params.push("--design", args.design);
	if (args.externalRef !== undefined) params.push("--external-ref", args.externalRef);
	if (args.file !== undefined) params.push("--file", args.file);
	if (args.force !== undefined) params.push("--force");
	if (args.fromTemplate !== undefined) params.push("--from-template", args.fromTemplate);
	if (args.id !== undefined) params.push("--id", args.id);
	if (args.repo !== undefined) params.push("--repo", args.repo);
	
	return params;
}

export async function executeCreate(args: CreateArgs, context: ToolContext) {
	const params = parseCreateArgs(args);
	
	const result = await x("bd", params);

	if (result.exitCode) {
		throw new Error(
			`bd failed when trying to create issue`,
		);
	}

	return result.stdout;
}