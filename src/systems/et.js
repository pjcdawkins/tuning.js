var Note = require('../note.js');
var MusicMath = require('../music-math.js');

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
        return MusicMath.centsToFrequency(
            MusicMath.centsOverC(note.getCents(), note.octave) - 900,
            this.A
        );
    }
};

module.exports = EqualTemperament;
