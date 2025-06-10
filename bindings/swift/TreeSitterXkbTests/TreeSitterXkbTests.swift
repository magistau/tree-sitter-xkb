import XCTest
import SwiftTreeSitter
import TreeSitterXkb

final class TreeSitterXkbTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_xkb())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading XKB grammar")
    }
}
