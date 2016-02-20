'use strict';

// MODULES //

var tape = require( 'tape' );
var abs = require( 'math-abs' );
var ln = require( 'math-ln' );
var pow = require( 'math-power' );
var gammaln = require( './../lib' );


// CONSTANTS //

var PINF = require( 'const-pinf-float64' );
var NINF = require( 'const-ninf-float64' );


// FIXTURES //

var data1 = require( './fixtures/data1.json' );
var expected1 = require( './fixtures/expected1.json' );
var data2 = require( './fixtures/data2.json' );
var expected2 = require( './fixtures/expected2.json' );


// TESTS //

tape( 'main export is a function', function test( t ) {
	t.equal( typeof gammaln, 'function', 'main export is a function' );
	t.end();
});

tape( 'if provided `NaN`, the function returns `NaN`', function test( t ) {
	var v = gammaln( NaN );
	t.ok( v !== v, 'returns NaN when provided a NaN' );
	t.end();
});

tape( 'the function returns `infinity` when provided `infinity`', function test( t ) {
	var v = gammaln( PINF );
	t.equal( v, PINF, 'returns +Inf when provided +Inf' );

	v = gammaln( NINF );
	t.equal( v, NINF, 'returns -Inf when provided -Inf' );

	t.end();
});

tape( 'the function returns `+infinity` when provided `0`' , function test( t ) {
	var v = gammaln( 0 );
	t.equal( v, PINF, 'returns +Inf when provided 0' );
	t.end();
});

tape( 'the function returns `+infinity` for x smaller than `-2^52`' , function test( t ) {
	var v = gammaln(  -pow( 2, 53 ) );
	t.equal( v, PINF, 'returns +Inf when provided 2^53' );
	t.end();
});


tape( 'the function returns `-ln(x)` for very small x' , function test( t ) {
	var x;
	var v;

	x = 2e-90;
	v = gammaln( x );
	t.equal( v, -ln( x ), 'equals -ln(x)' );

	t.end();
});

tape( 'the function evaluates the natural logarithm of the gamma function (positive integers)', function test( t ) {
	var delta;
	var tol;
	var v;
	var i;

	for ( i = 0; i < data1.length; i++ ) {
		v = gammaln( data1[ i ] );
		delta = abs( v - expected1[ i ] );
		tol = 4.75e-15 * Math.max( 1, abs( v ), abs( expected1[ i ] ) );
		t.ok( delta <= tol, 'within tolerance. x: ' + data1[ i ] + '. Value: ' + v + '. Expected: ' + expected1[ i ] + '. Tolerance: ' + tol + '.' );
	}
	t.end();
});

tape( 'the function evaluates the natural logarithm of the gamma function (decimal values)', function test( t ) {
	var delta;
	var tol;
	var v;
	var i;

	for ( i = 0; i < data2.length; i++ ) {
		v = gammaln( data2[ i ] );
		delta = abs( v - expected2[ i ] );
		tol = 2.5e-12 * Math.max( 1, abs( v ), abs( expected2[ i ] ) );
		t.ok( delta <= tol, 'within tolerance. x: ' + data2[ i ] + '. Value: ' + v + '. Expected: ' + expected2[ i ] + '. Tolerance: ' + tol + '.' );
	}
	t.end();
});

tape( 'the function evaluates the natural logarithm of the gamma function for x > 2^58', function test( t ) {
	var x;
	var v;

	x = pow( 2, 59 );
	v = gammaln( x );
	t.equal( v, x * (ln(x)-1), 'returns x*(ln(x)-1) for x>2^58' );

	t.end();
});

tape( 'if provided a positive integer, the function returns the natural logarithm of the factorial of (n-1)', function test( t ) {
	t.equal( gammaln( 4 ), ln(6), 'returns ln(6)' );
	t.equal( gammaln( 5 ), ln(24), 'returns ln(24)' );
	t.equal( gammaln( 6 ), ln(120), 'returns ln(120)' );
	t.end();
});

tape( 'returns `+infinity` for `x=-2^51`', function test( t ) {
	var v = gammaln( -pow( 2, 51 ) );
	t.equal( v, PINF, 'returns +Infinity when provided x=-2^51' );
	t.end();
});
