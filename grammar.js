/**
 * @file X Keyboard Extension keymap text format
 * @author Tau <tree-sitter@alice-carroll.pet>
 * @license BSD3
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check
module.exports = grammar({
	name: "xkb",
	word: $ => $.identifier,
	extras: $ => [
		/\s/,
		$.comment,
	],
	rules: {
		source_file: $ =>
			optional(choice(
				$._keymap_file,
				$._keymap_component_file,
			)),
		_keymap_file: $ => $.xkb_keymap,
		_keymap_component_file: $ =>
			repeat1(
				$.component,
			),
		component: $ =>
			choice(
				$.xkb_keycodes,
				$.xkb_types,
				$.xkb_compat,
				$.xkb_symbols,
			),
		_kwd_action: _ => /action/i,
		_kwd_alias: _ => /alias/i,
		_kwd_alphanumeric_keys: _ => /alphanumeric_keys/i,
		_kwd_alternate_group: _ => /alternate_group/i,
		_kwd_alternate: _ => /alternate/i,
		_kwd_augment: _ => /augment/i,
		_kwd_default: _ => /default/i,
		_kwd_function_keys: _ => /function_keys/i,
		_kwd_group: _ => /group/i,
		_kwd_hidden: _ => /hidden/i,
		_kwd_include: _ => /include/i,
		_kwd_indicator: _ => /indicator/i,
		_kwd_interpret: _ => /interpret/i,
		_kwd_key: _ => /key/i,
		_kwd_keypad_keys: _ => /keypad_keys/i,
		_kwd_keys: _ => /keys/i,
		_kwd_logo: _ => /logo/i,
		_kwd_mod_map: _ => /mod_map/i,
		_kwd_modifier_keys: _ => /modifier_keys/i,
		_kwd_modmap: _ => /modmap/i,
		_kwd_modifier_map: _ => /modifier_map/i,
		_kwd_outline: _ => /outline/i,
		_kwd_overlay: _ => /overlay/i,
		_kwd_override: _ => /override/i,
		_kwd_partial: _ => /partial/i,
		_kwd_replace: _ => /replace/i,
		_kwd_row: _ => /row/i,
		_kwd_section: _ => /section/i,
		_kwd_shape: _ => /shape/i,
		_kwd_solid: _ => /solid/i,
		_kwd_text: _ => /text/i,
		_kwd_type: _ => /type/i,
		_kwd_virtual_modifiers: _ => /virtual_modifiers/i,
		_kwd_virtual: _ => /virtual/i,
		_kwd_xkb_compat_map: _ => /xkb_compat_map/i,
		_kwd_xkb_compat: _ => /xkb_compat/i,
		_kwd_xkb_compatibility_map: _ => /xkb_compatibility_map/i,
		_kwd_xkb_compatibility: _ => /xkb_compatibility/i,
		_kwd_xkb_geometry: _ => /xkb_geometry/i,
		_kwd_xkb_keycodes: _ => /xkb_keycodes/i,
		_kwd_xkb_keymap: _ => /xkb_keymap/i,
		_kwd_xkb_layout: _ => /xkb_layout/i,
		_kwd_xkb_semantics: _ => /xkb_semantics/i,
		_kwd_xkb_symbols: _ => /xkb_symbols/i,
		_kwd_xkb_types: _ => /xkb_types/i,
		comment: _ => token(seq(choice("//", "#"), /.*/)),
		bool: _ => /true|false|yes|no|off|on/i,
		number: _ =>
			choice(
				/\d+\.\d+/,
				/\d+/,
				/0x[[:xdigit:]]+/,
			),
		string: $ =>
			seq(
				"\"",
				repeat(choice(
					$._escape_sequence,
					$._string_content,
				)),
				"\"",
			),
		_string_content: _ => /[^\\"\n]+/,
		_escape_sequence: _ =>
			token.immediate(seq(
				"\\",
				choice(
					/[\\"befnrtv]/,
					/u\{[[:xdigit:]]{0,5}\}/,
					/[0-7]{1,4}/,
				),
			)),
		identifier: _ => /[_\p{XID_Start}][_\p{XID_Continue}]*/,
		xkb_keymap: $ =>
			block(
				$,
				choice(
					$._kwd_xkb_keymap,
					$._kwd_xkb_semantics,
					$._kwd_xkb_layout,
				),
				$.component,
			),
		xkb_keycodes: $ => section($, $._kwd_xkb_keycodes, $.keycode_stmt),
		xkb_compat: $ =>
			section(
				$,
				choice(
					$._kwd_xkb_compat,
					$._kwd_xkb_compat_map,
					$._kwd_xkb_compatibility_map,
					$._kwd_xkb_compatibility,
				),
				choice(
					$.interpret_stmt,
					$.led_map_stmt,
					$.compat_set_default_stmt,
					$.group_stmt,
				),
			),
		xkb_symbols: $ =>
			section(
				$,
				$._kwd_xkb_symbols,
				choice(
					$.group_name_stmt,
					$.key_stmt,
					$.modifier_map,
					$.symbols_set_default_stmt,
				),
			),
		xkb_types: $ => section($, $._kwd_xkb_types, $.typedef),
		merge_mode: $ =>
			choice(
				$._kwd_augment,
				$._kwd_override,
				$._kwd_replace,
				$._kwd_alternate,
			),
		include: $ => seq(choice($.merge_mode, $._kwd_include), $.include_target),
		include_target: $ => $.string,
		keycode_stmt: $ =>
			choice(
				$.keycode_decl,
				$.keycode_alias,
				$.led_name_decl,
				$.keycode_range_bound,
			),
		keycode_decl: $ => decl($, $.keycode_name, $.keycode_value),
		keycode_value: $ => $.number,
		// there are <VOL+> and <VOL-> keycodes
		keycode_name: _ => /<[A-Z0-9+-]*>/i,
		keycode_alias: $ => decl($, seq($._kwd_alias, $.keycode_name), $.keycode_name),
		led_name_decl: $ => decl($, seq(optional($._kwd_virtual), $._kwd_indicator, $.number), $.led_name),
		led_name: $ => $.string,
		typedef: $ => block($, seq($._kwd_type, $.typename), $.type_stmt),
		typename: $ => $.string,
		type_stmt: $ => choice($.level_name_stmt, $.modifiers_stmt, $.map_entry_stmt, $.preserve_stmt),
		level_name_stmt: $ => decl($, elem_of("level_name", $.level_ref), $.string),
		level_ref: $ => choice(/Level[1-8]/, $.number),
		real_modifier: _ =>
			choice(
				"Shift",
				"Lock",
				"Control",
				"Mod1",
				"Mod2",
				"Mod3",
				"Mod4",
				"Mod5",
			),
		virtual_modifier: $ => $.identifier,
		modifier: $ => choice($.real_modifier, $.virtual_modifier),
		modifiers: $ => sep_by1($.modifier, "+"),
		modifiers_stmt: $ => decl($, "modifiers", $.modifiers),
		map_entry_stmt: $ => decl($, elem_of("map", $.modifiers), $.level_ref),
		preserve_stmt: $ => decl($, elem_of("preserve", $.modifiers), $.modifiers),
		interpret_stmt: $ =>
			block(
				$,
				seq($._kwd_interpret, optional($.interpret_cond)),
				choice($.usemodmapmods_stmt, $.virtualmodifier_stmt, $.repeat_stmt, $.action_stmt),
			),
		interpret_cond: $ => seq(choice(/Any/i, $.keysym), optional(seq("+", $.interpret_pred))),
		interpret_complex_pred: $ =>
			seq(
				$.interpret_match_op,
				"(",
				$.interpret_match_mask,
				")",
			),
		interpret_pred: $ => choice($.interpret_match_mask, $.interpret_match_op, $.interpret_complex_pred),
		interpret_match_mask: $ => choice(/all/i, $.modifiers),
		interpret_match_op: _ => choice("AnyOfOrNone", "AnyOf", "Any", "NoneOf", "AllOf", "Exactly"),
		usemodmapmods_stmt: $ => decl($, "useModMapMods", choice("level1", "any")),
		virtualmodifier_stmt: $ => decl($, "virtualModifier", $.modifier),
		repeat_stmt: $ => decl($, "repeat", $.bool, true),
		action_stmt: $ => decl($, "action", choice(xkb_seq($.action), $.action)),
		led_map_stmt: $ =>
			block(
				$,
				seq($._kwd_indicator, $.led_name),
				choice(
					$.modifiers_stmt,
					$.whichmodstate_stmt,
					$.groups_stmt,
					$.whichgroupstate_stmt,
					$.allowexplicit,
					$.indicatordriveskeyboard,
					$.controls,
				),
			),
		whichmodstate_stmt: $ =>
			decl(
				$,
				"whichModState",
				sep_by1(
					choice(
						/base/i,
						/latched/i,
						/locked/i,
						/effective/i,
						/any/i,
						/none/i,
						/compat/i,
					),
					"+",
				),
			),
		groups_stmt: $ =>
			decl(
				$,
				"groups",
				seq(
					/all/i,
					"-",
					/group1/i,
				),
			),
		whichgroupstate_stmt: $ =>
			decl(
				$,
				"whichGroupState",
				sep_by1(
					choice(
						/base/i,
						/latched/i,
						/locked/i,
						/effective/i,
						/any/i,
						/none/i,
					),
					"+",
				),
			),
		compat_set_default_stmt: $ =>
			decl(
				$,
				choice(
					attr_of(
						$._kwd_interpret,
						choice("useModMapMods", "virtualModifier", "repeat", "action"),
					),
					attr_of($._kwd_indicator, choice("modifiers", "whichModState", "groups", "whichGroupState", "allowExplicit")),
					attr_of($.action_name, $.field_name),
				),
				$.value,
				true,
			),
		action_name: $ => $.identifier,
		action: $ =>
			seq(
				$.action_name,
				"(",
				sep_by(
					bare_decl($.field_name, $.value, true),
					",",
				),
				")",
			),
		section_name: $ => $.string,
		keysym: $ => choice($.identifier, $.string, $.number),
		field_name: $ => $.identifier,
		value: $ =>
			choice(
				$.string,
				$.number,
				/[-+]\d+/,
				$.bool,
				$.modifiers,
				$.action,
				$.keycode_name,
				$.controls_mask,
				prec(-1, $.identifier),
				xkb_seq($.value),
				xkb_table($.value),
			),
		group_ref: _ => /(?:group)?\d+/i,
		group_name_stmt: $ => decl($, elem_of(choice("name", "group", "groupName"), $.group_ref), $.string),
		key_stmt: $ =>
			statement(
				$,
				seq(
					"key",
					$.keycode_name,
					xkb_seq(choice(
						$.symbol_table,
						$.key_symbols,
						$.key_actions,
						$.key_type,
						$.key_virtual_modifiers,
						$.key_repeat,
						$.key_overlay,
					)),
				),
			),
		symbol_table: $ => xkb_table(choice($.keysym, xkb_seq($.keysym))),
		key_symbols: $ => bare_decl(elem_of("symbols", $.group_ref), $.symbol_table),
		key_actions: $ =>
			bare_decl(
				elem_of("actions", $.group_ref),
				xkb_table(
					choice(
						$.action,
						xkb_seq($.action),
					),
				),
			),
		key_type: $ => bare_decl(choice(elem_of("type", $.group_ref), "type"), $.typename),
		key_virtual_modifiers: $ => bare_decl(choice("virtualModifiers", "virtualMods", "vmods"), $.modifiers),
		key_repeat: $ => decl($, "repeat", $.bool, true),
		modifier_map: $ =>
			statement(
				$,
				seq(
					$._kwd_modifier_map,
					choice("None", $.real_modifier),
					xkb_seq(choice($.keycode_name, $.keysym)),
				),
			),
		symbols_set_default_stmt: $ =>
			decl(
				$,
				choice(
					attr_of(
						"key",
						choice(elem_of(choice("symbols", "actions", "type"), $.group_ref), "type", "virtualModifiers", "repeat"),
					),
					attr_of($.action_name, $.field_name),
				),
				$.value,
				true,
			),
		virtual_modifier_decl: $ =>
			statement(
				$,
				seq(
					$._kwd_virtual_modifiers,
					sep_by(
						choice(
							bare_decl($.virtual_modifier, choice($.number, $.real_modifiers)),
							$.virtual_modifier,
						),
						",",
					),
				),
			),
		real_modifiers: $ => sep_by1($.real_modifier, "+"),
		allowexplicit: $ => decl($, "allowExplicit", $.bool, true),
		group_stmt: $ => decl($, seq("group", $.group_ref), $.modifiers),
		indicatordriveskeyboard: $ => decl($, "indicatorDrivesKeyboard", $.bool, true),
		controls_mask: _ =>
			choice(
				"none",
				"all",
				sep_by1(
					choice(
						"RepeatKeys",
						"Repeat",
						"AutoRepeat",
						"SlowKeys",
						"BounceKeys",
						"StickyKeys",
						"MouseKeys",
						"MouseKeysAccel",
						"AccessXKeys",
						"AccessXTimeout",
						"AccessXFeedback",
						"AudibleBell",
						"IgnoreGroupLock",
						"Overlay1",
						"Overlay2",
					),
					"+",
				),
			),
		controls: $ =>
			decl(
				$,
				choice("controls", "ctrls"),
				$.controls_mask,
			),
		key_overlay: $ => bare_decl(/overlay\d+/i, $.keycode_name),
		keycode_range_bound: $ => decl($, choice("minimum", "maximum"), $.number),
	},
});

function xkb_seq(elem) {
	return seq("{", sep_by(elem, ","), "}");
}
function xkb_table(elem) {
	return seq("[", sep_by(elem, ","), "]");
}
function sep_by1(tok, sep) {
	return seq(repeat(seq(tok, sep)), tok);
}
function sep_by(tok, sep) {
	return optional(sep_by1(tok, sep));
}
function bare_decl(target, value, bool = false) {
	if (bool) {
		return choice(
			seq(target, "=", value),
			seq(optional("!"), target),
		);
	} else {
		return seq(target, "=", value);
	}
}
function decl($, target, value, bool = false) {
	return statement($, bare_decl(target, value, bool));
}
function elem_of(col, index) {
	return seq(col, "[", index, "]");
}
function attr_of(col, attr) {
	return seq(col, ".", attr);
}
function section($, kind, stmt) {
	return block(
		$,
		seq(
			repeat(choice(
				$._kwd_partial,
				$._kwd_default,
				$._kwd_hidden,
				$._kwd_alphanumeric_keys,
				$._kwd_modifier_keys,
				$._kwd_keypad_keys,
				$._kwd_function_keys,
				$._kwd_alternate_group,
			)),
			kind,
			$.section_name,
		),
		choice($.include, $.virtual_modifier_decl, stmt),
	);
}
function block($, header, stmt) {
	return statement($, seq(header, "{", repeat(stmt), "}"));
}
function statement($, body) {
	return seq(optional($.merge_mode), body, ";");
}
