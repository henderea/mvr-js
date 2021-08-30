#!/usr/bin/env node

import path from 'path';
import fs from 'fs';
import readline from 'readline';
import { fileURLToPath } from 'url';

import { processReplace } from '@henderea/regex-util';

import { argParser } from '../lib/arg-helper.mjs';
import { helpText, styles, style } from '../lib/helpText.mjs';
const { black, white, red } = styles;

const options = argParser()
  .string('match', '--match', '-m')
  .string('replace', '--replace', '-r')
  .bool('help', '--help', '-h')
  .bool('noCase', '--no-case', '-i')
  .bool('includeExtension', '--include-extension', '-e')
  .findVersion(fileURLToPath(import.meta.url), '--version')
  .help(helpText, '--help', '-h')
  .argv;

let matchRegex = new RegExp(options.match, `g${options.noCase ? 'i' : ''}`);
let replaceString = options.replace;

let renamed = [];
let encountered = [];
let duplicated = [];
options._.forEach((filename) => {
  let extname = path.extname(filename);
  let basename = path.basename(filename, extname);
  let dirname = path.dirname(filename);
  let replacementBasename = `${basename}${options.includeExtension ? extname : ''}`.replace(matchRegex, (...args) => processReplace(args, replaceString));
  let replacementFilename = path.join(dirname, `${replacementBasename}${options.includeExtension ? '' : extname}`);
  renamed.push({
    filename,
    extname,
    basename: `${basename}${options.includeExtension ? extname : ''}`,
    dirname,
    replacementBasename,
    replacementFilename,
    from: filename,
    to: replacementFilename
  });
  if(encountered.includes(replacementFilename)) {
    if(!duplicated.includes(replacementFilename)) {
      duplicated.push(replacementFilename);
    }
  } else {
    encountered.push(replacementFilename);
  }
});

const maxBy = (array, mapper) => Math.max(...array.map(mapper));
const center = (string, length, char = ' ') => {
  let startPad = Math.floor((length - string.length) / 2);
  let endPad = length - string.length - startPad;
  let startPadText = char.repeat(startPad).slice(0, startPad);
  let endPadText = char.repeat(endPad).slice(0, endPad);
  return `${startPadText}${string}${endPadText}`;
};

let len1 = Math.max(maxBy(renamed, (r) => r.from.length), 3);
let len2 = Math.max(maxBy(renamed, (r) => r.to.length), 3);

let border = `+${'-'.repeat(len1 + 2)}+${'-'.repeat(len2 + 2)}+`;

const normal = (s) => s;
const same = style(white.bg, black.bright);
const conflict = style(red.bg, white.bright);

let lines = [];

lines.push(border);
lines.push(`| ${center('Old', len1)} | ${center('New', len2)} |`);
lines.push(border);
renamed.forEach((entry) => {
  let { from, to } = entry;
  let from2 = center(from, len1);
  let to2 = center(to, len2);
  if(from == to) {
    from2 = same(from2);
    to2 = same(to2);
  } else if(duplicated.includes(to)) {
    from2 = conflict(from2);
    to2 = conflict(to2);
  } else {
    from2 = normal(from2);
    to2 = normal(to2);
  }
  lines.push(`| ${from2} | ${to2} |`);
});
lines.push(border);
process.stdout.write(lines.join('\n') + '\n\n');

if(renamed.every((r) => r.from == r.to)) {
  process.stdout.write('Nothing changed; exiting.\n');
  process.exit(0);
} else {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Are you sure you want to rename these files? ([y]es/[n]o) ', (answer) => {
    answer = `${answer}`.toLowerCase();
    if(answer == 'yes' || answer == 'y') {
      renamed.filter((r) => r.from != r.to).forEach((r) => fs.renameSync(r.from, r.to));
    }
    process.exit(0);
  });
}
