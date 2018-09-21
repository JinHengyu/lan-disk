(function init() {
    fetch('/getList', {
            method: 'POST', // or 'PUT'
            body: JSON.stringify({
                file: {
                    dirList: ['#根目录']
                }
            }), // data can be `string` or {object}!
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then(res => res.json())
        .catch(error => alert(error.message))
        .then(({
            msg,
            list
        }) => {
            if (msg === 'ok') {
                window.fileList = list
            } else alert(msg)
        });
})();