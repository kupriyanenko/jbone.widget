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
        this.id = '.widget' + _id++;
        this.name = name;
        this.el = el;
        this.$el = $(el);
        this._elements = [];
        this.options = {};

        // add reference to the parent class
        if (base) {
            this.super = base;
        }
    };

    $.Widget.prototype = {
        init: function() {
            return this.render();
        },

        render: function() {
            return this;
        },

        /**
         * Gets and Sets an object containing key/value representing the current widget options hash
         * @param {String|Object} String - key for get value or for set key. Object - for set keys/values
         * @param {?=}  Optional argument for set value
         * @return {?=} Optional return value from key
         */
        option: function() {
            var one = arguments.length === 1;
            if (one && typeof arguments[0] === 'string') {
                return this.options[arguments[0]];
            }

            if (one) {
                $.extend(this.options, arguments[0]);
            } else {
                this.options[arguments[0]] = arguments[1];
            }

            return this;
        },

        setMethod: function(methodName, fn) {
            this[methodName] = fn;
        },
        
        on: function($el, options, context) {
            var str,
                eventType;

            this._elements.push($el);

            if (typeof options === 'string') {
                $el.on.call($el, options += this.id, context);

                return this;
            }

            for (str in options) {
                eventType = str.split(/\s+/);
                eventType.push(options[str].bind(context));
                eventType[0] += this.id;

                $el.on.apply($el, eventType);
            }

            return this;
        },

        off: function($el, eventType, fn) {
            $el.off((eventType || '') + this.id, fn);

            return this;
        },

        destroy: function() {
            for (var i in this._elements) {
                this._elements[i].off(this.id);
            }

            this._elements = [];
            this.$el.removeData(this.name);
            delete this.el.widgets[this.name];
            if (!this.el.widgets.length) {
                delete this.el.widgets;
            }

            return this;
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
                action, createWidget, runMethod, result;

            createWidget = function(el) {
                var widget;

                if (el.widgets && el.widgets[name]) {
                    return;
                }

                options = typeof options === 'function' ? options() : options;
                widget = new $.Widget(name, el, base);
                $.extend(widget, _widgets[name]);
                widget.options = $.extend({}, _widgets[name].options, options);
                widget.init(options);

                widget.$el.data(name, widget);
                el.widgets = el.widgets || {};
                el.widgets[name] = widget;
            };

            runMethod = function(el) {
                if (!el.widgets || !el.widgets[name]) {
                    throw new Error('cannot call methods on ' + name + ' prior to initialization; attempted to call method ' + options);
                }

                if (!el.widgets[name][options]) {
                    throw new Error('no such method ' + options + ' for ' + name + ' widget instance');
                } else {
                    return el.widgets[name][options].apply(el.widgets[name], [].slice.call(args, 1));
                }
            };

            if (typeof options === 'string') {
                action = runMethod;
            } else {
                action = createWidget;
            }

            for (; i < length; i++) {
                result = action(this[i]);
            }

            if (options === 'option') {
                return result;
            }

            return this;
        };
    };
}(window.jBone));
