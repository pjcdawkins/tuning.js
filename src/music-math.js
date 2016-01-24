/**
 * Convert two frequencies to a number of cents.
 *
 * @param {number} lowerFrequency
 * @param {number} upperFrequency
 *
 * @return {number}
 */
function frequenciesToCents(lowerFrequency, upperFrequency) {
    return 1200 * Math.log(lowerFrequency / upperFrequency) / Math.log(2);
}

/**
 * Convert a number of cents over a base to a frequency.
 *
 * @param {number} cents
 * @param {number} base
 *
 * @return {number}
 */
function centsToFrequency(cents, base) {
    return base * Math.pow(2, cents / 1200);
}

/**
 * Convert a number of cents to a difference from C4.
 *
 * @param {number} cents
 *   The number of cents above C4.
 * @param {number=4} octave
 *   The octave in scientific pitch notation.
 *
 * @return {number}
 *   The number of cents above C4.
 */
function centsOverC(cents, octave) {
    octave = typeof octave !== "undefined" ? octave : 4;

    return cents + 1200 * (octave - 4);
}

/**
 * Convert a string length to a number of cents.
 *
 * @param {number} stringLength
 */
function stringLengthToCents(stringLength) {
    return 1200 * Math.log(1 / stringLength) / Math.log(2);
}

/**
 * Convert a frequency to a string length.
 *
 * @param {number} cents
 */
function centsToStringLength(cents) {
    return 1 / Math.pow(2, cents / 1200);
}

/**
 * Convert a frequency to a simplified ratio.
 *
 * @param {number} frequency
 * @param {number} base
 *
 * @returns Array
 */
function frequencyToRatio(frequency, base) {
    function getGcd(x, y) {
        var z, d = x;
        while (y != 0) {
            z = d % y;
            d = y;
            y = z;
        }

        return d;
    }
    var gcd = getGcd(frequency, base),
        ratio = [base / gcd, frequency / gcd];

    return base <= frequency ? ratio : ratio.reverse();
}

module.exports = {
    'frequenciesToCents': frequenciesToCents,
    'centsToFrequency': centsToFrequency,
    'stringLengthToCents': stringLengthToCents,
    'centsOverC': centsOverC,
    'centsToStringLength': centsToStringLength
};
