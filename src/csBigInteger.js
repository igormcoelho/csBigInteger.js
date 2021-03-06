// C# Big Integer implementation on javascript
// Igor M. Coelho, Copyleft 2018 - MIT License
// This class sketch was initially inspired by http://silentmatt.com/biginteger
// This class uses indutny 'bn.js' library to handle internal Big Number representations

(function (exports) {
	"use strict";

	// storing internal information on javascript BN library
	const BN = require('bn.js');

	// function utils
	function assert(val, msg) {
		if (!val) throw new Error(msg || 'Assertion failed');
	}

	/*
		Constructor: csBigInteger()
		Convert a value to a <csBigInteger>.
	
		Although <csBigInteger()> is the constructor for <csBigInteger> objects, it is
		best not to call it as a constructor. If *n* is a <csBigInteger> object, it is
		simply returned as-is. Otherwise, <csBigInteger()> is equivalent to <parse>
		without a radix argument.
	
		> var n0 = csBigInteger();      // Same as <csBigInteger.ZERO>
		> var n1 = csBigInteger("123"); // Create a new <csBigInteger> with value 123
		> var n2 = csBigInteger(123);   // Create a new <csBigInteger> with value 123
	  > var n2 = csBigInteger(127);   // Create a new <csBigInteger> with value 127
	  > var n2 = csBigInteger(128);   // Create a new <csBigInteger> with value 128
	  > var n2 = csBigInteger(-1);   // Create a new <csBigInteger> with value -1
		> var n3 = csBigInteger(n2);    // Return n2, unchanged (immutable)
	
		The constructor form only takes a value *n* that must be a number, string or
		bytearray of numbers (0..255) in little-endian order.
	  The array is *not copied and
		may be modified*. If the array contains only zeros, the sign parameter
		is ignored and is forced to zero.
	
	  > new csBigInteger([5]): create a new csBigInteger with value 5
	  > var n2 = csBigInteger([127]);   // Create a new <csBigInteger> with value 127
	  > var n2 = csBigInteger([128]);   // Create a new <csBigInteger> with value -128
	  > new csBigInteger([251]): create a new csBigInteger with value -5 (fb)
	  > new csBigInteger([251, 0]): create a new csBigInteger with value 251 (fb00)
	
		The hexstring is always passed on big-endian order, with parameter 16.
		> new csBigInteger("00fb", 16): create a new csBigInteger with value 251
	
		The hexstring can also be passed, with base 16, starting with prefix "0x".
		> new csBigInteger("0x00fb", 16): create a new csBigInteger with value 251
	
		Parameters:
	
			n - Value to convert to a <csBigInteger>.
	
		Returns:
	
			A <csBigInteger> value.
	
		See Also:
	
			<parse>, <csBigInteger>
	*/
	function csBigInteger(n, base = 10) {
		//console.log(typeof n);
		if (n instanceof csBigInteger)
			return n; // immutable
		else if (typeof n === "undefined")
			return ZERO; // empty constructor: csBigInteger()
		else if ((typeof n === "string") || (Object.prototype.toString.call(n) === '[object Array]')) {
			//console.log("WILL PARSE!!!");
			return csBigInteger.parse(n, base);
		}
		else if (n instanceof BN) {
			//console.log("INPUT IS BIGNUM!");
			this._data = n; // big number
		}
		else { // (typeof n === "number")
			//console.log("INPUT IS NUMBER!");
			var jsNum = Math.round(n); // will round it to integer
			assert(Number.isSafeInteger(jsNum), "csBigInteger assertion failed: unsafe number");
			this._data = new BN(jsNum); // assuming JavaScript number
		}
	}

	csBigInteger._construct = function (n) {
		return new csBigInteger(n);
	};

	var ZERO = new csBigInteger(0);
	// Constant: ZERO
	// <csBigInteger> 0.
	csBigInteger.ZERO = ZERO;

	var ONE = new csBigInteger(1);
	// Constant: ONE
	// <csBigInteger> 1.
	csBigInteger.ONE = ONE;

	var M_ONE = new csBigInteger(-1);
	// Constant: M_ONE
	// <csBigInteger> -1.
	csBigInteger.M_ONE = M_ONE;

	// Constant: _0
	// Shortcut for <ZERO>.
	csBigInteger._0 = ZERO;

	// Constant: _1
	// Shortcut for <ONE>.
	csBigInteger._1 = ONE;


	/*
		Method: toString
		Convert a <csBigInteger> to a string.
	
		When *base* is greater than 10, letters are upper case.
	
		Parameters:
	
			base - Optional base to represent the number in (default is base 10, but can be 2 or 16).
						 base 16 will start with prefix "0x", and will represent a big-endian hex string.
	
		Returns:
	
			The string representation of the <csBigInteger>.
	*/
	csBigInteger.prototype.toString = function (base = 10) {
		// get little endian byte array
		var data = this.toByteArray();
		// allowing bases 2, 10 and 16
		if (!((base == 2) || (base == 10) || (base == 16))) {
			throw new Error("csBigInteger only supports bases 2, 10 or 16: unsupported base " + base + ".");
		}

		// base 10
		if (base == 10)
			return this._data.toString();

		// binary
		if (base == 2)
			return this._data.toString(2);

		// base == 16
		// big-endian hexstring
		var shex = "";
		for (var i = data.length - 1; i >= 0; i--) {
			var sbyte = data[i].toString(16);
			if (sbyte.length < 2)
				sbyte = "0" + sbyte;
			shex += sbyte;
		}

		// big-endian hex string
		return "0x" + shex;
	};


	/*
		Function: parse
		Parse a string or little-endian byte array into a <csBigInteger>.
	
		- "0x" or "0X": *base* = 16
		- "0b": *base* = 2 (?)
		- else: *base* = 10
	
		Parameters:
	
			s - The string to parse.
		base - Optional (default is 10)
	
		Returns:
	
			a <csBigInteger> instance.
	*/
	csBigInteger.parse = function (n, base = 10) {
		if (Object.prototype.toString.call(n) === '[object Array]') {
			if (n.length == 0)
				return ZERO;
			// little-endian input array
			// [251, 0] -> "0x00fb" -> 251
			s = "";
			for (var i = 0; i < n.length; i++) {
				var dig = n[i].toString(16);
				if (dig.length == 1)
					dig = "0" + dig;
				s = s + dig;
			}
			// convert to big-endian hexstring
			s = csBigInteger.revertHexString(s);
			return csBigInteger.parse(s, 16);
		} // end little-endian array

		// input n is string
		var s = n.toString().toLowerCase().replace(/\W-/g, '');

		// base 10
		if (base == 10) {
			return new csBigInteger(new BN(s.replace(/[^0-9-]/gi, ''), 10));
		}

		// binary
		if (base == 2) {
			return new csBigInteger(new BN(s.replace(/[^0-1]/gi, ''), 2));
		}

		s = s.replace(/[^0-9a-fx]/gi, '');
		// base 16
		if (s.length < 2) // single hex digit
			return new csBigInteger(new BN(s, 16));

		// after v4.0, every base-16 string input is BIG ENDIAN (with or without '0x' prefix)
		// this is simpler and safer for everyone (also better sticks to C# and C++ standards)

		// big-endian (must remove prefix '0x')
		if ((s[0] == "0") && (s[1] == "x")) {
			s = s.substr(2); // remove '0x
		}

		// convert to little-endian
		s = csBigInteger.revertHexString(s);

		// verify if number is negative (most significant bit)
		if (csBigInteger.checkNegativeBit(s)) {
			// is negative, must handle twos-complement
			var vint = new BN(csBigInteger.revertHexString(s), 16, 'be');
			var rbitnum = vint.toString(2);
			// negate bits
			var y2 = "";
			for (var i = 0; i < rbitnum.length; i++)
				y2 += rbitnum[i] == '0' ? '1' : '0';
			var finalnum = new BN(y2, 2).add(new BN(1)).mul(new BN(-1));
			return new csBigInteger(finalnum);
		}
		else // positive is easy (assume big-endian)
			return new csBigInteger(new BN(csBigInteger.revertHexString(s), 16, 'be'));

		// little-endian: BN(..., 'le') is currently with a known bug... using revertHexString instead
		//return new csBigInteger(new BN(csBigInteger.revertHexString(s), 16, 'be'));//csBigInteger.lehex2bigint(s));
	};


	// invert hexstring (little/big endians)
	csBigInteger.revertHexString = function (hex) {
		// if needs padding
		if (hex.length % 2 == 1)
			hex = '0' + hex; // TODO: beware if that makes sense for negative... perhaps 'f' is better

		var reverthex = "";
		for (var i = 0; i < hex.length - 1; i += 2)
			reverthex = "" + hex.substr(i, 2) + reverthex;
		return reverthex;
	};

	// checkNegativeBit returns true if hex string is negative (meaning that last bit is set)
	// Examples:
	// checkNegativeBit("ff") is true
	// checkNegativeBit("7f") is false
	// checkNegativeBit("ff00") is false
	csBigInteger.checkNegativeBit = function (leHexStr) {
		// check negative bit
		var y = leHexStr.slice(leHexStr.length - 2, leHexStr.length + 2);
		//console.log("base="+y);
		// detect negative values
		var bitnum = parseInt(y, 16).toString(2);
		//console.log("bitnum="+bitnum);
		// -1389293829382
		return (bitnum.length == 8) && (bitnum[0] == "1");
	}

	/*
		Function: toByteArray
		Converts the biginteger value to little-endian byte array
	
		Returns:
	
			a big-endian byte array instance.
	*/
	csBigInteger.prototype.toByteArray = function () {
		//console.log("toByteArray = "+this._data);
		var hval = this.toHexString();
		var array = [];
		for (var i = 0; i < hval.length - 1; i += 2)
			array.push(parseInt(hval.substr(i, 2), 16));
		return array;
	};

	/*
		Function: tohexString
		Converts the biginteger value to little-endian hexstring
	
		Returns:
	
			a little-endian hex string
	*/
	csBigInteger.prototype.toHexString = function () {
		var bigint = this._data;

		if (!bigint.isNeg()) {
			// positive numbers
			var bihex = bigint.toString(16);
			if (bihex.length % 2 == 1)
				bihex = "0" + bihex;
			// must convert to little-endian
			bihex = csBigInteger.revertHexString(bihex);
			if (csBigInteger.checkNegativeBit(bihex))
				bihex = bihex + "00"; // very special situations where a positive looks like negative
			return bihex;
		}
		else {
			// negative numbers
			//console.log("NEGATIVE: "+bigint);

			/*
			// https://msdn.microsoft.com/en-us/library/system.numerics.biginteger(v=vs.110).aspx
			The BigInteger structure assumes that negative values are stored by using two's complement representation. Because the BigInteger structure represents a numeric value with no fixed length, the BigInteger(Byte[]) constructor always interprets the most significant bit of the last byte in the array as a sign bit. To prevent the BigInteger(Byte[]) constructor from confusing the two's complement representation of a negative value with the sign and magnitude representation of a positive value, positive values in which the most significant bit of the last byte in the byte array would ordinarily be set should include an additional byte whose value is 0. For example, 0xC0 0xBD 0xF0 0xFF is the little-endian hexadecimal representation of either -1,000,000 or 4,293,967,296. Because the most significant bit of the last byte in this array is on, the value of the byte array would be interpreted by the BigInteger(Byte[]) constructor as -1,000,000. To instantiate a BigInteger whose value is positive, a byte array whose elements are 0xC0 0xBD 0xF0 0xFF 0x00 must be passed to the constructor.
			*/
			//x=-1000000; // must become (big endian) "f0bdc0" => little endian C0 BD F0  (careful with positive 4,293,967,296 that may become negative, need to be C0 BD F0 FF 00)
			// ASSERT (x < 0) !!! x==0 is problematic! equals to 256...
			//x=-1; // ff => 0x ff
			//x=-2; // fe => 0x fe
			//x=-127; // 81 => 0x 81
			//x=-255; // "ff01" => 0x 01 ff
			//x=-256; // "ff00" => 0x 00 ff
			//x=-257; // "feff" => 0x ff fe
			//x=-128; // "ff80" => 0x 80 ff
			// only for negative integers
			var x = bigint.mul(new BN(-1)); // turn into positive
			//console.log("POSITIVE:" +x);
			// ========================
			// perform two's complement
			// ========================
			// convert to binary
			var y = x.toString(2);
			//console.log("BINARY:" +y);
			//console.log("FIRST BINARY: "+y);
			// extra padding for limit cases (avoid overflow)
			y = "0" + y;
			//guarantee length must be at least 8, or add padding!
			while ((y.length < 8) || (y.length % 8 != 0)) {
				//console.log("ADDING PADDING 1!");
				y = "0" + y;
			}
			//console.log("BINARY AFTER PADDING:" +y);
			// invert bits
			var y2 = "";
			for (var i = 0; i < y.length; i++)
				y2 += y[i] == '0' ? '1' : '0';
			//console.log("SECOND BINARY: "+y2);
			// go back to int
			var y3 = new BN(y2, 2);
			//console.log("INT is "+y3);
			// sum 1
			y3 = y3.add(new BN(1));
			//console.log("INT is after sum "+y3);
			// convert to binary again
			var y4 = y3.toString(2);
			//guarantee length must be at least 8, or add padding!
			while (y4.length < 8) {
				//console.log("ADDING PADDING!");
				y4 = "0" + y4;
			}
			// convert to big-endian hex string
			var y5 = new BN(y4, 2).toString(16);
			// convert to little-endian
			return csBigInteger.revertHexString(y5);
		}
	};

	/*
		Function: valueOf
		Convert a <csBigInteger> to a native JavaScript integer.
	
		This is called automatically by JavaScript to convert a <BigInteger> to a
		native value. Will fail if number is JavaScript unsafe (around 53 bits ~7 bytes).
	
		Returns:
	
			> parseInt(this.toString(), 10)
	
		See Also:
	
			<toString>, <toJSValue>
	*/
	csBigInteger.prototype.valueOf = function () {
		// convert to JavaScript number
		var jsNum = this._data.toNumber();
		assert(Number.isSafeInteger(jsNum), "csBigInteger assertion failed: unsafe number");
		return jsNum; // number is safe
	};

	// returns internal Big Number
	csBigInteger.prototype.asBN = function () {
		return this._data;
	};

	exports.csBigInteger = csBigInteger;
})(typeof exports !== 'undefined' ? exports : this);

