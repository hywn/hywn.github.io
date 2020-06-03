SHELL   := /bin/bash

targets := $(patsubst %.md, ../%.html, $(wildcard *.md))

all:
	make $(targets)

clean:
	rm -rf $(targets)

../%.html: %.md
	echo '<link rel="stylesheet" href="src/list.css" />' > ../$*.html
	ruby list.rb $< >> ../$*.html