'use strict';

// MODULES //

var test = require( 'tape' );
var incrspace = require( 'compute-incrspace' );
var abs = require( 'math-abs' );
var ln = require( 'math-ln' );
var gammaln = require( './../lib' );


// FIXTURES //

var data1 = require( './fixtures/data1.json' );
var expected1 = require( './fixtures/expected1.json' );
var data2 = require( './fixtures/data2.json' );
var expected2 = require( './fixtures/expected2.json' );


// TESTS //

test( 'main export is a function', function test( t ) {
	t.ok( typeof gammaln === 'function', 'main export is a function' );
	t.end();
});

test( 'if provided `NaN`, the function returns `NaN`', function test( t ) {
	var v = gammaln( NaN );
	t.ok( v !== v, 'returns NaN when provided a NaN' );
	t.end();
});

test( 'the function evaluates the natural logarithm of the gamma function (positive integers)', function test( t ) {
	var delta;
	var tol;
	var v;
	var i;

	for ( i = 0; i < data1.length; i++ ) {
		v = gammaln( data1[ i ] );
		delta = abs( v - expected1[ i ] );
		tol = 2.75e-12 * Math.max( 1, abs( v ), abs( expected1[ i ] ) );
		t.ok( delta <= tol, 'within tolerance. x: ' + data1[ i ] + '. Value: ' + v + '. Expected: ' + expected1[ i ] + '. Tolerance: ' + tol + '.' );
	}
	t.end();
});

test( 'the function evaluates the natural logarithm of the gamma function (decimal values)', function test( t ) {
	var delta;
	var tol;
	var v;
	var i;

	for ( i = 0; i < data2.length; i++ ) {
		v = gammaln( data2[ i ] );
		delta = abs( v - expected2[ i ] );
		tol = 2.75e-12 * Math.max( 1, abs( v ), abs( expected2[ i ] ) );
		t.ok( delta <= tol, 'within tolerance. x: ' + data2[ i ] + '. Value: ' + v + '. Expected: ' + expected2[ i ] + '. Tolerance: ' + tol + '.' );
	}
	t.end();
});

test( 'if provided a positive integer, the function returns the natural logarithm of the factorial of (n-1)', function test( t ) {
	t.equal( gammaln( 4 ), ln(6), 'returns ln(6)' );
	t.equal( gammaln( 5 ), ln(24), 'returns ln(24)' );
	t.equal( gammaln( 6 ), ln(120), 'returns ln(120)' );
	t.end();
});
