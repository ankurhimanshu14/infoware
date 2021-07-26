module.exports = {
    encoder: obj => {
        return Object.keys(obj)
        .map(key => {
            return [key, obj[key]].map(encodeURIComponent).join("=");
        }).join("&");
    },

    decoder: url => {
        url
        .split("&")
        .reduce((accum, queryParam) => {
            const [key, value] = queryParam.split("=");
            accum[key] = value;
            return accum;
        }, {});
    }
}