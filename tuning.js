#!/usr/bin/env nodejs

'use strict';

var program = require('commander');
var noteNames = require('./note-names.js');

/**
 * A note.
 *
 * @param noteString string
 *   A note represented by scientific pitch notation, e.g. C4.
 */
var Note = function (noteString) {
  console.assert(noteString.match(/^[A-Ga-g] ?[\+\-]? ?([b#sf]|(sharp|flat))? ?[\+\-]? ?[0-9]?$/), 'Invalid note "' + noteString + '"');
  this.name = noteString[0].toUpperCase();
  this.accidental = noteString.replace(/^[A-Ga-g] ?[0-9]?/, '').replace('f', 'b').replace('s', '#')[0] || '';
  // @todo allow octaves below 0 or above 9
  this.octave = noteString.match(/[0-9]$/) ? parseInt(noteString.charAt(noteString.length - 1), 10) : 4;
  this.cents = noteNames[this.name + this.accidental];
};

Note.prototype = {
  toString: function () {
    return this.name + this.accidental + this.octave;
  },
  transpose: function (interval) {
    var newCents = this.cents + interval * 100,
      octaveMultiplier = Math.floor(newCents / 1200),
      newName,
      noteName;
    if (newCents > 1150 || newCents < 0) {
      newCents -= 1200 * octaveMultiplier;
    }
    // @todo sort out preference order
    for (noteName in noteNames) {
      if (noteNames[noteName] === newCents) {
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
        return toNote.cents - fromNote.cents + (1200 * (toNote.octave - fromNote.octave));
      },
      factor = Math.pow(2, 1 / 1200),
      steps = getSteps(new Note('A4'), note);
    return this.A * Math.pow(factor, steps);
  }
};

if (require.main === module) {
  program
    .option('-n, --note <string>', 'The name of the note.', String, 'A4')
    .option('-f, --fundamental <string>', 'The name of the fundamental.', String, 'A4')
    .option('-d, --division <int>', 'The octave division (1200 for ET).', parseInt, 1200)
    .option('-A <int>', 'The frequency of A4 in Hz.', parseInt, 440)
    .parse(process.argv);
  var note = new Note(program.args[0] !== undefined ? program.args[0] : program.note),
    temperament = new Temperament(program.division, new Note(program.fundamental), program.A),
    newNote;
  for (var i = 0; i <= 48; i++) {
    newNote = note.transpose(i / 2);
    console.log("%s\t%s Hz", newNote, Math.round(temperament.getFrequency(newNote) * 10) / 10);
  }
}
else {
  module.exports.Note = Note;
  module.exports.Temperament = Temperament;
}
