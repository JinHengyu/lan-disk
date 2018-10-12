const express = require('express')
const app = express()
const port = 12345
const fs = require('fs')
const bodyParser = require('body-parser')
const path = require('path')



// app.use((req, res, next) => {
//     console.log(req.path)
//     next()
// })

// 网盘文件
app.use(express.static('public'))
// html,css,js
app.use(express.static('static', {
    // 365 days
    maxAge: 86400000 * 365
}))



app.all('/', (req, res, next) => res.redirect('/index.html'))

app.all('/getList', bodyParser.json(), (req, res, next) => {
    // 从'/'(public)下经过的目录名列表(不含'/')
    let dirList = req.body.file.dirList.filter(dir => dir !== '..')
    // 需要读取的目录绝对路径
    let p = path.join(__dirname, 'public', ...dirList)
    fs.readdir(p, (err, files) => {
        if (err) {
            res.json({
                msg: err
            });
        } else {
            res.json({
                msg: 'ok',
                list: files.filter(f => f[0] !== '.').map(f => {
                    let stat = fs.statSync(path.join(p, f))
                    stat.name = f
                    // 通过dirlist属性判断是否是目录
                    if (stat.isDirectory()) stat.dirList = [...dirList, f]
                    // 给浏览器window.open的path
                    // else stat.path = encodeURIComponent(path.join('/', ...dirList, f))
                    else stat.path = encodeURI(path.join('/', ...dirList, f))
                    return stat
                })
            });
        }
    })

});

app.listen(port, () => console.log(`http://localhost:${port}`))