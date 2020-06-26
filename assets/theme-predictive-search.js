this.Shopify = this.Shopify || {}, this.Shopify.theme = this.Shopify.theme || {}, this.Shopify.theme.PredictiveSearch = function() {
    "use strict";
    function h() {
        var t = Error.call(this);
        return t.name = "Server error", t.message = "Something went wrong on the server", t.status = 500, t
    }
    function p(t) {
        var e = Error.call(this);
        return e.name = "Not found", e.message = "Not found", e.status = t, e
    }
    function f() {
        var t = Error.call(this);
        return t.name = "Server error", t.message = "Something went wrong on the server", t.status = 500, t
    }
    function l(t) {
        var e = Error.call(this);
        return e.name = "Content-Type error", e.message = "Content-Type was not provided or is of wrong type", e.status = t, e
    }
    function y(t) {
        var e = Error.call(this);
        return e.name = "JSON parse error", e.message = "JSON syntax error", e.status = t, e
    }
    function d(t, e, r, s) {
        var n = Error.call(this);
        return n.name = e, n.message = r, n.status = t, n.retryAfter = s, n
    }
    function v(t, e, r) {
        var s = Error.call(this);
        return s.name = e, s.message = r, s.status = t, s
    }
    function g(t, e, r) {
        var s = Error.call(this);
        return s.name = e, s.message = r, s.status = t, s
    }
    function e(t) {
        this._store = {}, this._keys = [], t && t.bucketSize ? this.bucketSize = t.bucketSize : this.bucketSize = 20
    }
    function r() {
        this.events = {}
    }
    function s(t) {
        this.eventName = t, this.callbacks = []
    }
    function o(s, n) {
        var i = "";
        return n = n || null, Object.keys(s).forEach(function(t) {
            var e, r = t + "=";
            switch (n && (r = n + "[" + t + "]"), e = s[t], Object.prototype.toString.call(e).slice(8, -1).toLowerCase()) {
                case "object":
                    i += o(s[t], n ? r : t);
                    break;
                case "array":
                    i += r + "=" + s[t].join(",") + "&";
                    break;
                default:
                    n && (r += "="), i += r + encodeURIComponent(s[t]) + "&"
            }
        }), i
    }
    e.prototype.set = function(t, e) {
        if (this.count() >= this.bucketSize) {
            var r = this._keys.splice(0, 1);
            this.delete(r)
        }
        return this._keys.push(t), this._store[t] = e, this._store
    }, e.prototype.get = function(t) {
        return this._store[t]
    }, e.prototype.has = function(t) {
        return Boolean(this._store[t])
    }, e.prototype.count = function() {
        return Object.keys(this._store).length
    }, e.prototype.delete = function(t) {
        var e = Boolean(this._store[t]);
        return delete this._store[t], e && !this._store[t]
    }, r.prototype.on = function(t, e) {
        var r = this.events[t];
        r || (r = new s(t), this.events[t] = r), r.registerCallback(e)
    }, r.prototype.off = function(t, e) {
        var r = this.events[t];
        r && -1 < r.callbacks.indexOf(e) && (r.unregisterCallback(e), 0 === r.callbacks.length && delete this.events[t])
    }, r.prototype.dispatch = function(t, e) {
        var r = this.events[t];
        r && r.fire(e)
    }, s.prototype.registerCallback = function(t) {
        this.callbacks.push(t)
    }, s.prototype.unregisterCallback = function(t) {
        var e = this.callbacks.indexOf(t); - 1 < e && this.callbacks.splice(e, 1)
    }, s.prototype.fire = function(e) {
        this.callbacks.slice(0).forEach(function(t) {
            t(e)
        })
    };
    var n, i, a, c = (n = function(t, o, a, c) {
        var u = new XMLHttpRequest;
        u.onreadystatechange = function() {
            if (u.readyState !== XMLHttpRequest.DONE);
            else {
                var t = u.getResponseHeader("Content-Type");
                if (500 <= u.status) return void c(new f);
                if (404 === u.status) return void c(new p(u.status));
                if ("string" != typeof t || null === t.toLowerCase().match("application/json")) return void c(new l(u.status));
                if (417 === u.status) {
                    try {
                        var e = JSON.parse(u.responseText);
                        c(new v(u.status, e.message, e.description))
                    } catch (t) {
                        c(new y(u.status))
                    }
                    return
                }
                if (422 === u.status) {
                    try {
                        var r = JSON.parse(u.responseText);
                        c(new g(u.status, r.message, r.description))
                    } catch (t) {
                        c(new y(u.status))
                    }
                    return
                }
                if (429 === u.status) {
                    try {
                        var s = JSON.parse(u.responseText);
                        c(new d(u.status, s.message, s.description, u.getResponseHeader("Retry-After")))
                    } catch (t) {
                        c(new y(u.status))
                    }
                    return
                }
                if (200 === u.status) {
                    try {
                        var n = JSON.parse(u.responseText);
                        n.query = o, a(n)
                    } catch (t) {
                        c(new y(u.status))
                    }
                    return
                }
                try {
                    var i = JSON.parse(u.responseText);
                    c(new h(u.status, i.message, i.description))
                } catch (t) {
                    c(new y(u.status))
                }
            }
        }, u.open("get", "/search/suggest.json?q=" + encodeURIComponent(o) + "&" + t), u.setRequestHeader("Content-Type", "application/json"), u.send()
    }, i = 10, a = null, function() {
        var t = this,
            e = arguments;
        clearTimeout(a), a = setTimeout(function() {
            a = null, n.apply(t, e)
        }, i || 0)
    });
    function t(t) {
        if (!t) throw new TypeError("No config object was specified");
        this._retryAfter = null, this._currentQuery = null, this.dispatcher = new r, this.cache = new e({
            bucketSize: 40
        }), this.configParams = o(t)
    }
    function u(t) {
        return "string" != typeof t ? null : t.trim().replace(" ", "-").toLowerCase()
    }
    return t.TYPES = {
        PRODUCT: "product",
        PAGE: "page",
        ARTICLE: "article"
    }, t.FIELDS = {
        AUTHOR: "author",
        BODY: "body",
        PRODUCT_TYPE: "product_type",
        TAG: "tag",
        TITLE: "title",
        VARIANTS_BARCODE: "variants.barcode",
        VARIANTS_SKU: "variants.sku",
        VARIANTS_TITLE: "variants.title",
        VENDOR: "vendor"
    }, t.UNAVAILABLE_PRODUCTS = {
        SHOW: "show",
        HIDE: "hide",
        LAST: "last"
    }, t.prototype.query = function(t) {
        try {
            ! function(t) {
                var e;
                if (null == t) throw (e = new TypeError("'query' is missing")).type = "argument", e;
                if ("string" != typeof t) throw (e = new TypeError("'query' is not a string")).type = "argument", e
            }(t)
        } catch (t) {
            return void this.dispatcher.dispatch("error", t)
        }
        if ("" === t) return this;
        this._currentQuery = u(t);
        var e = this.cache.get(this._currentQuery);
        return e ? this.dispatcher.dispatch("success", e) : c(this.configParams, t, function(t) {
            this.cache.set(u(t.query), t), u(t.query) === this._currentQuery && (this._retryAfter = null, this.dispatcher.dispatch("success", t))
        }.bind(this), function(t) {
            t.retryAfter && (this._retryAfter = t.retryAfter), this.dispatcher.dispatch("error", t)
        }.bind(this)), this
    }, t.prototype.on = function(t, e) {
        return this.dispatcher.on(t, e), this
    }, t.prototype.off = function(t, e) {
        return this.dispatcher.off(t, e), this
    }, t
}();