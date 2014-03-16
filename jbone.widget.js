/*!
 * jBone.widget v0.0.1 - 2014-03-16 - Widget factory for jBone
 *
 * https://github.com/kupriyanenko/jbone.widget
 *
 * Copyright 2014 Alexey Kupriyanenko
 * Released under the MIT license.
 */

(function($) {
    var _id = 0,
        _widgets = {};

    $.Widget = function(name, el, base) {
        this.id = _id++;
        this.el = el;
        this.$el = $(el);
        this._elements = [];

        // add reference to the parent class
        if (base) {
            this.super = base;
        }
    };

    $.Widget.prototype = {
        init: function() {
            this.render();
        },

        render: function() {
            return this;
        },

        on: function($el, options) {
            var callback, eventType;

            for (eventType in options) {
                this._elements.push($el);
                $el.on(eventType + ".widget" + this.id, options[eventType]);
            }
        },

        off: function($el, eventType, fn) {
            $el.off(eventType || "" + ".widget" + this.id, fn);
        },

        destroy: function() {
            for (var i in this._elements) {
                this._elements[i].off(".widget" + this.id);
            }

            this._elements = [];
            delete this.el.widget;
        }
    };

    $.widget = function(name, base, protoProps) {
        if (protoProps) {
            base = _widgets[base];
        } else {
            protoProps = base;
            base = undefined;
        }

        _widgets[name] = $.extend({}, base, protoProps);

        return $.fn[name] = function(options) {
            var i = 0,
                length = this.length,
                args = arguments,
                action, createWidget, callMethod;

            createWidget = function(el) {
                var widget;

                if (el.widgets && el.widgets[name]) {
                    return;
                }

                widget = new $.Widget(name, el, base);
                $.extend(widget, _widgets[name]);
                widget.options = typeof widget.options === "function" ? widget.options() : widget.options;
                $.extend(widget.options, options);
                widget.init(widget.options);

                el.widgets = el.widgets || {};
                el.widgets[name] = widget;
            };

            callMethod = function(el) {
                if (!el.widgets || !el.widgets[name]) {
                    throw new Error("cannot call methods on " + name + " prior to initialization; attempted to call method " + options);
                }

                try {
                    el.widgets[name][options].apply(el.widgets[name], [].slice.call(args, 1));
                } catch (error) {
                    throw new Error("no such method " + options + " for " + name + " widget instance");
                }
            };

            if (typeof options === "string") {
                action = callMethod;
            } else {
                action = createWidget;
            }

            for (; i < length; i++) {
                action(this[i]);
            }

            return this;
        };
    };
}(window.jBone));
