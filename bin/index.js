#! /usr/bin/env node 
import inquirer from 'inquirer';
import { execSync } from 'child_process';
import { readFile, readdir } from 'fs/promises';
const { instructorRepo, studentRepo, remoteBranch } = JSON.parse(
  await readFile(
    new URL('../config.json', import.meta.url)
  )
);

function log(input) {
  console.log(`>_ ${input}`);
}

log(">_ This CLI tool copies over a unit from the instructor repo to the student repo, without Solved or Main folders, commits and pushes the changes to the student repo remote origin. Instructor and student repos should already exist and paths should be added to the config.json file. Remote name and branch name should also be added to config.json.");

inquirer
  .prompt([
    {
      type: 'number',
      name: 'unit',
      message: 'Which unit would you like to setup?'
    }
  ])
  .then(async ({ unit }) => {

    log("Copying over entire unit..");

    const prefix = unit < 10 ? `0${unit}` : `${unit}`;

    const instructorDirs = await readdir(`${instructorRepo}/01-Class-Content`);

    const unitName = instructorDirs.filter(dir => dir[0] === prefix[0] && dir[1] === prefix[1])[0];

    try {
      execSync(`cp -r ${instructorRepo}/01-Class-Content/${unitName} ${studentRepo}`);

      log("Copied over entire unit..");
      log("Removing Solved folders..");

      execSync(`find ${studentRepo}/${unitName} -name 'Solved' -type d -prune -exec rm -rf '{}' +`);
  
      log("Removed Solved folders..");
      log("Removing Main folders..");

      execSync(`find ${studentRepo}/${unitName} -name 'Main' -type d -prune -exec rm -rf '{}' +`);

      log("Removed Main folders..");
      log("git adding all..");

      execSync(`cd ${studentRepo} && git add -A`);

      log("git commiting with message..");

      execSync(`cd ${studentRepo} && git commit -m "adds unit ${unitName} sans Solved and Main directories"`);

      log("git pushing")

      execSync(`cd ${studentRepo} && git push ${remoteBranch}`);

      log("Completed.")
      
    } catch(err) {
      if (err) {
        console.error(`error: ${err.message}`);
        return;
      }
    }

  });