const express = require('express')
const fs = require('fs')
const config = require('./config')
const cache = require('./cache')
const app = new express()
const { spawn } = require('child_process')

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

    const args = [target]
    const cmd = '/bin/whois'
    const subprocess = spawn(cmd, args)
    let stdout = ''
    subprocess.stdout.on('data', function (data) { stdout += data} )

    subprocess.on('close', () => {
        cache.add(target, stdout)
        res.render('view', { data: stdout, cached: 'No', error: null })
    })
})

app.listen(config.port, () => {
    console.log(`Listening on ${config.port}`)
})