var noteNames = require('./note-names.js');
var assert = require('assert');

var Note = function () {
    assert.ok(arguments.callee.caller !== null, 'Use a factory method to create a Note');
    this.name = 'A';
    this.accidental = '';
    this.octave = 4;
};

/**
 * Create a note from a string.
 *
 * @param {String} noteString
 *   A note represented by scientific pitch notation, e.g. C4.
 *
 * @return {Note}
 */
Note.fromString = function (noteString) {
    // @todo create note from frequency or ratio.
    var matches = noteString.match(/^([A-Ga-g])(([b#sfx]|(bb| ?sharp| ?flat| ?double sharp| ?double flat))?([\+\-]|(quarter flat|quarter sharp))?)? ?(\-?[0-9]+)?$/);
    assert.ok(matches !== null, 'Invalid note "' + noteString + '"');
    var note = new this();
    note.name = matches[1].toUpperCase();
    note.accidental = '';
    if (typeof matches[2] !== "undefined") {
        note.accidental = matches[2]
          .trim()
          .replace('double sharp', 'x')
          .replace('double flat', 'bb')
          .replace('quarter sharp', '+')
          .replace('quarter flat', '-')
          .replace('f', 'b')
          .replace('s', '#');
    }
    note.octave = typeof matches[7] !== "undefined" ? parseInt(matches[7], 10) : 4;

    return note;
};

/**
 * Create a note from a cents value.
 *
 * @param {number} cents
 *   A number of cents above C4.
 *
 * @return {Note}
 */
Note.fromCents = function (cents) {
    for (var noteName in noteNames) {
        if (noteNames.hasOwnProperty(noteName) && noteNames[noteName] == cents) {
            break;
        }
    }
    assert.ok(noteName, 'Note name not found (cents: ' + cents + ')');

    return Note.fromString(noteName);
};

Note.prototype = {
    /**
     * Get the string representation of this note.
     *
     * @returns {string}
     */
    toString: function () {
        return '' + this.name + this.accidental + (this.accidental == '-' ? ' ' : '') + this.octave;
    },
    /**
     * Get the cents value of this note, assuming 12-tone equal temperament.
     *
     * The cents value can be used for transpositions.
     *
     * @returns {int}
     */
    getCents: function () {
        if (typeof noteNames[this.name + this.accidental] !== "undefined") {
            return noteNames[this.name + this.accidental];
        }
        else if (this.accidental === "bb") {
            var previousNoteName = String.fromCharCode(this.name.charCodeAt(0) - 1);
            if (this.name === 'C' || this.name === 'F') {
                return noteNames[previousNoteName + 'b'];
            }
            else {
                return noteNames[previousNoteName];
            }
        }
        else if (this.accidental === "x") {
            var nextNoteName = String.fromCharCode(this.name.charCodeAt(0) + 1);
            if (this.name === 'B' || this.name === 'E') {
                return noteNames[nextNoteName + '#'];
            }
            else {
                return noteNames[nextNoteName];
            }
        }
        else {
            throw new Error('Note cents value not found for note "' + this.toString() + '"');
        }
    },
    /**
     * Transpose a note up by an interval.
     *
     * @param {number} interval
     * @returns {Note}
     */
    transpose: function (interval) {
        var newCents = this.getCents() + interval * 100,
            octaveMultiplier = Math.floor(newCents / 1200),
            newNote;
        if (newCents > 1150 || newCents < 0) {
            newCents -= 1200 * octaveMultiplier;
        }
        newNote =  Note.fromCents(newCents);
        newNote.octave = this.octave + octaveMultiplier;

        return newNote;
    }
};

module.exports = Note;
