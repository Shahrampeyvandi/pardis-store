(function (window, document, $) {
    'use strict';
    $.app = $.app || {};
    var $body = $('body');
    var $window = $(window);

    $.app.url = {
        SetURL: function (url_string) {
            window.history.pushState("", "", url_string);
        },
        GetURL: function () {
            return this.CleanArray(window.location.pathname.split('/'));
        },
        CleanArray: function(arr) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == '') {
                    arr.splice(i, 1);
                    i--;
                }
            }
            return arr;
        },
        ObjToString: function (obj) {
            var str = '';
            for (var p in obj) {
                if (obj.hasOwnProperty(p)) {
                    str += p + '::' + obj[p] + ',';
                }
            }
            return str;
        },
        StringToObj: function (str) {
            if (str == '' || typeof str =='undefined') {
                return {};
            }
            var obj = str.split(',');
            var returnobj = {};
            for (var p in obj) {
                var objarr = obj[p].split('::');
                returnobj[objarr[0]] = objarr[1];
            }
            return returnobj;
        },
        encode: function (string) {
            return escape(this._utf8_encode(string));
        },
        decode: function (string) {
            return this._utf8_decode(unescape(string));
        },
        _utf8_encode: function (string) {
            string = string.replace(/\r\n/g, '\n');
            var utftext = '';
            for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n);
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
            }
            return utftext;
        },
        _utf8_decode: function (utftext) {
            var string = '';
            var i = 0;
            var c = 0;
            var c1 = 0;
            var c2 = 0;
            var c3 = 0;
            while (i < utftext.length) {
                c = utftext.charCodeAt(i);
                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                }
                else if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                }
                else {
                    c2 = utftext.charCodeAt(i + 1);
                    c3 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }
            }
            return string;
        },
        Enable: function () {
            $.app.ajax.Page.Load($.app.url.GetHashVar('p'), $.app.url.ExtraParametr());
            $(window).on('hashchange', function () {
                if (typeof $.app.url.GetHashVar('p') != 'undefined') {
                    $.app.ajax.Page.Load($.app.url.GetHashVar('p'), $.app.url.ExtraParametr());
                }
            });
        },
        Disable: function () {
            $(window).unbind('hashchange');
        },
        Implode: function (glue, pieces) {
            var i = '', j = 0, retVal = '', tGlue = '';
            if (arguments.length === 1) {
                pieces = glue;
                glue = '';
            }
            if (typeof(pieces) === 'object') {
                if (Object.prototype.toString.call(pieces) === '[object Array]') {
                    return pieces.join(glue);
                }
                for (i in pieces) {
                    if (pieces[i] != '') {
                        if (typeof(pieces[i]) === 'object') {
                            for (j in pieces[i]) {
                                if (pieces[i][j] != '') {
                                    retVal += tGlue + i + '[' + j + ']=' + pieces[i][j];
                                    tGlue = glue;
                                }
                            }
                        }
                        else {
                            retVal += tGlue + i + '=' + pieces[i];
                            tGlue = glue;
                        }
                    }
                }
                return retVal;
            }
            return pieces;
        },
        GetHashVar: function (elname) {
            var params = {};
            var url = document.location.href.split('#', 2)[1];
            if (typeof url == 'undefined') {
                url = '';
            }
            if (url.indexOf('?') != -1) {
                var single = url.split('?')[0].split('=');
                if (single[0]) {
                    params[single[0]] = single[1];
                }
                url = url.split('?', 2)[1];
            }
            var paramsRaw = (url || '').split('&') || [];
            for (var i = 0; i < paramsRaw.length; i++) {
                var single = paramsRaw[i].split('=');
                if (single[0]) {
                    params[single[0]] = single[1];
                }
            }
            return params[elname];
        },
        ExtraParametr: function (getall) {
            var ex_url = (document.location.href.split('#', 2)[1] || '');
            var pagename = ($.app.url.GetHashVar('p') == '') ? 'dashboard' : $.app.url.GetHashVar('p');
            if (ex_url.indexOf('p=' + pagename) >= 0 && typeof getall == 'undefined') {
                ex_url = ex_url.replace('p=' + pagename, '');
            }
            ex_url = $.app.url.decode(ex_url);
            if (ex_url.indexOf('?') != -1) {
                ex_url = ex_url.split('?')[1];
            }
            var paramsRaw = ex_url.split('&') || [];
            var extra_parametr = {};
            for (var i = 0; i < paramsRaw.length; i++) {
                var single = paramsRaw[i].split('=');
                if (single[0]) {
                    extra_parametr[single[0]] = single[1];
                }//Url.decode(single[1]);
            }
            return extra_parametr;
        },
        AddHashVar: function (VarName, VarValue) {
            $.app.url.Disable();
            var allpar = $.app.url.ExtraParametr(true);
            allpar[VarName] = VarValue;
            location.hash = implode('&', allpar);
            setTimeout(function () {
                $.app.url.Enable();
            }, 100);
        },
        RemoveHashVar: function (VarName) {
            $.app.url.Disable();
            var allpar = $.app.url.ExtraParametr(true);
            if (typeof allpar[VarName] == 'undefined') {
                return false;
            }
            delete allpar[VarName];
            allpar['p'] = $.app.url.GetHashVar('p');
            location.hash = $.app.url.Implode('&', allpar);
            setTimeout(function () {
                $.app.url.Enable();
            }, 100);
        },
    };

    $.app.ajax = {
        Template: function (template, data) {
            return (typeof template =='undefined')?'':template.replace(/\{([\w\.]*)\}/g, function(str, key) {
                var keys = key.split("."), v = data[keys.shift()];
                for (var i = 0, l = keys.length; i < l; i++) v = v[keys[i]];
                return (typeof v !== "undefined" && v !== null) ? v : "";
            });
        },
        Loading: {
            Show: function (SendParametr) {
                var Parametr = {'element': 'body', 'message': $('div#loading_message').html()};
                if (typeof SendParametr != 'undefined') {
                    for (var attrname in SendParametr) {
                        Parametr[attrname] = SendParametr[attrname];
                    }
                }
                var block_parametr = {message: Parametr.message, fadeOut: 1000, overlayCSS: {backgroundColor: '#fff', opacity: 0.8, cursor: 'wait'}, css: {border: 0, padding: '10px 15px', color: '#fff', width: 'auto', left: 'calc(50% - 130px)', backgroundColor: '#333'}};
                if (Parametr.element == 'body') {
                    $.blockUI(block_parametr);
                }
                else {
                    $(Parametr.element).block(block_parametr);
                }

            }, Hide: function (SendParametr) {
                var Parametr = {'element': 'body'};
                if (typeof SendParametr != 'undefined') {
                    for (var attrname in SendParametr) {
                        Parametr[attrname] = SendParametr[attrname];
                    }
                }
                $(Parametr.element).unblock();
            },
        },
        AlertChange: function (SendParametr) {
            var Parametr = {'el': '', 'type': 'error', 'message': '', 'timeout': 6000};
            if (typeof SendParametr != 'undefined') {
                for (var attrname in SendParametr) {
                    Parametr[attrname] = SendParametr[attrname];
                }
            }
            if (Parametr.el == '') {
                var toastrtype = (['error','info','success','warning'].includes(Parametr.type))?Parametr.type:'info';
                toastr[toastrtype](Parametr.message, '', {'timeOut': '5000', positionClass: 'toast-top-left', containerId: 'toast-container', 'progressBar': true,"closeButton": true});
                return false;
            }
            $(Parametr.el).attr('class', 'alert alert-' + Parametr.type).text(Parametr.message).fadeIn();
            setTimeout(function () {
                $(Parametr.el).fadeOut()
            }, Parametr.timeout);
        },
        FindAllElement: function (base) {
            var params = {};
            var count = 0;
            var el_name;
            var el_val;
            $(base + ' :input').each(function (index, o) {
                if ($(o).is(':checkbox:not(:checked)') || $(o).is(':radio:not(:checked)')) {
                    return true;
                }
                el_name = $(o).attr('name');
                if (typeof el_name != 'undefined') {
                    el_val = $(o).val();
                    switch (o.type) {
                        case 'select-multiple':
                            params[el_name] = {};
                            $(base + ' :input[name=\'' + el_name + '\'] :selected').each(function (i, selected) {
                                params[el_name][i] = $(selected).val();
                            });
                            break;
                        case 'radio':
                            if (el_name && unescape(el_val) != '') {
                                params[el_name] = unescape(el_val);
                            }
                            break;
                        default:
                            if ($(base + ' :input[name=\'' + el_name + '\']').length > 1) {
                                (typeof params[el_name] == 'undefined') && (count = 1 , params[el_name] = {});
                                params[el_name][count++] = unescape(el_val);
                            }
                            else {
                                if (el_name && unescape(el_val) != '') {
                                    params[el_name] = unescape(el_val);
                                }
                            }
                            break;
                    }
                }
            });
            return params;
        },
        Operation: function (SendParametr) {
            var Parametr = {
                'url': '', 'data': {}, 'async': false, 'loadingElement': '', 'alertElement': '', 'callback': function (ResData) {
                },
            };
            var RetVal = {type: 'error', 'response': {}};
            if (typeof SendParametr != 'undefined') {
                for (var attrname in SendParametr) {
                    Parametr[attrname] = SendParametr[attrname];
                }
            }
            if (Parametr.loadingElement != '') {
                $(Parametr.loadingElement).fadeIn();
            }
            var urlRegex = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
            var url = new RegExp(urlRegex, 'i');
            var myurl = '';
            if (Parametr.url == '') {
                return false;
            } else {
                if (Parametr.url.length < 2083 && url.test(Parametr.url)) {
                    myurl = Parametr.url;
                } else {
                    myurl = '/api' + (Parametr.url.startsWith("/")?'':'/') +Parametr.url;
                }

            }
            $("input:invalid,textarea:invalid").each(function (index,e) {
                e.setCustomValidity('');
            });
            setTimeout(function () {
                $.ajax({
                    type: 'POST', url: myurl, async: Parametr.async, cache: false, dataType: 'json', data: Parametr.data, headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')}, error: function (jqXHR, textStatus, errorThrown) {
                       
                        if (typeof(Parametr.callback) == 'function') {
                            return Parametr.callback({type: textStatus, 'response': jqXHR});
                        }
                    }, success: function (ResponsData) {
                        if (Parametr.loadingElement != '') {
                            $(Parametr.loadingElement).fadeOut();
                        }
                        if (typeof ResponsData.message != 'undefined' && typeof ResponsData.type != 'undefined') {
                            $.app.ajax.AlertChange({'el': Parametr.alertElement, 'type': ResponsData.type, 'message': ResponsData.message});
                        }
                        if (typeof(Parametr.callback) == 'function') {
                            return Parametr.callback({type: 'success', 'response': ResponsData});
                        }
                    },
                });
            }, 500);

        },
        AjaxDialog: function (SendParametr) {
            var Parametr = {'page': '', 'action': '', 'data': {}, 'prompt': {}};
            if (typeof SendParametr != 'undefined') {
                for (var attrname in SendParametr) {
                    Parametr[attrname] = SendParametr[attrname];
                }
            }
            var page = (Parametr.page == '') ? $.app.url.GetHashVar('p') : Parametr.page;
            if (Parametr.action == '') {
                return false;
            }

            Parametr.prompt['loaded'] = function (e) {
                $.when( $.prompt.disableStateButtons('state0') ).then(function( data, textStatus, jqXHR ) {

                    $.app.ajax.Operation({
                        'page': page, 'action': Parametr.action, 'data': Parametr.data, 'async': true, 'showloading': false, 'callback': function (ResData) {
                            /*if (typeof(ResData.login) != "undefined") {
                                topmsg("عملیات انجام نشد", "لطفا جهت احراز هویت مجدد وارد شوید", "fa-lock", "operation error");
                                dialog.find('.jqiclose').click();
                            }*/
                            if (typeof(ResData.response.type) != 'undefined' && ResData.response.type == 'error' && typeof(ResData.response.message) != 'undefined') {
                                dialog.find('.jqimessage').html(ResData.message);
                            }
                            if (typeof(ResData.type) != 'undefined' && ResData.type == 'success' && typeof(ResData.response.html) != 'undefined') {
                                dialog.find('.jqimessage').html(ResData.response.html);
                                $.prompt.enableStateButtons('state0');
                                return true;
                            }
                            if (typeof(ResData.type) != 'undefined' && ResData.type == 'success') {
                                if (typeof(ResData.response.message) != 'undefined') {
                                    dialog.find('.jqimessage').html('<div class="text-center" dir="ltr">' + ResData.response.message + '</div>');
                                }
                                else {
                                    dialog.find('.jqimessage').html('<h2 class="text-center text-danger">Error</h2>');
                                }
                                $.prompt.disableStateButtons('state0');
                            }
                        },
                    });
                });


            };
            var dialog = $.prompt($('#loading_message').html(), Parametr.prompt);

        },
        /*GetMeta: function (name, lpar = {}, callback) {
            $.app.ajax.Operation({
                'url': '/api/GetAdminMeta', 'async': true, 'message': {'show': false, 'position': 'top-center'}, 'data': {'name': name}, 'LoadingParametr': lpar, 'callback': function (ResponseData) {
                    if (typeof(callback) == 'function') {
                        return callback(ResponseData);
                    }
                },
            });
        },
        SaveMeta: function (name, value, lpar = {}, callback) {
            $.app.ajax.Operation({
                'url': '/api/SaveAdminMeta', 'async': true, 'message': {'show': true, 'position': 'top-center'}, 'data': {'name': name, 'value': value}, 'LoadingParametr': lpar, 'callback': function (ResponseData) {
                    if (typeof(callback) == 'function') {
                        return callback(ResponseData);
                    }
                },
            });
        },*/
    };

})(window, document, jQuery);

;(function (factory) {
    var registeredInModuleLoader;
    if (typeof define === 'function' && define.amd) {
        define(factory);
        registeredInModuleLoader = true;
    }
    if (typeof exports === 'object') {
        module.exports = factory();
        registeredInModuleLoader = true;
    }
    if (!registeredInModuleLoader) {
        var OldCookies = window.Cookies;
        var api = window.Cookies = factory();
        api.noConflict = function () {
            window.Cookies = OldCookies;
            return api;
        };
    }
}(function () {
    function extend () {
        var i = 0;
        var result = {};
        for (; i < arguments.length; i++) {
            var attributes = arguments[ i ];
            for (var key in attributes) {
                result[key] = attributes[key];
            }
        }
        return result;
    }

    function decode (s) {
        return s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
    }

    function init (converter) {
        function api() {}

        function set (key, value, attributes) {
            if (typeof document === 'undefined') {
                return;
            }

            attributes = extend({
                path: '/'
            }, api.defaults, attributes);

            if (typeof attributes.expires === 'number') {
                attributes.expires = new Date(new Date() * 1 + attributes.expires * 864e+5);
            }

            // We're using "expires" because "max-age" is not supported by IE
            attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

            try {
                var result = JSON.stringify(value);
                if (/^[\{\[]/.test(result)) {
                    value = result;
                }
            } catch (e) {}

            value = converter.write ?
                converter.write(value, key) :
                encodeURIComponent(String(value))
                    .replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);

            key = encodeURIComponent(String(key))
                .replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
                .replace(/[\(\)]/g, escape);

            var stringifiedAttributes = '';
            for (var attributeName in attributes) {
                if (!attributes[attributeName]) {
                    continue;
                }
                stringifiedAttributes += '; ' + attributeName;
                if (attributes[attributeName] === true) {
                    continue;
                }

                // Considers RFC 6265 section 5.2:
                // ...
                // 3.  If the remaining unparsed-attributes contains a %x3B (";")
                //     character:
                // Consume the characters of the unparsed-attributes up to,
                // not including, the first %x3B (";") character.
                // ...
                stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
            }

            return (document.cookie = key + '=' + value + stringifiedAttributes);
        }

        function get (key, json) {
            if (typeof document === 'undefined') {
                return;
            }

            var jar = {};
            // To prevent the for loop in the first place assign an empty array
            // in case there are no cookies at all.
            var cookies = document.cookie ? document.cookie.split('; ') : [];
            var i = 0;

            for (; i < cookies.length; i++) {
                var parts = cookies[i].split('=');
                var cookie = parts.slice(1).join('=');

                if (!json && cookie.charAt(0) === '"') {
                    cookie = cookie.slice(1, -1);
                }

                try {
                    var name = decode(parts[0]);
                    cookie = (converter.read || converter)(cookie, name) ||
                        decode(cookie);

                    if (json) {
                        try {
                            cookie = JSON.parse(cookie);
                        } catch (e) {}
                    }

                    jar[name] = cookie;

                    if (key === name) {
                        break;
                    }
                } catch (e) {}
            }

            return key ? jar[key] : jar;
        }

        api.set = set;
        api.get = function (key) {
            return get(key, false /* read as raw */);
        };
        api.getJSON = function (key) {
            return get(key, true /* read as json */);
        };
        api.remove = function (key, attributes) {
            set(key, '', extend(attributes, {
                expires: -1
            }));
        };

        api.defaults = {};

        api.withConverter = init;

        return api;
    }

    return init(function () {});
}));