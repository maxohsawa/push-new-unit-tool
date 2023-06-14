#! /usr/bin/env node 
import inquirer from 'inquirer';
import { execSync } from 'child_process';
import { readFile, readdir } from 'fs/promises';
const { instructorRepo, studentRepo } = JSON.parse(
  await readFile(
    new URL('../directories.json', import.meta.url)
  )
);

function log(input) {
  console.log(`>_ ${input}`);
}

log(">_ This CLI tool copies over a unit from the instructor repo to the student repo, without Solved or Main folders, commits and pushes the changes to the student repo remote origin. Instructor and student repos should already exist and paths should be added to the directories.json file.");

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
      
    } catch(err) {
      if (error) {
        console.error(`error: ${error.message}`);
        return;
      }
    }
    


  });