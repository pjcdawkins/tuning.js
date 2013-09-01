#!/usr/bin/nodejs

'use strict';

var commander = require('commander');

/**
 * A note.
 *
 * @param string noteString
 *   A note represented by scientific pitch notation, e.g. C4.
 */
var Note = function (noteString) {
  var notePitchClasses = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11};
  console.assert(noteString.match(/^[A-Ga-g] ?([b#sf]|(sharp|flat))? ?[0-9]?$/), 'Invalid note "' + noteString + '"');
  this.name = noteString[0].toUpperCase();
  this.accidental = noteString.replace(/^[A-Ga-g] ?[0-9]?/, '').replace('b', 'f').replace('#', 's')[0] || 0;
  // @todo allow octaves below 0 or above 9
  this.octave = noteString.match(/[0-9]$/) ? parseInt(noteString.charAt(noteString.length - 1), 10) : 4;
  this.pitchClass = notePitchClasses[this.name];
  switch (this.accidental) {
    case 's':
      this.pitchClass++;
      if (this.name === 'B' || this.name === 'E') {
        this.name = this.name === 'B' ? 'C' : 'F';
        this.accidental = 0;
        if (this.name === 'C') {
          this.octave++;
        }
      }
      break;
    case 'f':
      this.pitchClass--;
      if (this.name === 'F' || this.name === 'C') {
        this.name = this.name === 'F' ? 'E' : 'B';
        this.accidental = 0;
      }
      break;
  }
  if (this.pitchClass >= 12) {
    this.pitchClass -= 12;
  }
  if (this.pitchClass < 0) {
    this.pitchClass = 12 + this.pitchClass;
  }
};

Note.prototype = {
  toString: function () {
    var accidentalNames = {'f': 'b', 's': '#'},
      accidentalName = '' ;
    if (accidentalNames[this.accidental] !== undefined) {
      accidentalName = accidentalNames[this.accidental];
    }
    return this.name + accidentalName + this.octave;
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
      factor = Math.pow(2, 1/12),
      steps = getSteps(new Note('A4'), note);
    return this.A * Math.pow(factor, steps);
  }
};

if(require.main === module) {
  commander
    .option('-n, --note <string>', 'The name of the note.', String, 'C4')
    .option('-f, --fundamental <string>', 'The name of the fundamental.', String, 'C2')
    .option('-d, --division <int>', 'The octave division (12 for ET).', parseInt, 12)
    .option('-A <int>', 'The frequency of A4 in Hz.', parseInt, 440)
    .parse(process.argv);
  console.assert(commander.note !== undefined, 'No note specified.');
  var note = new Note(commander.note),
    temperament = new Temperament(commander.division, new Note(commander.fundamental), commander.A);
  console.log("Frequency of %s: %s Hz", note, temperament.getFrequency(note));
}
