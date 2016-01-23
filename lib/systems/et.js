var Note = require('../note.js');

/**
 * An equal temperament tuning system.
 *
 * @param {int=440} A
 */
var EqualTemperament = function (A) {
    this.A = A || 440;
};

EqualTemperament.prototype = {
    /**
     * Get the frequency of a note.
     *
     * @param {Note} note
     *
     * @returns {number}
     */
    getFrequency: function (note) {
        var getSteps = function (fromNote, toNote) {
                return toNote.getCents() - fromNote.getCents() + (1200 * (toNote.octave - fromNote.octave));
            },
            factor = Math.pow(2, 1 / 1200),
            steps = getSteps(Note.fromString('A4'), note);
        return this.A * Math.pow(factor, steps);
    }
};

module.exports = EqualTemperament;
