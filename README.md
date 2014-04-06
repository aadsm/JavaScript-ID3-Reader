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

File API
--------
Reading a music file through the File API can be done by specifying the `FileAPIReader` data reader:

```javascript
ID3.loadTags("filename.mp3", function() {
    var tags = ID3.getAllTags("filename.mp3");
    alert(tags.comment + " - " + tags.track + ", " + tags.lyrics);
}, {
    dataReader: FileAPIReader(file)
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

Authors
-------
* Jacob Seidelin
* António Afonso
* Joshua Kifer