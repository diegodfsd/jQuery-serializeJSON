/*
* jQuery plugin to serialize HTML form into a javascript object
* Version: 0.0.1.beta
*
* Copyright (c) 2013 Diego Dias
*  
* Usage:
* $("form").serializeJSON();
*
*/

(function ($) {
    $.fn.serializeJSON = function () {
        var json = {},
            self = this;

        var parse = function (destination, propertyName, propertyValue, ownerName) {
            var nestedProperties = propertyName.split('.'),
                currentProperty = nestedProperties[0],
                name = currentProperty.replace(/\[(\d)+\]/, '');

            if (nestedProperties.length > 1) {
                if (!destination[name]) {
                    destination[name] = currentProperty.indexOf('[') == -1 ? {} : [];
                }
                parse(destination[name], nestedProperties.slice(1).join('.'), propertyValue, currentProperty);
            }
            else {
                if (destination instanceof Array) {
                    var index = parseInt((ownerName.match(/\[(\d)+\]/) || [])[1] || '0', 10),
                        exists = !!destination[index],
                        obj = destination[index] || { };

                    obj[name] = propertyValue;

                    if (!exists) {
                        destination.push(obj);
                    }
                }
                else {
                    destination[name] = propertyValue;
                }
            }
        };

        $.map($(this).serializeArray(), function (input, i) {
            parse.apply(self, [json, input.name, input.value]);
        });

        return json;
    };
})(jQuery);