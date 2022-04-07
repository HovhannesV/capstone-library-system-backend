import * as natural from 'natural'

export function extractKeywords(...strings) {
    const keywords = strings.map(str => str.split(' ').map(s => natural.PorterStemmer.stem(s.trim())))
        .reduce((result, strArray) => result.concat(strArray), [])
        .filter(Boolean);
    return [...new Set(keywords)] as string[]
}

export function extractKeywordsWithPrefixes(...strings) {
    const keywords = strings.map(str => str.split(' ').map(s => s.trim()))
        .reduce((result, strArray) => result.concat(strArray), [])
        .filter(Boolean);
    const uniqueKeywords = [...new Set(keywords)] as string[]

    const finalResult = [];
    for(const keyword of uniqueKeywords) {
        for(let i = 1; i <= keyword.length; i++) {
            finalResult.push(natural.PorterStemmer.stem(keyword.substring(0, i)));
        }
    }
    return [...new Set(finalResult)]
}

export function normalize(str) {
    return str.split(' ')
        .map(s => s.trim())
        .reduce((result, strArray) => result.concat(strArray), [])
        .filter(Boolean)
        .join(' ')
}