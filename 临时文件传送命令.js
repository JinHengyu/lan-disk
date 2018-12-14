const file = 'E:\\爬虫\\Spxart\\TopSct.rar';
const name = 'TopSct.rar';
require('http').createServer((req, res) => {
    res.setHeader('Content-Disposition', `attachment; filename="${name}"`);
    res.end(require('fs').readFileSync(file));
}).listen(80);