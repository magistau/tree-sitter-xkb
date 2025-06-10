package tree_sitter_xkb_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_xkb "github.com/magistau/tree-sitter-xkb/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_xkb.Language())
	if language == nil {
		t.Errorf("Error loading XKB grammar")
	}
}
