#!/usr/bin/env node

'use strict';

var program = require('commander');
var EqualTemperament = require('./src/systems/et.js');
var Note = require('./src/note.js');
var MusicMath = require('./src/music-math.js');

/**
 * Round a number to a given precision.
 *
 * @param {number} number
 * @param {int=1} decimals
 *
 * @returns {number}
 */
function round(number, decimals) {
    decimals = decimals || 1;
    return decimals === 0
        ? Math.round(number)
        : Math.round(number * 10 * decimals) / (10 * decimals);
}

if (require.main === module) {
    program
        .option('-n, --note <string>', 'The name of the note.', String, 'A4')
        .option('-A <int>', 'The frequency of A4 in Hz.', parseInt, 440)
        .parse(process.argv);
    var note = Note.fromString(program.args[0] !== undefined ? program.args[0] : program.note),
        scale = new EqualTemperament(program.A),
        frequency = scale.getFrequency(note),
        centsOverA = MusicMath.centsOverA(note.getCents(), note.octave);
    console.log("Note: %s", note);
    console.log("%d cents %s A4", centsOverA >= 0 ? centsOverA : - centsOverA, centsOverA >= 0 ? 'above' : 'below');
    console.log("Frequency: %d Hz", round(frequency));
    console.log("Ratio to A4: %s", MusicMath.frequencyToRatio(frequency, program.A).join(':'));
    console.log("String length (on A4 string): %d%", round(MusicMath.centsToStringLength(centsOverA) * 100));
}
