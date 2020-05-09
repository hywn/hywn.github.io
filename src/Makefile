targets := $(patsubst %.prrr, ../%.html, $(wildcard *.prrr))

all:
	make $(targets)

clean:
	rm $(targets)

../%.html: %.prrr
	prrr $< > ../$*.html
