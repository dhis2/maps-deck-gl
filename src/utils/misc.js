export const template = (str, data) =>
    str && data
        ? str.replace(/\{ *([\w_-]+) *\}/g, (str, key) => data[key] || '')
        : null
