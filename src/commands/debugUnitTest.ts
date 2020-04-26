import * as vscode from 'vscode';

function resolveAfterXSeconds(wait: number) {
  return new Promise(resolve => {
    setTimeout(() => { resolve('resolved'); }, wait * 1000);
  });
}

import * as apex from './getLastLog';

export async function debugUnitTest(testMethod: string) {
  await vscode.commands.executeCommand('sfdx.create.checkpoints');
  await vscode.commands.executeCommand('sfdx.force.start.apex.debug.logging');
  await vscode.commands.executeCommand('sfdx.force.apex.test.method.run', testMethod);

  await resolveAfterXSeconds(10);

  // The command below will prompt for a log file ... default behavior
  //    await vscode.commands.executeCommand('sfdx.force.apex.log.get');

  // The command below will get the latest log file
  await apex.getLatestLog();

  await resolveAfterXSeconds(3);

  await vscode.commands.executeCommand('sfdx.launch.replay.debugger.logfile');

  console.log('Done here ...');
}
