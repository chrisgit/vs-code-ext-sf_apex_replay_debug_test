import * as vscode from 'vscode';
import { provideLspApexTestCodelens } from './provideLspApexTestCodelens';

/**
 * CodelensProvider
 */
export class LspApexTestCodelensProvider implements vscode.CodeLensProvider {
  private onDidChangeCodeLensesEventEmitter = new vscode.EventEmitter<void>();
  public onDidChangeCodeLenses = this.onDidChangeCodeLensesEventEmitter.event;

  /**
   * Refresh code lenses
   */
  public refresh(): void {
    this.onDidChangeCodeLensesEventEmitter.fire();
  }

  /**
   * Invoked by VS Code to provide code lenses
   * @param document text document
   * @param token cancellation token
   */
  public async provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): Promise<vscode.CodeLens[]> {
    return provideLspApexTestCodelens(document, token);
  }
}

export const lspApexTestCodelensProvider = new LspApexTestCodelensProvider();

export function registerLspApexTestCodelensProvider(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerCodeLensProvider(
      {
        language: 'apex',
        pattern: '**/*.cls'
      },
      lspApexTestCodelensProvider
    )
  );
}
