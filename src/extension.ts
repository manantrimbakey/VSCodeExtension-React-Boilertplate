// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import WebviewManager from "./webView";
import { startServer } from "./expressServer";
import { logger } from "./utils/logger";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	let port = 4000;
	logger.info('Extension "salesforce-debug-logs-viewer" is now active!');
	
	try {
		port = await startServer(port);
		logger.info("Server started on port", { port });
	} catch (error) {
		logger.error("Failed to start server", error);
		return;
	}

	const webviewManager = WebviewManager.getInstance(context.extensionUri);

	let disposable = vscode.commands.registerCommand("salesforce-debug-logs-viewer.openWebview", () => {
		logger.debug("Opening webview");
		webviewManager.showWebview({ port });
	});

	context.subscriptions.push(disposable);
	
	// Add logger disposal to subscriptions
	context.subscriptions.push({
		dispose: () => {
			logger.dispose();
		}
	});
}

// This method is called when your extension is deactivated
export function deactivate() {
	logger.info("Extension is being deactivated");
}
