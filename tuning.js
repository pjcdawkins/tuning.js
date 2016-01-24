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
        .option('-n, --note <string>', 'The name of the note.', String, 'C4')
        .option('-A <int>', 'The frequency of A4 in Hz.', parseInt, 440)
        .parse(process.argv);
    var noteArg = program.args[0] !== undefined ? program.args[0] : program.note,
        note = parseInt(noteArg, 10) == noteArg ? Note.fromCents(noteArg) : Note.fromString(noteArg),
        scale = new EqualTemperament(program.A),
        frequency = scale.getFrequency(note),
        centsOverC = MusicMath.centsOverC(note.getCents(), note.octave);
    console.log("Note: %s", note);
    console.log("Frequency: %d Hz", round(frequency));
    console.log("%d cents %s C4", centsOverC >= 0 ? centsOverC : - centsOverC, centsOverC >= 0 ? 'above' : 'below');
    //console.log("Ratio to A4: %s", MusicMath.frequencyToRatio(frequency, program.A).join(':'));
    console.log('');
    var strings = {
        'Violin E': 1600,
        'Violin A': 900,
        'Violin D': 200,
        'Violin G': -500,
        'Cello A': -300,
        'Viola C': -1200,
        'Cello D': -1000,
        'Cello G': -1700,
        'Cello C': -2400
    };
    for (var string in strings) {
        if (strings.hasOwnProperty(string) && strings[string] <= centsOverC) {
            console.log(
                "String length (on %s string): %d%",
                string,
                round(
                    MusicMath.centsToStringLength(centsOverC - strings[string]) * 100,
                    2
                )
            );
        }
    }
}
