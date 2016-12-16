function ajax(obj) {
    //定义默认参数
    var defaults = {
        url: '#',
        type: 'get',
        data: {},
        dataType: 'text',
        jsonp: 'cb',
        async: true,
        success: function (data) {
            console.log(data);
        }
    }
    //遍历传入参数
    for (var k in obj) {
        defaults[k] = obj[k];
    }
    //创建对象
    var xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP')
    }
    //判断是否为jsonp请求
    if (defaults.dataType == 'jsonp') {
        jsonp(defaults);
    } else {
        json(defaults);
    }
    function jsonp(defaults) {
        //定义函数
        var cbName = 'jQuery' + ('1.11.1' + Math.random()).replace(/\D/g, '') + '_' + (new Date().getTime());
        //如果传入了相应参数就更改
        if (defaults.jsonpCallback) {
            cbName = defaults.jsonpCallback;
        }
        //拼接请求参数
        var param = '';
        for (var k in defaults.data) {
            param += k + "=" + defaults.data[k] + '&';
        }
        if (param) {
            param.substring(0, param.length - 1);
            param = '&' + param;
        }
        window[cbName] = function (data) {
            defaults.success(data);
        }
        // xhr.open(defaults.type,defaults.url+'?'+defaults.jsonp + '=' + cbName + param,defaults.async);
        var script = document.createElement('script');
        script.src = defaults.url + '?' + defaults.jsonp + '=' + cbName + param;
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(script);
    }

    function json(defaults) {
        var param = '';
        for (var k in defaults.data) {
            param += k + '=' + defaults.data[k] + '&';
        }
        if (param) {
            param.substring(0, param.length - 1);
            param = '&' + param;
        }
        if (defaults.type = 'get') {
            defaults.url += '?' + encodeURI(param);
        }
        xhr.open(defaults.type, defaults.url, defaults.async);
        var msg = null;
        if (defaults.type == 'post') {
            msg = param;
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        }
        xhr.send(msg);
        if (!defaults.async) {
            var data = xhr.responseText;
            if (defaults.dataType == 'json') {
                data = JSON.parse(data);
            }
            return data;
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    var data = xhr.responseText;
                    if (defaults.dataType == 'json') {
                        data = JSON.parse(data);
                    }
                    defaults.success(data);
                }
            }
        }
    }
}