let generateMessage = (from, text) => {
    return {
        from,
        text,
        timestamp
    }
}

module.exports = {generateMessage};