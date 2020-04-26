// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
//import { regexApexTestCodelensProvider } from './codelens/regexApexTestCodelensProvider';
import { registerLspApexTestCodelensProvider } from './codelens/lspApexTestCodelensProvider';
import { debugUnitTest } from './commands/debugUnitTest';

function registerCommands(extensionContext: vscode.ExtensionContext): vscode.Disposable {
  const debugTestCommand = vscode.commands.registerCommand('sfdx-apex-replay-debugger.helloWorld', debugUnitTest);
  vscode.window.showInformationMessage('Hello World from sfdx-apex-replay-debugger!');
  return vscode.Disposable.from(
    debugTestCommand
  );
}

// This method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

  registerLspApexTestCodelensProvider(context);

  vscode.commands.registerCommand("apex-debug-codelens.enableCodeLens", () => {
    vscode.workspace.getConfiguration("apex-debug-codelens").update("enableCodeLens", true, true);
  });

  vscode.commands.registerCommand("apex-debug-codelens.disableCodeLens", () => {
    vscode.workspace.getConfiguration("apex-debug-codelens").update("enableCodeLens", false, true);
  });

  vscode.commands.registerCommand("apex-debug-codelens.codelensAction", (args) => {
    vscode.window.showInformationMessage(`CodeLens action clicked with args=${args}`);
  });

  const commands = registerCommands(context);
  context.subscriptions.push(commands);

  console.log('Congratulations, your extension "sfdx-apex-replay-debugger" is now active!');
}

// this method is called when your extension is deactivated
export function deactivate() { }
