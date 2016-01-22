'use strict';

// MODULES //

var abs = require( 'math-abs' );
var ln = require( 'math-ln' );
var trunc = require( 'math-trunc' );
var sinPi = require( './sinpi.js' );


// CONSTANTS //

var PI = require( 'const-pi' );
var PINF = require( 'const-pinf-float64' );
var NINF = require( 'const-ninf-float64' );


// GAMMALN //

/**
* NOTE: the original C code, the long comment, copyright, license, and the constants are from [FreeBSD]{@link https://svnweb.freebsd.org/base/release/9.3.0/lib/msun/src/e_lgamma_r.c?revision=268523&view=co}.
*
* The implementation follows the original, but has been modified for JavaScript.
*/

/**
* ====================================================
* Copyright (C) 1993 by Sun Microsystems, Inc. All rights reserved.
*
* Developed at SunPro, a Sun Microsystems, Inc. business.
* Permission to use, copy, modify, and distribute this
* software is freely granted, provided that this notice
* is preserved.
* ====================================================
*/

/**
* __ieee754_lgamma_r(x, signgamp)
*    Reentrant version of the logarithm of the Gamma function
* with user provided pointer for the sign of Gamma(x).
*
* Method:
*   1. Argument Reduction for 0 < x <= 8
*      Since gamma(1+s)=s*gamma(s), for x in [0,8], we may
*      reduce x to a number in [1.5,2.5] by
*              lgamma(1+s) = log(s) + lgamma(s)
*      for example,
*              lgamma(7.3) = log(6.3) + lgamma(6.3)
*                          = log(6.3*5.3) + lgamma(5.3)
*                          = log(6.3*5.3*4.3*3.3*2.3) + lgamma(2.3)
*   2. Polynomial approximation of lgamma around its
*      minimum (ymin=1.461632144968362245) to maintain monotonicity.
*      On [ymin-0.23, ymin+0.27] (i.e., [1.23164,1.73163]), use
*              Let z = x-ymin;
*              lgamma(x) = -1.214862905358496078218 + z**2*poly(z)
*              poly(z) is a 14 degree polynomial.
*   2. Rational approximation in the primary interval [2,3]
*      We use the following approximation:
*              s = x-2.0;
*              lgamma(x) = 0.5*s + s*P(s)/Q(s)
*      with accuracy
*              |P/Q - (lgamma(x)-0.5s)| < 2**-61.71
*      Our algorithms are based on the following observation
*
*                             zeta(2)-1    2    zeta(3)-1    3
* lgamma(2+s) = s*(1-Euler) + --------- * s  -  --------- * s  + ...
*                                 2                 3
*
*      where Euler = 0.5772156649... is the Euler constant, which
*      is very close to 0.5.
*
*   3. For x>=8, we have
*      lgamma(x)~(x-0.5)log(x)-x+0.5*log(2pi)+1/(12x)-1/(360x**3)+....
*      (better formula:
*         lgamma(x)~(x-0.5)*(log(x)-1)-.5*(log(2pi)-1) + ...)
*      Let z = 1/x, then we approximation
*              f(z) = lgamma(x) - (x-0.5)(log(x)-1)
*      by
*                                  3       5             11
*              w = w0 + w1*z + w2*z  + w3*z  + ... + w6*z
*      where
*              |w - f(z)| < 2**-58.74
*
*   4. For negative x, since (G is gamma function)
*              -x*G(-x)*G(x) = pi/sin(pi*x),
*      we have
*              G(x) = pi/(sin(pi*x)*(-x)*G(-x))
*      since G(-x) is positive, sign(G(x)) = sign(sin(pi*x)) for x<0
*      Hence, for x<0, signgam = sign(sin(pi*x)) and
*              lgamma(x) = log(|Gamma(x)|)
*                        = log(pi/(|x*sin(pi*x)|)) - lgamma(-x);
*      Note: one should avoid computing pi*(-x) directly in the
*            computation of sin(pi*(-x)).
*
*   5. Special Cases
*      lgamma(2+s) ~ s*(1-Euler) for tiny s
*      lgamma(1)=lgamma(2)=0
*      lgamma(x) ~ -log(x) for tiny x
*      lgamma(0) = lgamma(inf) = inf
*      lgamma(-integer) = +-inf
*/

var A1 = [
	7.72156649015328655494e-02, // 0x3FB3C467E37DB0C8
	6.73523010531292681824e-02, // 0x3FB13E001A5562A7
	7.38555086081402883957e-03, // 0x3F7E404FB68FEFE8
	1.19270763183362067845e-03, // 0x3F538A94116F3F5D
	2.20862790713908385557e-04, // 0x3F2CF2ECED10E54D
	2.52144565451257326939e-05 // 0x3EFA7074428CFA52
];
var A2 = [
	3.22467033424113591611e-01, // 0x3FD4A34CC4A60FAD
	2.05808084325167332806e-02, // 0x3F951322AC92547B
	2.89051383673415629091e-03, // 0x3F67ADD8CCB7926B
	5.10069792153511336608e-04, // 0x3F40B6C689B99C00
	1.08011567247583939954e-04, // 0x3F1C5088987DFB07
	4.48640949618915160150e-05 // 0x3F07858E90A45837
];
var R = [
	1.0, // placeholder
	1.39200533467621045958e+00, // 0x3FF645A762C4AB74
	7.21935547567138069525e-01, // 0x3FE71A1893D3DCDC
	1.71933865632803078993e-01, // 0x3FC601EDCCFBDF27
	1.86459191715652901344e-02, // 0x3F9317EA742ED475
	7.77942496381893596434e-04, // 0x3F497DDACA41A95B
	7.32668430744625636189e-06 // 0x3EDEBAF7A5B38140
];
var S = [
	-7.72156649015328655494e-02, // 0xBFB3C467E37DB0C8
	2.14982415960608852501e-01,  // 0x3FCB848B36E20878
	3.25778796408930981787e-01,  // 0x3FD4D98F4F139F59
	1.46350472652464452805e-01,  // 0x3FC2BB9CBEE5F2F7
	2.66422703033638609560e-02,  // 0x3F9B481C7E939961
	1.84028451407337715652e-03,  // 0x3F5E26B67368F239
	3.19475326584100867617e-05  // 0x3F00BFECDD17E945
];
var T1 = [
	4.83836122723810047042e-01,  // 0x3FDEF72BC8EE38A2
	-3.27885410759859649565e-02, // 0xBFA0C9A8DF35B713
	6.10053870246291332635e-03,  // 0x3F78FCE0E370E344
	-1.40346469989232843813e-03, // 0xBF56FE8EBF2D1AF1
	3.15632070903625950361e-04  // 0x3F34AF6D6C0EBBF7
];
var T2 = [
	-1.47587722994593911752e-01, // 0xBFC2E4278DC6C509
	1.79706750811820387126e-02,  // 0x3F9266E7970AF9EC
	-3.68452016781138256760e-03, // 0xBF6E2EFFB3E914D7
	8.81081882437654011382e-04,  // 0x3F4CDF0CEF61A8E9
	-3.12754168375120860518e-04 // 0xBF347F24ECC38C38
];
var T3 = [
	6.46249402391333854778e-02,  // 0x3FB08B4294D5419B
	-1.03142241298341437450e-02, // 0xBF851F9FBA91EC6A
	2.25964780900612472250e-03,  // 0x3F6282D32E15C915
	-5.38595305356740546715e-04, // 0xBF41A6109C73E0EC
	3.35529192635519073543e-04  // 0x3F35FD3EE8C2D3F4
];
var U = [
	-7.72156649015328655494e-02, // 0xBFB3C467E37DB0C8
	6.32827064025093366517e-01,  // 0x3FE4401E8B005DFF
	1.45492250137234768737e+00,  // 0x3FF7475CD119BD6F
	9.77717527963372745603e-01,  // 0x3FEF497644EA8450
	2.28963728064692451092e-01,  // 0x3FCD4EAEF6010924
	1.33810918536787660377e-02  // 0x3F8B678BBF2BAB09
];
var V = [
	1.0,
	2.45597793713041134822e+00, // 0x4003A5D7C2BD619C
	2.12848976379893395361e+00, // 0x40010725A42B18F5
	7.69285150456672783825e-01, // 0x3FE89DFBE45050AF
	1.04222645593369134254e-01, // 0x3FBAAE55D6537C88
	3.21709242282423911810e-03 // 0x3F6A5ABB57D0CF61
];
var W = [
	4.18938533204672725052e-01,  // 0x3FDACFE390C97D69
	8.33333333333329678849e-02,  // 0x3FB555555555553B
	-2.77777777728775536470e-03, // 0xBF66C16C16B02E5C
	7.93650558643019558500e-04,  // 0x3F4A019F98CF38B6
	-5.95187557450339963135e-04, // 0xBF4380CB8C0FE741
	8.36339918996282139126e-04,  // 0x3F4B67BA4CDAD5D1
	-1.63092934096575273989e-03 // 0xBF5AB89D0B9E43E4
];
var YMIN = 1.461632144968362245;
var TWO52 = 4503599627370496; // 2**52
var TWO58 = 288230376151711744; // 2**58
var TINY = 8.470329472543003e-22;
var TC = 1.46163214496836224576e+00; // 0x3FF762D86356BE3F
var TF = -1.21486290535849611461e-01; // 0xBFBF19B9BCC38A42
var TT = -3.63867699703950536541e-18; // 0xBC50C7CAA48A971F => TT = -(tail of TF)


/**
* FUNCTION: gammaln( x )
*	Computes the natural logarithm of the gamma function.
*
* @param {Number} x - input value
* @returns {Number} function value
*/
function gammaln( x )  {
	var isNegative;
	var nadj;
	var flg;
	var p3;
	var p2;
	var p1;
	var p;
	var q;
	var t;
	var w;
	var y;
	var z;
	var r;

	// Special cases: NaN
	if ( x !== x ) {
		return x;
	}
	// Special case: +-infinity
	if ( x === PINF || x === NINF ) {
		return x;
	}
	// Special case: 0
	if ( x === 0 ) {
		return PINF;
	}
	if ( x < 0 ) {
		isNegative = true;
		x = -x;
	} else {
		isNegative = false;
	}
	// If |x| < 2**-70, return -ln(|x|)
	if ( x < TINY ) {
		return -ln( x );
	}
	if ( isNegative ) {
		// If |x| >= 2**52, must be -integer
		if ( x >= TWO52 ) { 
			return PINF;
		}
		t = sinPi( x );
		if ( t === 0 ) {
			return PINF;
		}
		nadj = ln( PI / abs( t*x ) );
	}
	// If x equals 1 or 2, return 0
	if ( x === 1 || x === 2 ) { 
		return 0;
	}
	// If x < 2, use lgamma(x) = lgamma(x+1) - log(x)
	if ( x < 2 ) {
		if ( x <= 0.9 ) {
			r = -ln( x );
			
			// 0.7316 <= x <=  0.9
			if ( x >= ( YMIN - 1 + 0.27 ) ) {
				y = 1 - x;
				flg = 0;
			}
			// 0.2316 <= x < 0.7316
			else if ( x >= (YMIN - 1 - 0.27) ) {
				y = x - (TC - 1);
				flg = 1;
			}
			// 0 < x < 0.2316
			else {
				y = x;
				flg = 2;
			}
		} else {
			r = 0;
			
			// 1.7316 <= x < 2
			if ( x >= (YMIN + 0.27) ) {
				y = 2 - x;
				flg = 0;
			}
			// 1.2316 <= x < 1.7316
			else if ( x >= (YMIN - 0.27) ) {
				y = x - TC;
				flg = 1;
			}
			// 0.9 < x < 1.2316
			else {
				y = x - 1;
				flg = 2;
			}
		}
		switch ( flg ) {
		case 0:
			z = y * y;

			// TODO: replace with math-polynomial
			p1 = A1[0] + z*(A1[1]+z*(A1[2]+z*(A1[3]+z*(A1[4]+z*A1[5]))));

			// TODO: replace with math-polynomial
			p2 = z * (A2[0] + z*(+A2[1]+z*(A2[2]+z*(A2[3]+z*(A2[4]+z*A2[5])))));
			p = y*p1 + p2;
			r += ( p - 0.5 * y );
			break;
		case 1:
			z = y * y;
			w = z * y;

			// TODO: replace with math-polynomial
			p1 = T1[0] + w*(T1[1]+w*(T1[2]+w*(T1[3]+w*T1[4])));

			// TODO: replace with math-polynomial
			p2 = T2[0] + w*(T2[1]+w*(T2[2]+w*(T2[3]+w*T2[4])));
			p3 = T3[0] + w*(T3[1]+w*(T3[2]+w*(T3[3]+w*T3[4])));
			p = z*p1 - (TT - w*(p2+y*p3));
			r += ( TF + p );
			break;
		case 2:
			// TODO: replace with math-polynomial:
			p1 = y * (U[0] + y*(U[1]+y*(U[2]+y*(U[3]+y*(U[4]+y*U[5])))));

			// TODO: replace with math-polynomial
			p2 = 1 + y*(V[1]+y*(V[2]+y*(V[3]+y*(V[4]+y*V[5]))));
			r += ( -0.5 * y + p1/p2 );
			break;
		}
	} 
	// 2 <= x < 8
	else if ( x < 8 ) { 
		flg = trunc( x );
		y = x - flg;

		// TODO: replace with math-polynomial
		p = y * (S[0] + y*(S[1]+y*(S[2]+y*(S[3]+y*(S[4]+y*(S[5]+y*S[6]))))));

		// TODO: replace with math-polynomial
		q = 1 + y*(R[1]+y*(R[2]+y*(R[3]+y*(R[4]+y*(R[5]+y*R[6])))));
		r = 0.5*y + p/q;
		z = 1.0; // gammaln(1+s) = ln(s) + gammaln(s)
		switch ( flg ) {
		case 7:
			z *= (y + 6);
			/* falls through */
		case 6:
			z *= (y + 5);
			/* falls through */
		case 5:
			z *= (y + 4);
			/* falls through */
		case 4:
			z *= (y + 3);
			/* falls through */
		case 3:
			z *= ( y + 2 );
			r += ln( z );
		}
	}
	// 8 <= x < 2**58
	else if ( x < TWO58 ) {
		t = ln( x );
		z = 1 / x;
		y = z * z;

		// TODO: replace with math-polynomial
		w = W[0] + z*(W[1]+y*(W[2]+y*(W[3]+y*(W[4]+y*(W[5]+y*W[6])))));
		r = (x-0.5)*(t-1) + w;
	}
	// 2**58 <= x <= Inf
	else {
		r = x * ( ln(x)-1 );
	}
	if ( isNegative ) {
		r = nadj - r;
	}
	return r;
} // end FUNCTION gammaln()


// EXPORTS //

module.exports = gammaln;
