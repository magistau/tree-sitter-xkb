redo-ifchange grammar.js disabled-tests
tree-sitter generate
fd . ~/src/tauboard/xkb/ --ignore-file ./disabled-tests -t f -X tree-sitter parse -qs >&2
