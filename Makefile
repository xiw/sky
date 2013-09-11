JSSRC        = $(wildcard src/*.js)
JSTEST       = $(wildcard test/*.js)
VERSION      = $(shell bin/version)
MKDIR_P      = mkdir -p
DISTDIR      = web/v1
NODEBIN      = node_modules/.bin
V            = @
Q            = $(V:1=)
QUIET_GEN    = $(Q:@=@echo    '     GEN      '$@;)
QUIET_UGLIFY = $(Q:@=@echo    '     UGLIFY   '$@;)

.PHONY: all jshint dist check clean

all: dist

dist: jshint $(DISTDIR)/sky.min.js \
	$(DISTDIR)/starmap.topo.json \
	$(DISTDIR)/stars-extra.topo.json

jshint:
	@$(NODEBIN)/jshint $(JSSRC) $(JSTEST)

check: dist
	@$(NODEBIN)/nodeunit $(JSTEST)

clean:
	-rm -f sky.js data/*.json $(DISTDIR)/*.js $(DISTDIR)/*.json

$(DISTDIR)/sky.min.js: sky.js
	@$(MKDIR_P) $(DISTDIR)
	$(QUIET_UGLIFY)$(NODEBIN)/uglifyjs $^ -o $(DISTDIR)/sky.min.js --wrap sky

sky.js: package.json $(JSSRC)
	$(QUIET_UGLIFY)$(NODEBIN)/uglifyjs $(JSSRC) -o $@ --beautify "indent-level=2" --reserved
	@sed -i '' -e 's/%VERSION%/$(VERSION)/g' $@

data/constellations.json: data/bnd20.txt
	$(QUIET_GEN)bin/gen-constellations $^ -o $@

data/asterisms.json: data/bsc5p.txt $(wildcard data/asterisms/*)
	$(QUIET_GEN)bin/gen-asterisms data/asterisms --bsc5p $< -o $@ --out-stars data/stars.json

data/stars-extra.json: data/bsc5p.txt data/asterisms.json
	$(QUIET_GEN)bin/gen-stars $^ -o $@ --vmag 5 --exclude data/stars.json

$(DISTDIR)/starmap.topo.json: data/constellations.json data/asterisms.json data/stars.json
	$(QUIET_GEN)$(NODEBIN)/topojson $^ -o $@~ --spherical -p
	@$(NODEBIN)/geojson $@~ -o data
	@bin/fix-constellations data/constellations.json
	@$(NODEBIN)/topojson $^ -o $@~ --no-force-clockwise --spherical -p 
	@mv -f $@~ $@

$(DISTDIR)/stars-extra.topo.json: data/stars-extra.json
	$(QUIET_GEN)$(NODEBIN)/topojson $^ -o $@ --spherical -p
