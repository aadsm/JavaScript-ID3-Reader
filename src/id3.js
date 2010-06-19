/*
 * JavaScript ID3 Tag Reader 0.1.2
 * Copyright (c) 2008 Jacob Seidelin, cupboy@gmail.com, http://blog.nihilogic.dk/
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 * 
 * Extended by António Afonso (antonio.afonso@opera.com), Opera Software ASA
 * Modified by António Afonso <antonio.afonso gmail.com>
 */

var ID3 = {};

(function() {
	var files = [];
    
    function getReader(data) {
        // FIXME: improve this detection according to the spec
        return data.getStringAt(4, 7) == "ftypM4A" ? ID4 :
               (data.getStringAt(0, 3) == "ID3" ? ID3v2 : ID3v1);
    }
    
	function readFileDataFromAjax(url, callback) {
	    BufferedBinaryAjax(url, function(http) {
			var reader = getReader(http.binaryResponse);
			var range = reader.readID3Range(http.binaryResponse);
		    if( range ) http.binaryResponse.loadRange(range);
		    if( callback ) callback(reader, http.binaryResponse);
		});
	}

    function readFileDataFromFileSystem(url, callback) {
        ReadFile(
            url,
            function(file) {
                var reader = getReader(file);
				if (callback) callback(reader, file);
				file.close();
            }
        )
    }
    
    ID3.loadTags = function(url, cb, tags) {
		function read(reader, data) {
	        var tagsFound = reader.readTagsFromData(data, tags);
	        //console.log("Downloaded data: " + data.getDownloadedBytesCount() + "bytes");
	        // FIXME: add, don't override
			files[url] = tagsFound;
			if (cb) cb();
	    }
	    
	    // FIXME: should be able to receive a string instead
		if( /^mountpoint:\/\//.test(url) ) {
		    readFileDataFromFileSystem(url, read);
		} else {
		    readFileDataFromAjax(url, read);
		}
	}

	ID3.getAllTags = function(url) {
		if (!files[url]) return null;
        
		var tags = {};
		for (var a in files[url]) {
			if (files[url].hasOwnProperty(a))
				tags[a] = files[url][a];
		}
		return tags;
	}

	ID3.getTag = function(url, tag) {
		if (!files[url]) return null;

		return files[url][tag];
	}	
})();

