'use strict';

// MODULES //

var tape = require( 'tape' );
var pow = require( 'math-power' );
var sinPi = require( './../lib/sinpi.js' );


// TESTS //

tape( 'main export is a function', function test( t ) {
	t.ok( typeof sinPi === 'function', 'main export is a function' );
	t.end();
});

tape( 'if provided `NaN`, the function returns `NaN`', function test( t ) {
	var v = sinPi( NaN );
	t.ok( v !== v, 'returns NaN when provided a NaN' );
	t.end();
});

tape( 'if provided `x > 2^53`, the function returns `0`', function test( t ) {
	var v = sinPi( pow( 2, 54 ) );
	t.ok( v === 0, 'returns 0 when provided x=2^54' );
	t.end();
});

tape( 'if provided `x > 2^52`, the function returns `0`', function test( t ) {
	var v = sinPi( pow( 2, 52 ) + 2 );
	t.ok( v === 0, 'returns 0 when provided x=2^52+2' );
	t.end();
});

tape( 'if provided `x < 2^52`, the function returns `0`', function test( t ) {
	var v = sinPi( pow( 2, 51 ) );
	t.ok( v === 0, 'returns 0 when provided x=2^51' );
	t.end();
});
