// Modified version of http://www.webtoolkit.info/javascript-base64.html
(function(ns) {
    ns.Base64 = {
    	// private property
    	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    	// public method for encoding
    	encodeBytes : function (input) {
    		var output = "";
    		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    		var i = 0;

    		while (i < input.length) {

    			chr1 = input[i++];
    			chr2 = input[i++];
    			chr3 = input[i++];

    			enc1 = chr1 >> 2;
    			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    			enc4 = chr3 & 63;

    			if (isNaN(chr2)) {
    				enc3 = enc4 = 64;
    			} else if (isNaN(chr3)) {
    				enc4 = 64;
    			}

    			output = output +
    			Base64._keyStr.charAt(enc1) + Base64._keyStr.charAt(enc2) +
    			Base64._keyStr.charAt(enc3) + Base64._keyStr.charAt(enc4);

    		}

    		return output;
    	}
    };
    
    // Export functions for closure compiler
    ns["Base64"] = ns.Base64;
    ns.Base64["encodeBytes"] = ns.Base64.encodeBytes;
})(this);