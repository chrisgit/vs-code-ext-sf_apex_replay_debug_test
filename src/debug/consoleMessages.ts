import * as vscode from 'vscode';

export function showDebugState() {
  console.log(`Active debug session ${vscode.debug.activeDebugSession}`);
  console.log(`Workspace folders ${vscode.workspace.workspaceFolders}`);
  console.log(`WorkspaceFolders[0] ${vscode.workspace.workspaceFolders![0]}`);
}
