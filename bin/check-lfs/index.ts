import { execSync } from "child_process";
import { readFileSync } from 'fs';
import { sync as globSync } from 'glob';

if (process.env['TARGET_TOP']) {
  process.chdir(process.env['TARGET_TOP']);
}

const attributes = readFileSync(`.gitattributes`, 'utf8').split('\n')
    .map((v) => v.split('#')[0].trim())
    .filter((v) => v.indexOf(' filter=lfs ') >= 0)
    .map((v) => v.split(' ')[0]);
const nestedFiles = attributes.map((v) => globSync(`**/${v}`));
const matchedFiles = [].concat(...nestedFiles).sort() as string[];

const lfsFiles = execSync('git-lfs ls-files').toString().split('\n')
  .map((v) => v.split(' ').slice(-1)[0])
  .filter((v) => v !== '')
  .sort();

const additionalMatchedFiles = matchedFiles.filter((v) => lfsFiles.indexOf(v) < 0);
if (additionalMatchedFiles.length !== 0) {
  console.error('Following files MUST set LFS.');
  additionalMatchedFiles.forEach((v) => console.error(`  ${v}`));
  process.exit(1);
}

console.log(`${lfsFiles.length} LFS Files matched`);
