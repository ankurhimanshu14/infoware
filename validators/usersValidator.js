module.exports = {
    validateNames: (v) => {
        return /^[A-Za-z]+$/.test(v)
    },

    validatePhoneNumbers: (v) => {
        return /\d{10}/.test(v)
    }
}