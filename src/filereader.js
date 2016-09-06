/**
 * Copyright (c) 2010 António Afonso, antonio.afonso gmail, http://www.aadsm.net/
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 *
 */

var BinaryFile = require('./binaryfile')

var FileAPIReader = function(file, opt_reader) {
    return function(url, fncCallback, fncError) {
        var reader = opt_reader || new FileReader();

        reader.onload = function(event) {
            var result = event.target.result;
            fncCallback(new BinaryFile(result));
        };
        reader.onerror = fncError;
        reader.readAsBinaryString(file);
    }
};

module.exports = FileAPIReader;
