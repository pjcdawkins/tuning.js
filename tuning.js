#!/usr/bin/env nodejs

'use strict';

var program = require('commander');

/**
 * A note.
 *
 * @param string noteString
 *   A note represented by scientific pitch notation, e.g. C4.
 */
var Note = function (noteString) {
  console.assert(noteString.match(/^[A-Ga-g] ?([b#sf]|(sharp|flat))? ?[0-9]?$/), 'Invalid note "' + noteString + '"');
  this.name = noteString[0].toUpperCase();
  this.accidental = noteString.replace(/^[A-Ga-g] ?[0-9]?/, '').replace('f', 'b').replace('s', '#')[0] || '';
  // @todo allow octaves below 0 or above 9
  this.octave = noteString.match(/[0-9]$/) ? parseInt(noteString.charAt(noteString.length - 1), 10) : 4;
  this.pitchClass = this.pitchClasses[this.name + this.accidental];
};

Note.prototype = {
  pitchClasses: {'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4, 'E#': 5, 'Fb': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11, 'B#': 0, 'Cb': 11},
  toString: function () {
    return this.name + this.accidental + this.octave;
  },
  transpose: function (interval) {
    var newPc = this.pitchClass + interval,
      octaveMultiplier = Math.floor(newPc / 12),
      newName,
      noteName;
    if (newPc > 11 || newPc < 0) {
      newPc -= 12 * octaveMultiplier;
    }
    // @todo sort out preference order
    for (noteName in this.pitchClasses) {
      if (this.pitchClasses[noteName] === newPc) {
        newName = noteName;
        break;
      }
    }
    newName += (this.octave + octaveMultiplier);
    return new Note(newName);
  }
};

/**
 * A temperament system.
 *
 * @param int division
 * @param Note fundamental
 * @param int A
 */
var Temperament = function (division, fundamental, A) {
  this.division = division;
  this.fundamental = fundamental;
  this.smallestInterval = 1200 / this.division;
  this.A = A;
};

Temperament.prototype = {
  // @todo make this work for non-ET
  getFrequency: function (note) {
    var getSteps = function (fromNote, toNote) {
        return toNote.pitchClass - fromNote.pitchClass + (12 * (toNote.octave - fromNote.octave));
      },
      factor = Math.pow(2, 1 / 12),
      steps = getSteps(new Note('A4'), note);
    return this.A * Math.pow(factor, steps);
  }
};

if (require.main === module) {
  program
    .option('-n, --note <string>', 'The name of the note.', String, 'C4')
    .option('-f, --fundamental <string>', 'The name of the fundamental.', String, 'C2')
    .option('-d, --division <int>', 'The octave division (12 for ET).', parseInt, 12)
    .option('-A <int>', 'The frequency of A4 in Hz.', parseInt, 440)
    .parse(process.argv);
  var note = new Note(program.args[0] !== undefined ? program.args[0] : program.note),
    temperament = new Temperament(program.division, new Note(program.fundamental), program.A),
    newNote;
  for (var i = 0; i <= 12; i++) {
    newNote = note.transpose(i);
    console.log("%s: %s Hz", newNote, temperament.getFrequency(newNote));
  }
}
else {
  module.exports.Note = Note;
  module.exports.Temperament = Temperament;
}
