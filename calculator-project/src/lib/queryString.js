module.exports.queryString = (obj) => {
    const queryParams = Object.entries(obj).map(item => {
        return `${item[0]}=${item[1]}`
    })

    return queryParams.join('&')

}