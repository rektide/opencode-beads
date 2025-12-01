import type { Plugin, ToolContext } from "@opencode-ai/plugin";
import { tool } from "@opencode-ai/plugin";
import { x } from "tinyexec";
import { readySchema, executeReady } from "./src/ready.js";
import { createSchema, executeCreate } from "./src/create.js";
import { updateSchema, executeUpdate } from "./src/update.js";
import { searchSchema, executeSearch } from "./src/search.js";
import { closeSchema, executeClose } from "./src/close.js";
import { deleteSchema, executeDelete } from "./src/delete.js";
import { epicStatusSchema, executeEpicStatus } from "./src/epic.js";
import { commentsViewSchema, commentsAddSchema, executeCommentsView, executeCommentsAdd } from "./src/comments.js";
import { labelAddSchema, labelRemoveSchema, labelListSchema, labelListAllSchema, executeLabelAdd, executeLabelRemove, executeLabelList, executeLabelListAll } from "./src/label.js";
import { enterSchema, executeEnter, leaveSchema, executeLeave } from "./src/enter.js";
import { listSchema, executeList } from "./src/list.js";

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
				description: "Create a new issue (epic, task, bug, etc.)",
				args: createSchema,
				execute: executeCreate,
			}),

			update_task: tool({
				description: "Update one or more issues",
				args: updateSchema,
				execute: executeUpdate,
			}),

			search_issues: tool({
				description: "Search issues by text query with optional filters",
				args: searchSchema,
				execute: executeSearch,
			}),

			close_issues: tool({
				description: "Close one or more issues",
				args: closeSchema,
				execute: executeClose,
			}),

			delete_issues: tool({
				description: "Delete one or more issues and clean up references",
				args: deleteSchema,
				execute: executeDelete,
			}),

			epic_status: tool({
				description: "Show epic completion status",
				args: epicStatusSchema,
				execute: executeEpicStatus,
			}),

			view_comments: tool({
				description: "View comments on an issue",
				args: commentsViewSchema,
				execute: executeCommentsView,
			}),

			add_comment: tool({
				description: "Add a comment to an issue",
				args: commentsAddSchema,
				execute: executeCommentsAdd,
			}),

			add_label: tool({
				description: "Add a label to one or more issues",
				args: labelAddSchema,
				execute: executeLabelAdd,
			}),

			remove_label: tool({
				description: "Remove a label from one or more issues",
				args: labelRemoveSchema,
				execute: executeLabelRemove,
			}),

			list_labels: tool({
				description: "List labels for an issue",
				args: labelListSchema,
				execute: executeLabelList,
			}),

			list_all_labels: tool({
				description: "List all unique labels in the database",
				args: labelListAllSchema,
				execute: executeLabelListAll,
			}),

			enter_session: tool({
				description: "Enter a session with specific limits (e.g., parent ID) that will be applied to subsequent bd commands",
				args: enterSchema,
				execute: executeEnter,
			}),

			leave_session: tool({
				description: "Leave a session and remove its limits",
				args: leaveSchema,
				execute: executeLeave,
			}),

			list_issues: tool({
				description: "List issues with comprehensive filtering and sorting options",
				args: listSchema,
				execute: executeList,
			}),

			// TODO add a "load_todos" tool to load all tasks in the current nav into OpenCode todos
		},
	};
};
