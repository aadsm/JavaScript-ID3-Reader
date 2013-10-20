# build id3.js

# output dir
DIST = dist
PRODUCTS = id3-minimized.js id3.dev.js
# prefixes every word in PRODUCTS with DIST; $(WORDS:WORD=PREFIX/WORD)
OUTPUTS = $(PRODUCTS:%=$(DIST)/%)
LIBS = $(DIST)/id3.lib.js $(DIST)/id3.core.js
CLOSURE_COMPILER ?= ./compiler.jar

.PHONY: all clean
all: $(OUTPUTS)
# The lib and core files are intermediates, not needed after compilation
.INTERMEDIATE: $(LIBS)

# Search for JS files in src/
vpath %.js src

# Actual dependencies for each lib
$(DIST)/id3.lib.js: stringutils.js bufferedbinaryajax.js filereader.js base64.js
$(DIST)/id3.core.js: id3.js id3v1.js id3v2.js id3v2frames.js id4.js
$(DIST)/id3.dev.js: $(LIBS)

$(DIST)/%.js:
	cat $^ > $@

$(DIST)/id3-minimized.js: $(DIST)/id3.dev.js
	java -jar $(CLOSURE_COMPILER) --compilation_level ADVANCED_OPTIMIZATIONS \
		--js $< > $@
    #--formatting PRETTY_PRINT

clean:
	rm -f $(DIST)/*
