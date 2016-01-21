'use strict';

// MODULES //

var cos = require( 'math-cos' );
var floor = require( 'math-floor' );
var sin = require( 'math-sin' );
var trunc = require( 'math-trunc' );
	

// CONSTANTS //

var PI = require( 'const-pi' );
var TWO52 = 4503599627370496; // 2**52
var TWO53 = 9007199254740992; // 2**53


// SINPI //

/**
* FUNCTION: sinPi( x )
*	Helper function to compute the value of `sine` for negative x.
*
* @param {Number} x - input value
* @returns {Number} function value
*/
function sinPi( x ) {
	var flg;
	var z;
	if ( x < 0.25 ) {
		return -sin( PI * x );
	}
	// Perform argument reduction...
	z = floor( x );

	// Is `x` an integer?
	if ( z === x ) {
		// Check if `x` is larger than the largest possible floating-point integer. If so, the value is always even.
		if ( x >= TWO53 ) {
			x = 0;
			flg = 0;
		} else {
			if ( z < TWO52 ) {
				z += TWO52; // result will still be exact
			} 
			x = z % 2;

			// The following is equivalent to `flg = (x << 2)`, but better to be explicit...
			if ( x === 0 ) {
				flg = 0;
			} else {
				flg = 4;
			}
		}
	}
	// `x` has decimal values...
	else {
		x = x % 2;
		flg = trunc( x * 4 );
	}
	switch ( flg ) {
	case 0:
		x = sin( PI * x );
		break;
	case 1:
	case 2:
		x = cos( PI * (0.5-x) );
		break;
	case 3:
	case 4:
		x = sin( PI * (1-x) );
		break;
	case 5:
	case 6:
		x = -cos( PI * (x-1.5) );
		break;
	default:
		x = sin( PI * (x-2) );
	}
	return -x;
} // end FUNCTION sinPI()


// EXPORTS //

module.exports = sinPi;
