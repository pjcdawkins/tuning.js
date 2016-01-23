#!/usr/bin/env node

'use strict';

var program = require('commander');
var EqualTemperament = require('./lib/systems/et.js');
var Note = require('./lib/note.js');

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
        scale = new EqualTemperament(program.A);
    console.log("%s\t%d Hz", note, round(scale.getFrequency(note)));
}
