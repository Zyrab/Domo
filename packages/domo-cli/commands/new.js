import fs from 'fs';

import path from 'path';
import ora from 'ora';
import chalk from 'chalk';
import { execa } from 'execa';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runNew(projectName) {
    const projectPath = path.resolve(process.cwd(), projectName);
    const templatePath = path.join(__dirname, '../templates/project'); // <--- FIX HERE


    const spinner = ora(`Creating new Domo project: ${projectName}`).start();

    try {
        copyTemplate(templatePath, projectPath, { APP_NAME: projectName });
        spinner.succeed(chalk.green(`Project ${projectName} created!`));

        // Run npm install
        console.log(chalk.cyan(`\nInstalling dependencies...`));
        await execa('npm', ['install'], { cwd: projectPath, stdio: 'inherit' });

        console.log(chalk.green(`\nProject ${projectName} is ready!`));
        console.log(chalk.cyan(`\ncd ${projectName}`));
        console.log(chalk.cyan(`npm run dev`));
    } catch (err) {
        spinner.fail(chalk.red('Failed to create project.'));
        console.error(err);
    }
}


function copyTemplate(src, dest, vars) {
    fs.mkdirSync(dest, { recursive: true });
    for (const item of fs.readdirSync(src)) {
        const srcPath = path.join(src, item);
        const destPath = path.join(dest, item.replace('__NAME__', vars.APP_NAME));

        if (fs.statSync(srcPath).isDirectory()) {
            copyTemplate(srcPath, destPath, vars);
        } else {
            let content = fs.readFileSync(srcPath, 'utf8');
            content = content.replace(/__APP_NAME__/g, vars.APP_NAME);
            fs.writeFileSync(destPath, content);
        }
    }
}
