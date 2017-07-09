export function strip(str) {
  return str[0].replace(/^\n/, '').replace(/^(\ +)/gm, '')
}
