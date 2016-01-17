:warning: This project has been superseded by [jsmediatags](https://github.com/aadsm/jsmediatags) and is no longer under maintainance, the reasons:
* Browser and node support ([find it on npm](https://www.npmjs.com/package/jsmediatags)).
* Better code structure
* Extensible
* Unit tests

Use this [guide](https://github.com/aadsm/jsmediatags#javascript-id3-reader) to migrate to `jsmediatags`.

JavaScript ID3 Reader
=====================

This library was originally made by Jacob Seidelin using ID3v1 for demo'ing his BinaryAjax library [http://www.nihilogic.dk/labs/id3/].
It was then extended by me (António Afonso) to include the ID3v2 tag specification [http://www.id3.org/id3v2.4.0-structure], while I was working at Opera Software, in the context of the Unite Media Player application which was developed using server side JavaScript.
Joshua Kifer implemented the tag reader for the QuickTime metadata information found in aac files.
A new BufferedBinaryFile was created that extends BinaryFile in a way that only required data will be downloaded from the server. This makes it possible to read tag structures such as the Quicktime metadata without having to download the entire file as it was happening in previous versions of this library.

Demo: http://www.aadsm.net/libraries/id3/#demo

Technical Information
---------------------

This library will only download the relevant data from the mp3 file whenever the webserver supports the HTTP Range feature, otherwise the entire file will be downloaded at the cost of degrading the performance of the library.
Another caveat is on the Opera browser, since it lacks support for setting the Range header, the entire file will be downloaded.
This library is not complete and there is still some features missing and/or going on:

* Unsynchronisation support
* CommonJS support
* Support for other types of charsets, at the moment only latin1, UTF-8 and UTF-16 are supported, these are the ones defined in the specification. However, the usage of local charsets has been common for a long time specially in Russia, Japan and China. This support can be achieved using [chardet](http://github.com/aadsm/jschardet) and a proper string reader function.

How To Use It
-------------

In its simplest form:
```javascript
ID3.loadTags("filename.mp3", function() {
    var tags = ID3.getAllTags("filename.mp3");
    alert(tags.artist + " - " + tags.title + ", " + tags.album);
});
```

by specifying specific tags:
```javascript
ID3.loadTags("filename.mp3", function() {
    var tags = ID3.getAllTags("filename.mp3");
    alert(tags.COMM.data + " - " + tags.TCON.data + ", " + tags.WXXX.data);
},
{tags: ["COMM", "TCON", "WXXX"]});
```

or even by specifying shortcuts instead of cryptic tags:
```javascript
ID3.loadTags("filename.mp3", function() {
    var tags = ID3.getAllTags("filename.mp3");
    alert(tags.comment + " - " + tags.track + ", " + tags.lyrics);
},
{tags: ["comment", "track", "lyrics"]});
```

handling errors:
```javascript
ID3.loadTags("http://localhost/filename.mp3", function() {
    var tags = ID3.getAllTags("http://localhost/filename.mp3");
    alert(tags.comment + " - " + tags.track + ", " + tags.lyrics);
},
{
    tags: ["comment", "track", "lyrics"],
    onError: function(reason) {
        if (reason.error === "xhr") {
            console.log("There was a network error: ", reason.xhr);
        }
    }
});
```

### Cordova / PhoneGap

[Raymond Camden](https://github.com/cfjedimaster) wrote a pretty nice blog post on this topic: http://www.raymondcamden.com/2015/04/30/working-with-mp3s-id3-and-phonegapcordova-2

File API
--------
Reading a music file through the File API can be done by using the `FileAPIReader` data reader packaged with ID3:

```javascript
ID3.loadTags("filename.mp3", function() {
    var tags = ID3.getAllTags("filename.mp3");
    alert(tags.comment + " - " + tags.track + ", " + tags.lyrics);
}, {
    dataReader: ID3.FileAPIReader(file)
});
```
`file` is a `File` object as defined by the [File API](http://www.w3.org/TR/FileAPI/).

Example
-------
See `/example` for additional information.
Besides open http://www.aadsm.net/libraries/id3/ for a live example.

Documentation
-------------

`ID3.loadTags(url, cb, [options])`
    `url` - The URL of the mp3 file to read, this must reside on the same domain (document.domain).
    `cb` - The callback function to invoke when the tags are loaded.
    `options` - Optional parameters.
    `options.tags` - The array of tags and/or shortcuts to read from the ID3 block. Default value is: `["title", "artist", "album", "track"]`
    `options.dataReader` - The function used to create the data reader out of a url. It receives (`url`, `success`: callback function that returns the data reader, `fail`: callback function to inform an error setting up the reader). By default it will be BufferedBinaryAjax.
    `options.onError` - The function that will be called when an error occurs
    . It receives one argument with an error object. The object has an `error`
     property indicating the type of error. In the case the error type is
     `"xhr"` then an aditional `xhr` property is available with the XHR
     object for inspection.

`ID3.getAllTags(url)`
    `url` - The URL of the mp3 file to read, this must be the same value given to `ID3.loadTags()`.
    `return value` - This function will return the following object structure, for IDv1:

    {
        version: "1.1",
        title: string,
        artist: string,
        album: string,
        year: string,
        comment: string,
        track: string,
        genre: string
    }
for ID3v2:

    {
        version: "2.<major>.<revision>",
        major: integer,
        revision: integer,
        flags: {
            unsynchronisation: boolean,
            extended_header: boolean,
            experimental_indicator: boolean
        },
        size: integer,
        <frame id>*: {
            id: integer,
            size: integer,
            description: string,
            data: <frame structure>
        },
        <shortcut>*: pointer to <frame id>.data
    }

for AAC:

    {
        album: string,
        artist: string,
        year: integer,
        title: string,
        genre: string,
        track: integer,
        composer': string,
        encoder: string,
        copyright: string,
        picture: {
            format: string,
            data: bytes[]
        },
        grouping: string,
        keyword: string,
        lyrics: string,
        genre: string
    }

### How to show the cover art from the byte array:

You can do this by using a `data:` url.

```javascript
var base64String = "";
for (var i = 0; i < image.data.length; i++) {
    base64String += String.fromCharCode(image.data[i]);
}
var dataUrl = "data:" + image.format + ";base64," + window.btoa(base64String);
```

### Currently supported frames on ID3:

* APIC/PIC: Attached picture
* COMM/COM: Comments
* PCNT/CNT: Play counter
* T*: Text frames
* USLT/ULT: Unsychronized lyric/text transcription

### Shortcuts:

* title: TIT2/TT2
* artist: TPE1/TP1
* album: TALB/TAL
* year: TYER/TYE
* comment: COMM/COM
* track: TRCK/TRK
* genre: TCON/TCO
* picture: APIC/PIC
* lyrics: USLT/ULT

A comprehensive list of all tags defined in the specification can be found [here](http://www.id3.org/id3v2.3.0#head-e4b3c63f836c3eb26a39be082065c21fba4e0acc)

### Cross-Domain Requests (CORS)
When doing CORS requests the browser is not able to read all response HTTP headers unless the response explicitly allows it to.
You need to add the following headers to the response:
```
Access-Control-Allow-Origin:
Access-Control-Allow-Headers: If-Modified-Since,Range
Access-Control-Expose-Headers: Accept-Ranges,Content-Encoding,Content-Length,Content-Range
```
Otherwise you could get the error `TypeError: block is undefined @ id3/bufferedbinaryajax.js:215`

### Module Loaders
This package is packaged with browserify `--standalone`, so it can be used with your favorite flavor of module loaders:

- requirejs:

```
require('ID3', function (ID3) {
  // you may now use ID3 methods on the ID3 object.
});
```

- CommonJS:

```
var ID3 = require('ID3');
// do stuff with ID3
```

- SES (Secure Ecma Script)

```
var ID3 = ses.ID3();
// ID3 is available now.
```

- No module loader:

```
var ID3 = window.ID3
// ID3 is exposed as a global, so you can just use it directly or pull it off the window to be explicit.
```

### Node.js

This library is also npm compatible, so it can be required. As of this writing it is not published to the npm repository, but that should be remedied soon.

You can use ID3 either via browserify or directly on the server:

```
var ID3 = require('id3-reader')

var fileurl = "https://example.com/path/to/music.mp3"

ID3.loadTags(fileurl, function() {
    var tags = ID3.getAllTags(fileurl);
    console.log(tags);
    // tags are now available.
}, {
    onError: function(reason) {
        if (reason.error === "xhr") {
            console.log("There was a network error: ", reason.xhr);
        }
    }
});
```

Authors
-------
* Jacob Seidelin
* António Afonso
* Joshua Kifer
* Jesse Ditson
