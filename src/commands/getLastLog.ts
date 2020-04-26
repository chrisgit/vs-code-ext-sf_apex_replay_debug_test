const { spawn } = require('child_process');
import * as vscode from 'vscode';
import * as workspace from '../util/rootWorkspace';
import * as fs from 'fs';
import * as path from 'path';
import * as dateFormats from '../util/date/format';

async function execute(commandParameters: string[]): Promise<string> {
  let options = { cwd: vscode.workspace.rootPath, shell: true };
  let output: string = "";
  return new Promise((resolve, reject) => {
    console.log(`Execute: spawning ${JSON.stringify(commandParameters)} with options ${JSON.stringify(options)}`);
    let cp = spawn('sfdx', commandParameters, options);
    if (cp.stdout) {
      cp.stdout.on('data', (data: Buffer) => {
        output += data.toString();
      });
      cp.stdout.on('end', function () {
        console.log('Execute: finished collecting data chunks.');
      });
    } else {
      console.log('Execute: no cp.stdout');
    }
    cp.on('error', () => {
      reject(`sfdx ${commandParameters[0]} failed`);
    });
    cp.on('close', (code: number) => {
      code === 0 ? resolve(output) : reject(`sfdx ${commandParameters[0]} failed with exit code:- ${code}`);
    });
  });
};

async function getLastLogItem(): Promise<any> {
  try {
    let logItems: string = await execute(['force:apex:log:list', '--json']);
    const apexDebugLogObjects: any[] = JSON.parse(logItems).result;
    apexDebugLogObjects.sort((a, b) => {
      return (new Date(b.StartTime).valueOf() - new Date(a.StartTime).valueOf());
    });
    return Promise.resolve(apexDebugLogObjects[0]);
  } catch (e) {
    return Promise.reject(e);
  }
}

// sfdx force:apex:log:get will retrieve the last log
// however the VS Code extension retrieves a list of logs first and obtains the start time
export async function getLatestLog() {
  let lastApexLog = await getLastLogItem();
  let logId = lastApexLog.Id;
  let logStartTime = lastApexLog.StartTime;

  let logData: string = await execute(['force:apex:log:get', '--logid', logId, '--json']);
  let apexLog = JSON.parse(logData);

  if (apexLog.status === 0) {
    const logDir = path.join(workspace.getRootWorkspacePath(), '.sfdx', 'tools', 'debug', 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    let localUTCDate = new Date(logStartTime);
    let date = dateFormats.getYYYYMMddHHmmssDateFormat(localUTCDate);
    let logPath = path.join(logDir, `${logId}_${date}.log`);
    fs.writeFileSync(logPath, apexLog.result.log);
    const document = await vscode.workspace.openTextDocument(logPath);
    vscode.window.showTextDocument(document);
  }
}
