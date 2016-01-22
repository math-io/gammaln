gammaln
===
[![NPM version][npm-image]][npm-url] [![Build Status][build-image]][build-url] [![Coverage Status][coverage-image]][coverage-url] [![Dependencies][dependencies-image]][dependencies-url]

> [Natural logarithm][ln] of the [gamma][gamma-function] function.


## Installation

``` bash
$ npm install math-gammaln
```


## Usage

``` javascript
var gammaln = require( 'math-gammaln' );
```


#### gammaln( x )

Evaluates the [natural logarithm][ln] of the [gamma function][gamma-function].

``` javascript
var val = gammaln( 2 );
// returns 0

val = gammaln( 4 );
// returns ~1.792

val = gammaln( -1/2 );
// returns ~1.266

val = gammaln( 1/2 );
// returns ~0.572
```


## Examples

``` javascript
var linspace = require( 'compute-linspace' );
var gammaln = require( 'math-gammaln' );

var x = linspace( -10, 10, 100 );
var v;
var i;

for ( i = 0; i < x.length; i++ ) {
	v = gammaln( x[ i ] );
	console.log( 'x: %d, f(x): %d', x[ i ], v );
}
```

To run the example code from the top-level application directory,

``` bash
$ node ./examples/index.js
```


---
## Tests

### Unit

This repository uses [tape][tape] for unit tests. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul][istanbul] as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ make view-cov
```


### Browser Support

This repository uses [Testling][testling] for browser testing. To run the tests in a (headless) local web browser, execute the following command in the top-level application directory:

``` bash
$ make test-browsers
```

To view the tests in a local web browser,

``` bash
$ make view-browser-tests
```

<!-- [![browser support][browsers-image]][browsers-url] -->


---
## License

[MIT license](http://opensource.org/licenses/MIT).


## Copyright

Copyright &copy; 2016. The [Compute.io][compute-io] Authors.


[npm-image]: http://img.shields.io/npm/v/math-gammaln.svg
[npm-url]: https://npmjs.org/package/math-gammaln

[build-image]: http://img.shields.io/travis/math-io/gammaln/master.svg
[build-url]: https://travis-ci.org/math-io/gammaln

[coverage-image]: https://img.shields.io/codecov/c/github/math-io/gammaln/master.svg
[coverage-url]: https://codecov.io/github/math-io/gammaln?branch=master

[dependencies-image]: http://img.shields.io/david/math-io/gammaln.svg
[dependencies-url]: https://david-dm.org/math-io/gammaln

[dev-dependencies-image]: http://img.shields.io/david/dev/math-io/gammaln.svg
[dev-dependencies-url]: https://david-dm.org/dev/math-io/gammaln

[github-issues-image]: http://img.shields.io/github/issues/math-io/gammaln.svg
[github-issues-url]: https://github.com/math-io/gammaln/issues

[tape]: https://github.com/substack/tape
[istanbul]: https://github.com/gotwarlost/istanbul
[testling]: https://ci.testling.com

[compute-io]: https://github.com/compute-io/
[gamma-function]: https://github.com/math-io/gamma
[ln]: https://github.com/math-io/ln
