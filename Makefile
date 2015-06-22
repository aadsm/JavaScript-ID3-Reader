# Binaries
BROWSERIFY = ./node_modules/.bin/browserify
CLOSURE_COMPILER=./node_modules/google-closure-compiler/compiler.jar

.PHONY: dist debug

dist:
	$(BROWSERIFY) ./src/id3.js --standalone ID3 \
	--exclude xmlhttprequest \
	--exclude btoa \
	--exclude atob \
	--no-builtins > output.js
	sed -i.bak "s/\.ID3/['ID3']/g" output.js
	java -jar $(CLOSURE_COMPILER) \
		--compilation_level ADVANCED_OPTIMIZATIONS \
		--js output.js \
	> dist/id3-minimized.js
	#--formatting PRETTY_PRINT
	rm output.js*

debug:
	$(BROWSERIFY) ./src/id3.js --standalone ID3 \
	--exclude xmlhttprequest \
	--exclude btoa \
	--exclude atob \
	--no-builtins --debug > dist/id3-debug.js
