
export const generarSlug = (text: string, id) => {
    return text.toLowerCase().replace(/ /g, '-') + '-' + id;
}

export const getIdBySlug = (slug: string) => {
    return slug.split('-').pop();
}

export const roundToTwoDecimals = (num: number) => {
    return Math.round((num + Number.EPSILON) * 100) / 100;
}