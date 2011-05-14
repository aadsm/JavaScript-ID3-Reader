CLOSURE_COMPILER=/usr/local/closure-compiler/compiler.jar

java -jar "$CLOSURE_COMPILER" \
    --compilation_level ADVANCED_OPTIMIZATIONS \
    --js src/stringutils.js \
    --js src/bufferedbinaryajax.js \
    --js src/filereader.js \
    --js src/base64.js \
    --js src/id3.js \
    --js src/id3v1.js \
    --js src/id3v2.js \
    --js src/id3v2frames.js \
    --js src/id4.js \
> dist/id3-minimized.js

#--formatting PRETTY_PRINT \