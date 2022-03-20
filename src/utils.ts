import * as natural from 'natural'

export function extractKeywords(...strings) {
    return strings.map(str => str.split(' ').map(s => natural.PorterStemmer.stem(s.trim())))
        .reduce((result, strArray) => result.concat(strArray), [])
        .filter(Boolean)
}

export function normalize(str) {
    return str.split(' ')
        .map(s => s.trim())
        .reduce((result, strArray) => result.concat(strArray), [])
        .filter(Boolean)
        .join(' ')
}