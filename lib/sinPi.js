'use strict';

// MODULES //

var cos = require( 'math-cos' ),
	floor = require( 'math-floor' ),
	sin = require( 'math-sin' ),
	float64bits = require( 'math-float64-bits' ),
	trunc = require( 'math-trunc' );

// CONSTANTS //

var PI = require( 'const-pi' );


// SINPI //

/**
* FUNCTION: sinPi( x )
*	Helper function for negative x.
*
* @param {Number} x - input value
* @returns {Number} function value
*/
function sinPi( x ) {
	var Two52 = 4503599627370496,
		Two53 = 9007199254740992,
		z;

	if ( x < 0.25 ) {
		return -sin( PI * x );
	}

	// argument reduction
	z = floor( x );
	var n;
	if ( z !== x ) { // inexact
		x = x % 2;
		n = trunc( x * 4 );
	} else {
		if ( x >= Two53 ) { // x must be even
			x = 0;
			n = 0;
		} else {
			if ( x < Two52 ) {
				z = x + Two52; // exact
			}
			n =  1 & float64bits( z );
			x = n;
			n <<= 2;
		}
	}
	switch ( n ) {
	case 0:
		x = sin( PI * x );
	break;
	case 1:
	case 2:
		x = cos( PI * (0.5 - x) );
	break;
	case 3:
	case 4:
		x = sin( PI * (1 - x) );
	break;
	case 5:
	case 6:
		x = -cos( PI * (x - 1.5) );
	break;
	default:
		x = sin( PI * (x - 2) );
	}
	return -x;
} // end FUNCTION sinPI()


// EXPORTS //

module.exports = sinPi;
