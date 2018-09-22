(function init() {



    window.dom = {
        dir: document.querySelector('#dir'),
        table: document.querySelector('#table'),
    }


    window.columnDefs = [{
            headerName: '',
            field: 'type',
            cellClass: 'fas',
            cellStyle: {
                'font-size': '20px',
                'color': 'gray'
            }
        }, {
            headerName: "Name",
            field: "name"
        },
        {
            headerName: "Size",
            field: "size"
        },
        {
            headerName: "Birth",
            field: "birth"
        },
        {
            // 硬链接数(算入了目录下的所有文件?)
            headerName: "Nlink",
            field: "nlink"
        }
    ];

    window.gridOptions = {
        columnDefs,
        rowData: null,
        enableSorting: true,
        enableFilter: true,
        enableColResize: true,
        onRowClicked: event => {
            let file = fileList.find(f => f.name === event.data.name)
            if (file.path) window.open(file.path)
            if (file.dirList) {
                let dir = file
                getList(dir).then(render)
                window.dir = file
            }
        },
        defaultColDef: {
            cellStyle: {
                "cursor": 'pointer'
            }
        },
    };

    // init
    new agGrid.Grid(dom.table, gridOptions);
    window.dir = {
        dirList: []
    }
    getList(dir).then(render)

})();


// dir对象的dirlist fetch
function getList(dir) {
    return new Promise((res, rej) => {

        fetch('/getList', {
                method: 'POST', // or 'PUT'
                body: JSON.stringify({
                    file: {
                        dirList: dir.dirList
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
                    if (dir.dirList.length > 0) list.unshift({
                        name: '..',
                        type: '\uf07c',
                        dirList: window.dir.dirList.slice(0, -1)
                    })
                    window.fileList = list
                    res(fileList)
                } else alert(msg)
            });
    })
}

// 根据fileList
function render() {

    document.title = dom.dir.innerHTML = '/' + window.dir.dirList.join('/') + '/'

    const rowData = fileList.map(f => ({
        // 使用Unicode字符
        type: f.path ? '\uf15b' : '\uf07c',
        nlink: f.dirList ? f.nlink : undefined,
        name: f.name,
        size: f.size,
        birth: f.birthtime ? new Date(f.birthtime).toDateString() : undefined,
        // path: f.path,
        // dirList: f.dirList,
    }))


    // new agGrid.Grid(dom.table, gridOptions);
    gridOptions.api.setRowData(rowData);
    gridOptions.columnApi.autoSizeColumns(gridOptions.columnApi.getAllColumns().map(c => c.colId));

}