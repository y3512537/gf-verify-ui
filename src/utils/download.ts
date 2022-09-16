export default {
    // 下载 Excel 方法
    excel(data:any, fileName:string) {
        this.download0(data, fileName, 'application/vnd.ms-excel');
    },
    download0(data:any, fileName:string, mineType:string) {
        let blob = new Blob([data], {type: mineType});
        window.URL = window.URL || window.webkitURL;
        let href = URL.createObjectURL(blob);
        let downA = document.createElement("a");
        downA.href = href;
        downA.download = fileName;
        downA.click();
        // 销毁超连接
        window.URL.revokeObjectURL(href);
    },
}
