{
  pkgs ? import <nixpkgs> { },
}:
pkgs.mkShell {
  packages = with pkgs; [
    dprint
    (tree-sitter.override {
      webUISupport = true;
    })
    libxkbcommon
  ];
}
