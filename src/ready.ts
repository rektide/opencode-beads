import { z } from "zod";

export const readySchema = z.object({
	assignee: z.string().optional().describe("Filter by assignee"),
	label: z.array(z.string()).optional().describe("Filter by labels (AND: must have ALL)"),
	labelAny: z.array(z.string()).optional().describe("Filter by labels (OR: must have AT LEAST ONE)"),
	limit: z.number().int().positive().default(10).describe("Maximum issues to show"),
	priority: z.number().int().min(0).max(4).optional().describe("Filter by priority (0-4)"),
	sort: z.enum(["hybrid", "priority", "oldest"]).default("hybrid").describe("Sort policy"),
	unassigned: z.boolean().optional().describe("Show only unassigned issues"),
});

export type ReadyArgs = z.infer<typeof readySchema>;

export function parseReadyArgs(args: ReadyArgs): string[] {
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
	
	return params;
}