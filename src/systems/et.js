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
            MusicMath.centsOverA(note.getCents(), note.octave),
            this.A
        );
    }
};

module.exports = EqualTemperament;
