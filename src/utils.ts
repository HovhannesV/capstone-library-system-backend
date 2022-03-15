export function extractKeywords(...strings) {
    return strings.map(str => str.split(' ').map(s => s.trim()))
        .reduce((result, strArray) => result.concat(strArray), [])
        .filter(Boolean)
}