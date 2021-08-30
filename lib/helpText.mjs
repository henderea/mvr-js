import { HelpTextMaker, styles, style } from '@henderea/simple-colors/helpText.js';
const { magenta } = styles;

const ex = magenta.bright;

const helpText = new HelpTextMaker('mvr')
  .wrap()
  .title.nl
  .pushWrap(4)
  .tab.text('A regex rename utility that takes a list of files, applies the regex replacement, shows the anticipated changes for confirmation, and then applies the renames.').nl
  .popWrap()
  .nl
  .flags.nl
  .pushWrap(8)
  .dict
  .key.tab.flag('--match', '-m').value.text('The regex pattern to match').end.nl
  .key.tab.flag('--replace', '-r').value.text('The substitution string').end.nl
  .key.tab.flag('--no-case', '-i').value.text('Make the regex pattern case-insensitive').end.nl
  .key.tab.flag('--include-extension', '-e').value.text('Include the extension in the name that is processed.').end.nl
  .key.tab.flag('--version').value.text('Print the tool version').end.nl
  .key.tab.flag('--help', '-h').value.text('Print this help').end.nl
  .endDict
  .popWrap()
  .nl
  .bold('Patterns:').nl
  .pushWrap(4)
  .text('Uses NodeJS regular expression support. Only indexed capture groups are supported.').nl
  .popWrap()
  .nl
  .bold('Replacement String:').nl
  .pushWrap(4)
  .tab.text('The replacement string supports some special match group syntax:').nl
  .nl
  .pushWrap(8)
  .dict
  .tab.tab.bold('Basic Syntax:').nl
  .key.tab.tab.tab.text(ex('${1}')).value.text('insert capture group 1').end.nl
  .key.tab.tab.tab.text(ex('${1|2}')).value.text("insert capture group 1, or if that didn't match, insert capture group 2; the | syntax can be used in all other syntax setups").end.nl
  .nl
  .tab.tab.bold('Ternary syntax:').nl
  .key.tab.tab.tab.text(ex('${1?a:b}')).value.text("insert either 'a' or 'b', depending on if capture group 1 matched anything; a and b can be empty, and can contain any characters other than : and }").end.nl
  .key.tab.tab.tab.text(ex('${1?a}')).value.text("insert 'a' if capture group 1 matched anything, or insert nothing if it did nto match").end.nl
  .nl
  .tab.tab.bold('Fallback syntax:').nl
  .key.tab.tab.tab.text(ex('${1:-a}')).value.text("insert capture group 1, or if that didn't match, insert 'a'").end.nl
  .nl
  .tab.tab.bold('Substring syntax:').nl
  .key.tab.tab.tab.text(ex('${1:1}')).value.text('insert capture group 1, starting at index 1').end.nl
  .key.tab.tab.tab.text(ex('${1:1:2}')).value.text('insert capture group 1, starting at index 1, with a length of 2').end.nl
  .endDict
  .popWrap()
  .nl
  .tab.bold('Syntax notes:').nl
  .pushWrap(8)
  .tab.tab.text('You can nest a replacement string match group syntax in any constant.').nl
  .nl
  .dict
  .tab.tab.bold('Examples:').nl
  .key.tab.tab.tab.text(ex('${1?${2}${3}}')).value.text("insert capture group 2 if group 1 was matched, or group 3 if it didn't").end.nl
  .key.tab.tab.tab.text(ex('${1:-${2}}')).value.text('same as ').text(ex('${1|2}')).end.nl
  .key.tab.tab.tab.text(ex('${1:${2?1:2}:${2?3:2}}')).value.text('insert a substring of capture group 1; if capture group 2 matched, the substring will be 3 characters starting at index 1; if capture group 2 did not match, the substring will be 2 characters starting at index 2').end.nl
  .endDict
  .popWrap()
  .popWrap()
  .nl
  .toString(120);

export {
  helpText,
  styles,
  style
};
