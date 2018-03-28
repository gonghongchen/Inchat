/**
 * @description 网址头部
 */
const requestHeader: string = "/php/";  //dev
// const requestHeader: string = "http://localhost/php/";  //prod

/**
 * @description 判断是否为空对象
 * @param obj 被判断的对象
 */
const isEmptyObject = (obj: any[] | object) => {
    for (let prop in obj) {
        return false;
    }
    
    return true;
};

/**
 * @description 通过AJax发送请求
 * @param params 参数是一个对象
 * @param url url地址，只需要写【名字.php】就好了
 * @param method 请求方式【get | post】
 * @param data 发送的数据
 * @param async 是否异步
 * @param success 请求成功的回调，并把请求到的数据通过参数传入
 * @param error 请求失败的回调，并把错误状态通过参数传入
 */
const Ajax = (params: {
    url: string,
    method ? : string,
    data: any[] | Object,
    async ? : boolean,
    success ? : Function,
    error ? : Function
}) => {
    let url = requestHeader + params.url,
        method = params.method || "get",
        data = params.data || {},
        async = params.async || false,
        success = params.success || function(data){},
        error = params.error || function(status){},
        formData = function(data) {
            let newData = "";
            for (let prop in data) {
                newData += encodeURIComponent(prop);
                newData += "=";
                newData += encodeURIComponent(data[prop]);
                newData += "&";
            }
            return newData.substring(0, newData.length - 1);
        };
        
    if (typeof url !== "string") {
        throw new Error("url must be a string");
    }
    if (typeof data !== "object") {
        throw new Error("data must be a object");
    }
    if (!isEmptyObject(data)) {
        if (method === "get") {
            if (url.indexOf("?") === -1) {
                url += "?";
            } else if (url.indexOf("&") !== url.length - 1) {
                url += "&";
            }
            url += formData(data);
            data = null;
        } else{
            data = formData(data);
        }
    }
    
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                success(xhr.responseText);
            } else{
                error(xhr.status);
            }
        }
    };
    xhr.open(method, url, async);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(data);
};

/**
 * @description 跳转到/打开指定页面（同目录下）
 * @param filename 转入的页面的文件名，有无【.html】后缀均可
 * @param newTarget 是否在新的窗口打开页面
 */
const toURL = (filename: string, newTarget: boolean = false): boolean => {
    const href = window.location.href;

    if (typeof filename !== "string") {
        filename = "index.html";
    } else if (!filename.includes(".html")) {
        filename += ".html"
    }

    const url = href.substr(0, href.lastIndexOf("/") + 1) + filename;

    if (newTarget && typeof newTarget === "boolean") {
        window.open(url);
    } else {
        window.location.href = url;
    }

    return false;
}

export {
    requestHeader,
    Ajax,
    toURL
};