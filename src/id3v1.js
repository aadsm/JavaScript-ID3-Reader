/*
 * JavaScript ID3 Tag Reader 0.1.2
 * Copyright (c) 2008 Jacob Seidelin, cupboy@gmail.com, http://blog.nihilogic.dk/
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 * 
 * Extended by António Afonso (antonio.afonso@opera.com), Opera Software ASA
 * Modified by António Afonso (antonio.afonso gmail.com)
 */

(function(ns) {
    var ID3v1 = ns.ID3v1 = {};
    var genres = [
    	"Blues","Classic Rock","Country","Dance","Disco","Funk","Grunge",
    	"Hip-Hop","Jazz","Metal","New Age","Oldies","Other","Pop","R&B",
    	"Rap","Reggae","Rock","Techno","Industrial","Alternative","Ska",
    	"Death Metal","Pranks","Soundtrack","Euro-Techno","Ambient",
    	"Trip-Hop","Vocal","Jazz+Funk","Fusion","Trance","Classical",
    	"Instrumental","Acid","House","Game","Sound Clip","Gospel",
    	"Noise","AlternRock","Bass","Soul","Punk","Space","Meditative",
    	"Instrumental Pop","Instrumental Rock","Ethnic","Gothic",
    	"Darkwave","Techno-Industrial","Electronic","Pop-Folk",
    	"Eurodance","Dream","Southern Rock","Comedy","Cult","Gangsta",
    	"Top 40","Christian Rap","Pop/Funk","Jungle","Native American",
    	"Cabaret","New Wave","Psychadelic","Rave","Showtunes","Trailer",
    	"Lo-Fi","Tribal","Acid Punk","Acid Jazz","Polka","Retro",
    	"Musical","Rock & Roll","Hard Rock","Folk","Folk-Rock",
    	"National Folk","Swing","Fast Fusion","Bebob","Latin","Revival",
    	"Celtic","Bluegrass","Avantgarde","Gothic Rock","Progressive Rock",
    	"Psychedelic Rock","Symphonic Rock","Slow Rock","Big Band",
    	"Chorus","Easy Listening","Acoustic","Humour","Speech","Chanson",
    	"Opera","Chamber Music","Sonata","Symphony","Booty Bass","Primus",
    	"Porn Groove","Satire","Slow Jam","Club","Tango","Samba",
    	"Folklore","Ballad","Power Ballad","Rhythmic Soul","Freestyle",
    	"Duet","Punk Rock","Drum Solo","Acapella","Euro-House","Dance Hall"
    ];

    ID3v1.loadData = function(data, callback) {
        var length = data.getLength();
        data.loadRange([length-128-1, length], callback);
    }

    ID3v1.readTagsFromData = function(data) {
    	var offset = data.getLength() - 128;
    	var header = data.getStringAt(offset, 3);
    	if (header == "TAG") {
    		var title = data.getStringAt(offset + 3, 30).replace(/\0/g, "");
    		var artist = data.getStringAt(offset + 33, 30).replace(/\0/g, "");
    		var album = data.getStringAt(offset + 63, 30).replace(/\0/g, "");
    		var year = data.getStringAt(offset + 93, 4).replace(/\0/g, "");

    		var trackFlag = data.getByteAt(offset + 97 + 28);
    		if (trackFlag == 0) {
    			var comment = data.getStringAt(offset + 97, 28).replace(/\0/g, "");
    			var track = data.getByteAt(offset + 97 + 29);
    		} else {
    			var comment = "";
    			var track = 0;
    		}

    		var genreIdx = data.getByteAt(offset + 97 + 30);
    		if (genreIdx < 255) {
    			var genre = genres[genreIdx];
    		} else {
    			var genre = "";
    		}

    		return {
    		    "version" : '1.1',
    			"title" : title,
    			"artist" : artist,
    			"album" : album,
    			"year" : year,
    			"comment" : comment,
    			"track" : track,
    			"genre" : genre
    		}
    	} else {
    		return {};
    	}
    };
    
    // Export functions for closure compiler
    ns["ID3v1"] = ns.ID3v1;
})(this);