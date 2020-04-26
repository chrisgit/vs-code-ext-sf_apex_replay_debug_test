import * as vscode from 'vscode';
import * as path from 'path';

type ApexTestMethod = {
  methodName: string;
  definingType: string;
  location: vscode.Location;
};

export async function provideLspApexTestCodelens(document: vscode.TextDocument, token: vscode.CancellationToken): Promise<vscode.CodeLens[]> {
  if (!vscode.workspace.getConfiguration("apex-debug-codelens").get("enableCodeLens", true)) {
    return [];
  };

  let sfdxApex = vscode.extensions.getExtension('salesforce.salesforcedx-vscode-apex');
  if (sfdxApex === undefined || !sfdxApex.isActive) {
    return [];
  };

  let exportedApi = sfdxApex.exports;
  if (exportedApi.languageClientUtils.getStatus().isReady() === false) {
    return [];
  }

  //return new Promise<vscode.CodeLens>();
  let codeLens: vscode.CodeLens[] = [];

  // Otherwise ... await but access ApexTestMethod ...
  let allTests: ApexTestMethod[] = await exportedApi.getApexTests();
  if (allTests.length === 0) {
    return [];
  }

  let documentFilename = path.basename(document.fileName);
  let documentTests = allTests.filter(test => path.basename(test.location.uri.path) === documentFilename);
  documentTests.forEach((apexTest) => {
    const range = new vscode.Range(
      new vscode.Position(apexTest.location.range.start.line, apexTest.location.range.start.character),
      new vscode.Position(apexTest.location.range.end.line, apexTest.location.range.end.character)
    );
    let fullTestName = `${apexTest.definingType}.${apexTest.methodName}`;
    const runTestCaseCommand: vscode.Command = {
      command: 'sfdx-apex-replay-debugger.helloWorld', // Was: sfdx.force.apex.test.method.run
      title: 'Debug Test',
      tooltip: `Debug the unit test ${apexTest.methodName}`,
      arguments: [fullTestName]
    };
    codeLens.push(new vscode.CodeLens(range, runTestCaseCommand));
  });

  return codeLens;
}
