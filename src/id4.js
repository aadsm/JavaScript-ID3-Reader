/*
 * Support for iTunes-style m4a tags
 * See:
 *   http://atomicparsley.sourceforge.net/mpeg-4files.html
 *   http://developer.apple.com/mac/library/documentation/QuickTime/QTFF/Metadata/Metadata.html
 * Authored by Joshua Kifer <joshua.kifer gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

(function(ns) {
    var ID4 = ns.ID4 = {};
    
    ID4.types = {
        '0'     : 'uint8',
        '1'     : 'text',
        '13'    : 'jpeg',
        '14'    : 'png',
        '21'    : 'uint8'
    };
    ID4.atom = {
        '©alb': ['album'],
        '©art': ['artist'],
        '©ART': ['artist'],
        'aART': ['artist'],
        '©day': ['year'],
        '©nam': ['title'],
        '©gen': ['genre'],
        'trkn': ['track'],
        '©wrt': ['composer'],
        '©too': ['encoder'],
        'cprt': ['copyright'],
        'covr': ['picture'],
        '©grp': ['grouping'],
        'keyw': ['keyword'],
        '©lyr': ['lyrics'],
        '©gen': ['genre']
    };

    ID4.loadData = function(data, callback) {
        // load the header of the first block
        data.loadRange([0, 7], function () {
            loadAtom(data, 0, data.getLength(), callback);
        });
    };

    /**
     * Make sure that the [offset, offset+7] bytes (the block header) are
     * already loaded before calling this function.
     */
    function loadAtom(data, offset, length, callback) {
        // 8 is the size of the atomSize and atomName fields.
        // When reading the current block we always read 8 more bytes in order
        // to also read the header of the next block.
        var atomSize = data.getLongAt(offset, true);
        if (atomSize == 0) return callback();
        var atomName = data.getStringAt(offset + 4, 4);
        
        // Container atoms
        if (['moov', 'udta', 'meta', 'ilst'].indexOf(atomName) > -1)
        {
            if (atomName == 'meta') offset += 4; // next_item_id (uint32)
            data.loadRange([offset+8, offset+8 + 8], function() {
                loadAtom(data, offset + 8, atomSize - 8, callback);
            });
        } else {
            // Value atoms
            var readAtom = atomName in ID4.atom;
            data.loadRange([offset+(readAtom?0:atomSize), offset+atomSize + 8], function() {
                loadAtom(data, offset+atomSize, length, callback);
            });
        }       
    };

    ID4.readTagsFromData = function(data) {
        var tag = {};
        readAtom(tag, data, 0, data.getLength());
        return tag;
    };

    function readAtom(tag, data, offset, length, indent)
    {
        indent = indent === undefined ? "" : indent + "  ";
        var seek = offset;
        while (seek < offset + length)
        {
            var atomSize = data.getLongAt(seek, true);
            if (atomSize == 0) return;
            var atomName = data.getStringAt(seek + 4, 4);
            // Container atoms
            if (['moov', 'udta', 'meta', 'ilst'].indexOf(atomName) > -1)
            {
                if (atomName == 'meta') seek += 4; // next_item_id (uint32)
                readAtom(tag, data, seek + 8, atomSize - 8, indent);
                return;
            }
            // Value atoms
            if (ID4.atom[atomName])
            {
                var klass = data.getInteger24At(seek + 16 + 1, true);
                var atom = ID4.atom[atomName];
                var type = ID4.types[klass];
                if (atomName == 'trkn')
                {
                    tag[atom[0]] = data.getByteAt(seek + 16 + 11);
                    tag['count'] = data.getByteAt(seek + 16 + 13);
                }
                else
                {
                    // 16: name + size + "data" + size (4 bytes each)
                    // 4: atom version (1 byte) + atom flags (3 bytes)
                    // 4: NULL (usually locale indicator)
                    var dataStart = seek + 16 + 4 + 4;
                    var dataEnd = atomSize - 16 - 4 - 4;
                    switch( type ) {
                        case 'text': 
                            tag[atom[0]] = data.getStringWithCharsetAt(dataStart, dataEnd, "UTF-8");
                            break;
                            
                        case 'uint8':
                            tag[atom[0]] = data.getShortAt(dataStart);
                            break;
                            
                        case 'jpeg':
                        case 'png':
                            tag[atom[0]] = {
                                format  : "image/" + type,
                                data    : data.getBytesAt(dataStart, dataEnd)
                            };
                            break;
                    }
                }
            }
            seek += atomSize;
        }
    }
    
    // Export functions for closure compiler
    ns["ID4"] = ns.ID4;
})(this);
