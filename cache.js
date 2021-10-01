const fs = require('fs')

const add = (target, data) => {
    fs.writeFileSync(`./cache/${target}`, data)
    setTimeout(() => { remove(target) }, 20 * 60000);
}

const has = (target) => {
    if (fs.existsSync(`./cache/${target}`)) return true
    return false
}

const get = (target) => {
    return fs.readFileSync(`./cache/${target}`)
}

const remove = (target) => {
    fs.unlinkSync(`./cache/${target}`)
}

module.exports = { add, has, get, remove }