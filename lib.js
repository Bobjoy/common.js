/**
 * 依赖基础库 jQuery、Layui
 */

;(function(){

    ////////////////////对象扩展//////////////////////

    /**
     * 判断字符串以str开头
     * eg: ',one,two'.startsWith(',')
     * @param str 判断的字符
     * @returns {boolean}
     */
    String.prototype.startsWith = function(str){
        return new RegExp('^' + str, 'g').test(this);
    };

    /**
     * 判断字符串以str结尾
     * eg: 'one,two,'.endsWith(',')
     * @param str 判断的字符
     * @returns {boolean}
     */
    String.prototype.endsWith = function(str){
        return new RegExp(str + '$', 'g').test(this);
    };

    /**
     * 日期格式化
     * eg: (new Date()).format('yyyyMMdd')
     * @param fmt 日期格式
     * @returns {*} 格式化后的日期字符串
     */
    Date.prototype.format = function(fmt) {
        var o = {
            "M+" : this.getMonth()+1,                 //月份
            "d+" : this.getDate(),                    //日
            "h+" : this.getHours(),                   //小时
            "m+" : this.getMinutes(),                 //分
            "s+" : this.getSeconds(),                 //秒
            "q+" : Math.floor((this.getMonth()+3)/3), //季度
            "S"  : this.getMilliseconds()             //毫秒
        };
        // 年格式化：yy/yyy/yyyy
        if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        }
        for(var k in o) {
            if(new RegExp("("+ k +")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length===1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
        }
        return fmt;
    };

    /**
     * 获取数组中对象下标
     * @type {*|Function}
     */
    Array.prototype.indexOfObject = function(key, val) {
        for(var i = 0, len = this.length; i < len; i++) {
            if (this[i][key] === val) {
                return i
            }
        }
        return -1;
    };

    /**
     * 向对象数组中（如果不存在）添加对象，key判断对象唯一的属性
     * @type {*|Function}
     */
    Array.prototype.pushObject = function(key, item) {
        var index = this.indexOfObject(item, key);
        if (index === -1) {
            this.push(item);
        }
    };

    /**
     * 从对象数组中（如果存在）移除对象，key判断对象唯一的属性
     * @type {*|Function}
     */
    Array.prototype.removeObject = function(key, val) {
        var index = this.indexOfObject(key, val);
        if (index !== -1) {
            this.splice(index, 1);
        }
    };

    /**
     * 将对象数组中的key属性值通过separator拼接字符串
     * @type {*|Function}
     */
    Array.prototype.joinObject = function(key, separator) {
        var arr = [];
        for(var i = 0, len = this.length; i < len; i++) {
            arr.push(this[i][key]);
        }
        return arr.join(separator);
    };

    /**
     * 从对象数组中获取key值为val的对象
     * @type {*|Function}
     */
    Array.prototype.getObject = function(key, val) {
        var tmp;
        for(var i = 0, len = this.length; i < len; i++) {
            tmp = this[i];
            if (tmp[key] === val) {
                return tmp;
            }
        }
    };

    ////////////////////jQuery扩展//////////////////////
    /**
     * 定义serializeObject方法，序列化表单，同名input序列化成数组
     * eg: $('form').serializeObject()  => {a: 1, b: [1, 2]}
     *     $('#input').serializeObject() => {a: 1}
     *     $('#div').serializeObject() => {a: 1, b: [1, 2]}
     */
    $.fn.serializeObject = function() {
        var obj = {}, arr = [], temp;
        if (this.is('form')) {
            arr = this.serializeArray();
        } else if(this.is('input,select,textarea')) {
            var name = this.attr('name');
            if (typeof name !== 'undefined' && (name = name.trim()) !== '') {
                arr.push({name: name, value: this.val()});
            }
        } else {
            this.find('input,textarea,select').each(function(){
				var item = this;
                if (item.name) {
                    temp = {};
                    if ($(item).is('input:radio')) {
                        if ($(item).is(':checked')) {
                            temp[item.name] = item.value;
                        }
                    } else {
                        temp[item.name] = item.value;
                    }
                    arr.push(temp);
                }
            })
        }

        $.each(arr, function() {
            var self = this;
            if (obj[self.name]) {
                if (!obj[self.name].push) {
                    obj[self.name] = [ obj[self.name] ];
                }
                obj[self.name].push(self.value || '');
            } else {
                obj[self.name] = self.value || '';
            }
        });
        return obj;
    };


    var lib = {debug: true};
    ////////////////////公共方法//////////////////////
    /**
     * 控制台打印调试，防止IE未打开开发者工具时console对象未定义
     * @param msg
     */
    lib.log = function(msg) {
        if (!lib.debug) return;

        if (console && console.log) {
            console.log(msg);
        }
    };

    lib.logError = function(err) {
        if (!lib.debug) return;

        if (console && console.error) {
            console.error(err);
        }
    };


    // 依赖layer的公共方法
    var layer = window.layer;

    /**
     * 弹出提示，自动消失
     * @param msg
     * @param layerOptions
     */
    lib.alertToast = function(msg, layerOptions) {
        if (!layer) {
            lib.logError('layer is not defined');
            alert(msg);
            return -1;
        }
        return layer.msg(msg, layerOptions);
    };
    /**
     * 弹出信息提示框
     * @param msg 信息内容
     * @param title 标题
     * @param layerOptions layer选项
     */
    lib.alertInfo = function(msg, title, layerOptions) {
        if (!layer) {
            lib.logError('layer is not defined');
            alert(msg);
            return -1;
        }
        return layer.open($.extend(true, {
            title: title || '提示'
            ,content: msg
        }, layerOptions));
    };

    /**
     * 弹出警告提示框
     * @param msg 信息内容
     * @param title {string|boolean} 标题|是否显示标题
     * @param layerOptions layer选项
     */
    lib.alertWarn = function(msg, title, layerOptions) {
        if (title === false) {
            return lib.alertToast(msg, $.extend(true, {icon: 0}, layerOptions))
        } else {
            return lib.alertInfo(msg, title, $.extend(true, {
                title: title || '警告'
                , content: msg
                , icon: 0
            }, layerOptions));
        }
    };

    /**
     * 弹出成功提示框，一般用于操作成功后提示
     * @param msg 信息内容
     * @param title {string|boolean} 标题|是否显示标题
     * @param layerOptions layer选项
     */
    lib.alertSuccess = function(msg, title, layerOptions) {
        if (title === false) {
            return lib.alertToast(msg, $.extend(true, {icon: 1}, layerOptions))
        } else {
            return lib.alertInfo(msg, title, $.extend(true, {
                title: title || '成功'
                , content: msg
                , icon: 1
            }, layerOptions));
        }
    };

    /**
     * 弹出错误提示框，一般用户操作错误后提示，
     * @param msg 信息内容
     * @param title {string|boolean} 标题|是否显示标题
     * @param layerOptions layer选项
     */
    lib.alertError = function(msg, title, layerOptions) {
        if (title === false) {
            return lib.alertToast(msg, $.extend(true, {icon: 2}, layerOptions))
        } else {
            return lib.alertInfo(msg, title, $.extend(true, {
                title: title || '错误'
                , content: msg
                , icon: 2
            }, layerOptions));
        }
    };

    /**
     * 弹出确认提示框
     * @param msg
     * @param title
     * @param yes
     * @param no
     * @param layerOptions
     * @returns {*}
     */
    lib.alertConfirm = function(msg, title, yes, no, layerOptions) {
        if (!layer) {
			lib.logError('layer is not defined');
			if (window.confirm(msg)) {
				yes();
			}
            return;
        }

        return layer.confirm(msg, $.extend(true, {
            title: title || '请确认'
            , btn: ['确定','取消']
        }, layerOptions), function(index){
            $.isFunction(yes) && yes.apply(this, arguments) && lib.alertClose(index);
        }, function(index){
            $.isFunction(no) && no.apply(this, arguments)
        });
    };

    /**
     * 弹出输入提示框
     * @param msg
     * @param title
     * @param yes {Function}
     * @param layerOptions
     * @returns {*}
     */
    lib.alertPrompt = function(msg, title, yes, layerOptions) {
        if (!layer) {
			lib.logError('layer is not defined');
			var val = window.prompt(msg);
			if (val === '') {
				lib.alertPrompt(msg, title, yes);
			} else {
				yes(val);
			}
            return;
        }

        return layer.prompt($.extend(true, {
            title: title || '请输入', formType: 1
        }, layerOptions), function(index){
            $.isFunction(yes) && yes.apply(this, arguments) && lib.alertClose(index)
        });
    };

    /**
     * 关闭layer弹出层
     * @param index
     */
    lib.alertClose = function(index) {
        if (!layer) {
            lib.logError('layer is not defined');
            return;
        }
        index ? layer.close(index) : layer.closeAll();
    };

    /**
     * loading弹出层
     * @param callback
     * @param layerOptions
     * @returns {*}
     */
    lib.alertLoading = function(callback, layerOptions) {
        if (!layer) {
            lib.logError('layer is not defined');
            return;
        }

        var index = layer.load(2, $.extend(true, {
            shade: [0.3,'#ccc']
        }, layerOptions));

        $.isFunction(callback) && callback(index);

        return index;
    };

    /**
     * 手动关闭loading
     */
    lib.closeLoading = function() {
        if (!layer) {
            lib.logError('layer is not defined');
            return;
        }

        layer.closeAll('loading');
    };



    var $ajax = $.ajax;
    /**
     * 扩展ajax
     * 1、默认loading
     * 2、服务端请求错误提示
     * 3、客户端请求错误提示
     * 4、客户端请求超时提示
     * @param options
     * @returns {*}
     */
    lib.ajax = function(options) {

        // 设置超时的时间30s
        options.timeout = options.timeout || 30000;

        // 开启loading锁屏
        if (options.loading !== false) {
            var _before = options.beforeSend || $.noop;
            options.beforeSend = function() {
                _before.apply(this, arguments);
                lib.alertLoading();
            };

            // 请求完成
            var _complete = options.complete || $.noop;
            options.complete = function(xhr, textStatus) {
                _complete.apply(this, arguments);
                lib.closeLoading();

                // 超时提示
                if(textStatus === 'timeout'){
                    lib.alertWarn('请求超时，请稍后重试！', '系统消息')
                }
            };
        }

        // 对服务端请求错误统一提示处理
        var _success = options.success || $.noop, _fail = options.fail;
        options.success = function(res) {
            if (res.id && res.id !== '01') {
                // 调用方自己处理业务请求错误
                if ($.isFunction(_fail)) {
                    _fail.call(this, res);
                } else {
                    // 显示错误信息
                    var layerOptions = null;
                    // 如果有错误信息，则显示查看错误信息按钮
                    if (res.bz) {
                        layerOptions = {
                            btn:['查看错误信息','关闭'],
                            yes: function(){
                                lib.alertError('<pre>'+res.bz+'</pre>',"查看错误信息",{
                                    area: ['500px', '300px'],
                                    btn:['复制错误信息','关闭'],
                                    yes: function(){
                                        lib.copyText(res.bz);
                                    }
                                })
                            }
                        }
                    }
                    lib.alertError(res.msg, '系统消息', layerOptions);
                }
            } else {
                _success.apply(this, arguments);
            }
        };

        // 对客户端请求错误统一提示处理
        var _error = options.error || $.noop;
        options.error = function(xhr) {
            var status = xhr.status, error = '网络传输异常，请稍后重试！';
            switch (status) {
                case 401: error = '需要用户验证！';break;
                case 403: error = '资源禁止访问！';break;
                case 404: error = '请求路径不正确！';break;
                case 405: error = '请求方法不支持！';break;
                case 406: error = '无法解析返回结果！';break;
            }
            lib.alertError(error, '系统消息', false);
            _error.apply(this, arguments);
        };

        // 请求头中设置json请求标识，后台异常情况下返回json数据
        options.headers = $.extend(true, {
            'X-Response-Type': 'json'
        }, options.headers);

        return $ajax(options);
    };

    $.each( [ "get", "post" ], function( i, method ) {
        lib[ method ] = function( url, data, callback, type, loading ) {
            // shift arguments if data argument was omitted
            if ( $.isFunction( data ) ) {
                type = type || callback;
                callback = data;
                data = undefined;
            }

            // The url can be an options object (which then must have .url)
            return lib.ajax( $.extend( {
                url: url,
                type: method,
                dataType: type,
                data: data,
                success: callback,
                loading: loading
            }, $.isPlainObject( url ) && url ) );
        };
    });

    /**
     * 复制文本到剪贴板
     * @param txt 待复制的文本
     * @param btn 可选，绑定点击复制按钮
     */
    lib.copyText = function(txt, btn) {

        if (!('execCommand' in document)) {
            lib.alertWarn('浏览器不支持复制功能，请手动复制！');
            return;
        }

        // 容器
        var $copyArea = $('#copyArea'), $textarea = $('#copyTxt');
        if ($copyArea.length === 0) {
            $textarea = $('<textarea id="copyTxt"/>');
            $copyArea = $('<div id="copyArea"/>').css({position:'absolute',top:0,left:0,opacity:0,zIndex:-10}).append($textarea);
            $copyArea.appendTo('body');
        }

        var onCopy = function(){
            $textarea[0].value = txt;
            $textarea[0].select();
            $textarea.focus();
            document.execCommand("copy");
            lib.alert("复制成功");
        };

        // 复制按钮
        var $btn = btn || $('#copyBtn');
        if ($btn.length === 0) {
            $btn = $('<button id="copyBtn"/>').css({height: 0});
            $btn.appendTo($copyArea);

        }

        // 绑定点击
        $btn.one('click', onCopy);

        // 未知道按钮，则自动触发点击
        if (!btn || btn.length === 0) {
            $btn.click();
        }
    };

    /**
     * 页面跳转（loading）
     * @param url    必须   跳转地址
     * @param params 可选   附带参数
     * @param loc    可选   当前页面(location) 或者 父页面(parent.location)
     *
     * eg: lib.forward('http://www.baidu.com', {a: 1, b: 2}, parent.location)
     */
    lib.forward = function(url, params, loc) {

        // 默认当前页面跳转
        loc = loc || window.location;

        // 拼接参数
        if (params) {
            params = $.param(params);
            if (url.indexOf('?') === -1) {
                url = url + '?' + params;
            } else {
                url = url + '&' + params;
            }
        }

        // loading
        lib.alertLoading();

        // 跳转
        loc.href = url;
	};

    window.lib = lib;
})();
