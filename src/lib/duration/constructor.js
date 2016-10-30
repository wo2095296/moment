import { normalizeObjectUnits } from '../units/aliases';
import { getLocale } from '../locale/locales';
import isDurationValid from './valid.js';
import extend from '../utils/extend';

export function Duration (duration) {
    var normalizedInput = normalizeObjectUnits(duration),
        years = normalizedInput.year || 0,
        quarters = normalizedInput.quarter || 0,
        months = normalizedInput.month || 0,
        weeks = normalizedInput.week || 0,
        days = normalizedInput.day || 0,
        hours = normalizedInput.hour || 0,
        minutes = normalizedInput.minute || 0,
        seconds = normalizedInput.second || 0,
        milliseconds = normalizedInput.millisecond || 0;

    if (isDuration(duration)) {
        copyDuration(this, duration);
        return this;
    }
    this._isValid = isDurationValid(normalizedInput);

    // representation for dateAddRemove
    this._milliseconds = +milliseconds +
        seconds * 1e3 + // 1000
        minutes * 6e4 + // 1000 * 60
        hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
    // Because of dateAddRemove treats 24 hours as different from a
    // day when working around DST, we need to store them separately
    this._days = +days +
        weeks * 7;
    // It is impossible to translate months into days without knowing
    // which months you are are talking about, so we have to store
    // it separately.
    this._months = +months +
        quarters * 3 +
        years * 12;

    this._data = {};

    this._locale = getLocale();

    // _bubble returns a new Duration because immutability,
    // but here in the constructor we need to update `this` with the new values
    var bubbled = this._bubble();
    copyDuration(this, bubbled);
}

export function isDuration (obj) {
    return obj instanceof Duration;
}

function copyDuration(to, from) {
    to._milliseconds = from._milliseconds;
    to._days = from._days;
    to._months = from._months;
    to._data = extend({}, from._data);
    to._locale = from._locale;
}
