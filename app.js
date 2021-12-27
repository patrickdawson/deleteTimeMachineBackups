#!/usr/bin/env node

const process = require('process');
const sh = require('shelljs');
const inquirer = require('inquirer');
const { program } = require('commander');
const { version } = require('./package.json');

async function getExistingBackups() {
  const { stdout } = sh.exec('tmutil listbackups', { silent: true });
  const backups = stdout
    .split('\n')
    .filter((e) => e !== '')
    .map((e) => e.replace('.backup', ''));

  const answers = await inquirer.prompt([
    {
      name: 'backupsToDelete',
      type: 'checkbox',
      message: 'Select backups to delete',
      choices: backups,
    },
  ]);

  return answers.backupsToDelete;
}

async function getBackupMountPoint() {
  const cmd = 'tmutil destinationinfo';
  const { stdout } = sh.exec(cmd, { silent: true });
  const destInfo = stdout
    .split('\n')
    .filter((e) => e.startsWith('Mount Point'));

  if (destInfo.length !== 1) {
    throw new Error(`Mount Point not found with cmd: ${cmd}`);
  }
  const mountPointInfo = destInfo[0].split(':');
  if (mountPointInfo.length !== 2) {
    throw new Error(`Failed to extract mount point from: ${mountPointInfo}`);
  }
  return mountPointInfo[1].trim();
}

async function main() {
  program.version(version);
  program.option(
    '-d, --dryRun',
    "Don't delete anything. Only output delete commands"
  );

  program.parse(process.argv);

  const backups = await getExistingBackups();
  const backupMountPoint = await getBackupMountPoint();

  for (const backup of backups) {
    const cmd = `sudo tmutil delete -d '${backupMountPoint}' -t ${backup}`;
    if (program.opts().dryRun) {
      console.log(cmd);
    } else {
      console.log(`Deleting backup: ${backup}`);
      sh.exec(cmd);
    }
  }
}

main().catch((e) => console.error(e));
