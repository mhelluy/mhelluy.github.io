from fontTools.ttLib import TTFont
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.fontBuilder import FontBuilder
import os

def create_specific_unicode_font(output_path="custom_unicode_font.woff"):
    # Basic font metadata
    family_name = "CustomSquareFont"
    style_name = "Regular"
    units_per_em = 1000
    ascender = 800
    descender = -200

    # Define the desired Unicode characters
    unicode_characters = [0xb7,0x219d,
        0x2201, 0x2229, 0x22C2, 0x22D4, 0x222A, 0x22C3, 0x2282, 0x2286, 0x2283, 0x2287, 0x2284,
        0x2288, 0x2285, 0x2289, 0x2208, 0x2209, 0x220B, 0x220C, 0x2322, 0x2323, 0x007C, 0x2223,
        0x2224, 0x2016, 0x2225, 0x2226, 0x002F, 0x2215, 0x2044, 0x005C, 0x2216, 0x2212, 0x00F7,
        0x003D, 0x2260, 0x2254, 0x225C, 0x2261, 0x2202, 0x221D, 0x221E, 0x2205, 0x2218, 0x2295,
        0x2A01, 0x2297, 0x2A02, 0x221A, 0x003C, 0x003E, 0x2264, 0x2A7D, 0x2265, 0x2A7E, 0x227A,
        0x227B, 0x226A, 0x226B, 0x27E8, 0x27E9, 0x2227, 0x22C0, 0x2228, 0x22C1, 0x2200, 0x002B,
        0x00D7, 0x2217, 0x2203, 0x2204, 0x00AC, 0x22A5, 0x27C2, 0x22A4, 0x22A2, 0x0023, 0x2211,
        0x220F, 0x2210, 0x22C9, 0x22CA, 0x2192, 0x27F6, 0x2190, 0x27F5, 0x20D7, 0x21A6, 0x27FC,
        0x21D2, 0x21D0, 0x21D4, 0x27FA, 0x21AA, 0x21AC, 0x21A0, 0x2197, 0x2198, 0x21B7, 0x223C,
        0x2248, 0x2243, 0x2245, 0x2240, 0x222B, 0x222C, 0x222D, 0x222E, 0x222F, 0x2230, 0x0028,
        0x0029, 0x005B, 0x005D, 0x007B, 0x007D, 0x27E6, 0x27E7, 0x230A, 0x230B, 0x2308, 0x2309,
        0x2206, 0x2207, 0x22B3, 0x22B5, 0x22B2, 0x22B4, 0x25A1, 0x220E, 0x25CA, 0x2032, 0x005E,
        0x02C6, 0x0302, 0x00AF, 0x02C9, 0x0304, 0x203E, 0x0305, 0x02DA, 0x030A, 0x0021, 0x22C5,
        0x2234, 0x2235, 0x2026, 0x22EE, 0x22EF, 0x22F0, 0x22F1
    ]

    glyph_order = [".notdef"] + [f"u{codepoint:04X}" for codepoint in unicode_characters]
    char_map = {codepoint: f"u{codepoint:04X}" for codepoint in unicode_characters}

    # Initialize the font builder
    fb = FontBuilder(units_per_em)
    fb.setupGlyphOrder(glyph_order)
    fb.setupCharacterMap(char_map)
    fb.setupNameTable({
        1: family_name,
        2: style_name,
        4: f"{family_name} {style_name}",
        6: f"{family_name}-{style_name}"
    })
    fb.setupHorizontalMetrics({g: (1000, 0) for g in glyph_order})
    fb.setupOS2(sTypoAscender=ascender, sTypoDescender=descender, usWinAscent=ascender, usWinDescent=-descender)
    fb.setupPost()

    # Create a simple square glyph
    def create_square_glyph():
        pen = TTGlyphPen(None)
        pen.moveTo((100, 100))
        #pen.lineTo((900, 100))
        pen.lineTo((900, 900))
        pen.lineTo((100, 900))
        pen.closePath()
        return pen.glyph()

    # Create glyph data for specified Unicode characters
    glyphs = {".notdef": TTGlyphPen(None).glyph()}  # Add required .notdef glyph
    for codepoint in unicode_characters:
        glyphs[f"u{codepoint:04X}"] = create_square_glyph()

    fb.setupGlyf(glyphs)
    fb.setupHorizontalHeader(ascent=ascender, descent=descender)

    # Save as WOFF file
    ttf_path = output_path.replace(".woff", ".ttf")
    fb.save(ttf_path)

# Example usage
create_specific_unicode_font()
