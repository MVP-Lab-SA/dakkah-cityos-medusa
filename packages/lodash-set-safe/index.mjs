// ESM version of lodash.set safe
var FUNC_ERROR_TEXT = 'Expected a function';
var INFINITY = 1 / 0;
var MAX_SAFE_INTEGER = 9007199254740991;
var NAN = 0 / 0;
var symbolTag = '[object Symbol]';

var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
var reEscapeChar = /\\(\\)?/g;
var reIsUint = /^(?:0|[1-9]\d*)$/;
var reTrim = /^\s+|\s+$/g;
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
var reIsBinary = /^0b[01]+$/i;
var reIsOctal = /^0o[0-7]+$/i;

var freeParseInt = parseInt;

var objectProto = Object.prototype;
var toString = objectProto.toString;

var DANGEROUS_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

function isArray(value) {
  return Array.isArray(value);
}

function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && toString.call(value) == symbolTag);
}

function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = (value < 0 ? -1 : 1);
    return sign * 1.7976931348623157e+308;
  }
  return value === value ? value : 0;
}

function toInteger(value) {
  var result = toFinite(value),
      remainder = result % 1;
  return result === result ? (remainder ? result - remainder : result) : 0;
}

function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return /^\w*$/.test(value) || !/\.|\[/.test(value) ||
    (object != null && value in Object(object));
}

function stringToPath(string) {
  var result = [];
  string.replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
}

function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

function castPath(value, object) {
  if (isArray(value)) {
    return value;
  }
  return isKey(value, object) ? [value] : stringToPath(String(value));
}

function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(Object.prototype.hasOwnProperty.call(object, key) && (objValue === value || (objValue !== objValue && value !== value))) ||
      (value === undefined && !(key in object))) {
    object[key] = value;
  }
}

function baseSet(object, path, value, customizer) {
  if (!isObject(object)) {
    return object;
  }
  path = castPath(path, object);

  var index = -1,
      length = path.length,
      lastIndex = length - 1,
      nested = object;

  while (nested != null && ++index < length) {
    var key = toKey(path[index]),
        newValue = value;

    if (DANGEROUS_KEYS.has(key)) {
      return object;
    }

    if (index != lastIndex) {
      var objValue = nested[key];
      newValue = customizer ? customizer(objValue, key, nested) : undefined;
      if (newValue === undefined) {
        newValue = isObject(objValue)
          ? objValue
          : (isIndex(path[index + 1]) ? [] : {});
      }
    }
    assignValue(nested, key, newValue);
    nested = nested[key];
  }
  return object;
}

function set(object, path, value) {
  return object == null ? object : baseSet(object, path, value);
}





export default set;
export { set };
