const express = require('express')
const whois = require('whois')
const fs = require('fs')
const config = require('./config')
const cache = require('./cache')
const app = new express()

if (!fs.existsSync('./cache')) fs.mkdirSync('./cache')

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('view', { data: null, cached: null, error: null })
})

app.get('/:target', (req, res) => {
    const { target } = req.params

    if (!target) return res.status('400').send('No target specified.')
    if (cache.has(target)) return res.render('view', { data: cache.get(target), cached: 'Yes', error: null })

    whois.lookup(target, function (err, data) {
        if (err) return res.status('500').render('view', {data: null, cached: null, error: err.message })
        cache.add(target, data)
        res.render('view', { data: data, cached: 'No', error: null })
    })
})

app.listen(config.port, () => {
    console.log(`Listening on ${config.port}`)
})