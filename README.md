# Tree-sitter xkb implementation

The grammar is based on [`xkbcommon` docs](https://xkbcommon.org/doc/current/keymap-text-format-v1.html), followed by _some_ investigation of `xkbcommon` code for stuff used in real `xkeyboard_config` yet undocumented by `xkbcommon`.

## Usage

Use the [`build` branch](https://github.com/magistau/tree-sitter-xkb/tree/build), it contains the generated parser and bindings.

## (Somewhat) resolved questions

### General syntax

In places where something of form `foo=bar` is expected, just `foo` or `!foo` may be written.
This most likely corresponds to `foo=true`/`foo=false`.

### `xkb_compat`

#### `group`

This statement is not mentioned in the docs. Here's an example:

```xkb
group 3 = Mod5;
```

I think the syntax is `group` followed by what I refer to as `group_ref` (either a number or `group` immediately followed by a number), then `=`, then a list of modifiers separated by `+`.

#### `indicator.allowExplicit` and `indicator.indicatorDrivesKeyboard`

Not documented; seem to be booleans

#### `indicator.controls`

Not documented; the allowed values probably match the ones allowed for the `controls` parameter of `SetControls` and `LockControls` actions.
See ["Controls mask"](#controls-mask).
Used only once in `/share/X11/xkb/compat/mousekeys`:

```xkb
// Allow an indicator for MouseKeys.
indicator "Mouse Keys" {
	indicatorDrivesKeyboard;
	controls = MouseKeys;
};
```

### `xkb_symbols`

#### `overlay1` and `overlay2` options inside key declarations

Not mentioned in the docs, the values are keycode names.

### `xkb_keycodes`

#### `minimum` and `maximum` options inside keycode declarations

Not mentioned in the docs, the values are numbers.

## Unresolved questions

### General syntax

#### Case sensitivity

Which parts of grammar are case sensitive and which are not?
`Greek_alpha` and `Greek_alpha` are definitely different keysyms, for examples, so it's not like everything is case-insensitive.

#### Decimal numbers

The documentation specifies decimals as one of three supported options for numbers, yet they aren't used anywhere.
I suspect they might make sense in `xkb_geometry` section, but&mdash;you guessed it&mdash;this section is also not documented. For now, decimals are allowed wherever numbers are.

#### Keycode names

The format of keycode names is also unknown, there several assumptions I have or used to have until I found their violations:

- The name is enclosed within angle brackets (or, to be precise, less-than and greater-than symbols) &mdash; currently stands
- The name is four characters long (`<RTRN>`, `AD02`) &mdash; this may or may be the maximum length allowed, but this is definitely violated by stuff like `<TAB>`
- The name only consists of capital letters or digits &mdash; false, there is `<LatN>`, for example
- The name only consists of letters and digits &mdash; false, there are `<VOL+>` and `<VOL->`
- The name consists of non-whitespace characters &mdash; currently stands

Currently, keycode names are assumed to only consist of ASCII letters, digits, `+` and `-`.

#### "Controls mask"

These are the values allowed for the `controls` parameter of `SetControls` and `LockControls` actions. Said to be "Mask of the following enumeration:", but the syntax of "masks" is not defined anywhere. In all occurences of these actions in `xkeyboard_config`, only one of the items of the enumeration is passed. I currently suspect that it is a list of `+`-separated items, and this is what the grammar currently expects.

### `xkb_compat`

#### `indicator.groups`

The syntax of this is not documented, and `xkeyboard_config` contains no files where it is set to something other than what `All-[Gg]roup1` matches.
