import { hebraicizeRegex } from "./textContent";

const HEB = "א-ת";

describe("hebraicizeRegex", () => {
  describe("\\w outside character class", () => {
    test("translates a bare \\w to [א-ת]", () => {
      const { regex, warnings } = hebraicizeRegex("\\w");
      expect(regex).toBe(`[${HEB}]`);
      expect(warnings).toEqual([]);
    });

    test("translates \\w with a quantifier", () => {
      const { regex, warnings } = hebraicizeRegex("\\w+");
      expect(regex).toBe(`[${HEB}]+`);
      expect(warnings).toEqual([]);
    });

    test("translates multiple \\w occurrences", () => {
      const { regex, warnings } = hebraicizeRegex("\\w\\w");
      expect(regex).toBe(`[${HEB}][${HEB}]`);
      expect(warnings).toEqual([]);
    });

    test("translates \\w with surrounding literals", () => {
      const { regex, warnings } = hebraicizeRegex("a\\wb");
      expect(regex).toBe(`a[${HEB}]b`);
      expect(warnings).toEqual([]);
    });
  });

  describe("\\W outside character class", () => {
    test("translates a bare \\W to [^א-ת]", () => {
      const { regex, warnings } = hebraicizeRegex("\\W");
      expect(regex).toBe(`[^${HEB}]`);
      expect(warnings).toEqual([]);
    });

    test("translates \\W with surrounding literals", () => {
      const { regex, warnings } = hebraicizeRegex("a\\Wb");
      expect(regex).toBe(`a[^${HEB}]b`);
      expect(warnings).toEqual([]);
    });
  });

  describe("\\w / \\W inside character class", () => {
    test("[\\w] becomes [א-ת]", () => {
      const { regex, warnings } = hebraicizeRegex("[\\w]");
      expect(regex).toBe(`[${HEB}]`);
      expect(warnings).toEqual([]);
    });

    test("[\\W] becomes [^א-ת]", () => {
      const { regex, warnings } = hebraicizeRegex("[\\W]");
      expect(regex).toBe(`[^${HEB}]`);
      expect(warnings).toEqual([]);
    });

    test("[^\\w] becomes [^א-ת]", () => {
      const { regex, warnings } = hebraicizeRegex("[^\\w]");
      expect(regex).toBe(`[^${HEB}]`);
      expect(warnings).toEqual([]);
    });

    test("[\\w\\s] composes ranges", () => {
      const { regex, warnings } = hebraicizeRegex("[\\w\\s]");
      expect(regex).toBe(`[${HEB}\\s]`);
      expect(warnings).toEqual([]);
    });

    test("[a\\wz] composes with literals", () => {
      const { regex, warnings } = hebraicizeRegex("[a\\wz]");
      expect(regex).toBe(`[a${HEB}z]`);
      expect(warnings).toEqual([]);
    });
  });

  describe("\\b word-boundary", () => {
    test("expands a bare \\b to a lookaround alternation", () => {
      const { regex, warnings } = hebraicizeRegex("\\b");
      expect(regex).toBe(
        `(?:(?<=[^${HEB}])(?=[${HEB}])|(?<=[${HEB}])(?=[^${HEB}])|^(?=[${HEB}])|(?<=[${HEB}])$)`
      );
      expect(warnings).toEqual([]);
    });

    test("expands \\b on both sides of \\w+", () => {
      const { regex } = hebraicizeRegex("\\b\\w+\\b");
      const expandedB = `(?:(?<=[^${HEB}])(?=[${HEB}])|(?<=[${HEB}])(?=[^${HEB}])|^(?=[${HEB}])|(?<=[${HEB}])$)`;
      expect(regex).toBe(`${expandedB}[${HEB}]+${expandedB}`);
    });

    test("the produced regex compiles", () => {
      const { regex } = hebraicizeRegex("\\b\\w+\\b");
      expect(() => new RegExp(regex, "g")).not.toThrow();
    });

    test("compiled \\b matches Hebrew word boundaries", () => {
      const { regex } = hebraicizeRegex("\\b\\w+\\b");
      const re = new RegExp(regex, "g");
      const matches = "שלום עולם".match(re);
      expect(matches).toEqual(["שלום", "עולם"]);
    });
  });

  describe("\\B non-word-boundary", () => {
    test("expands a bare \\B to its lookaround", () => {
      const { regex, warnings } = hebraicizeRegex("\\B");
      expect(regex).toBe(
        `(?:(?<=[${HEB}])(?=[${HEB}])|(?<=[^${HEB}])(?=[^${HEB}]))`
      );
      expect(warnings).toEqual([]);
    });

    test("the produced regex compiles", () => {
      const { regex } = hebraicizeRegex("\\B");
      expect(() => new RegExp(regex, "g")).not.toThrow();
    });
  });

  describe("character-class edge cases", () => {
    test("\\b inside [...] is left alone (means backspace)", () => {
      const { regex, warnings } = hebraicizeRegex("[\\bx]");
      expect(regex).toBe("[\\bx]");
      expect(warnings).toEqual([]);
    });

    test("\\B inside [...] is left alone", () => {
      const { regex, warnings } = hebraicizeRegex("[\\Bx]");
      expect(regex).toBe("[\\Bx]");
      expect(warnings).toEqual([]);
    });

    test("escaped [ does not start a class", () => {
      const { regex, warnings } = hebraicizeRegex("\\[\\w\\]");
      expect(regex).toBe(`\\[[${HEB}]\\]`);
      expect(warnings).toEqual([]);
    });

    test("literal backslash followed by w is not treated as \\w", () => {
      // Pattern: \\w  -> literal '\' followed by literal 'w'
      const { regex, warnings } = hebraicizeRegex("\\\\w");
      expect(regex).toBe("\\\\w");
      expect(warnings).toEqual([]);
    });

    test("other escapes (\\s, \\d, \\.) pass through", () => {
      const { regex, warnings } = hebraicizeRegex("\\s\\d\\.");
      expect(regex).toBe("\\s\\d\\.");
      expect(warnings).toEqual([]);
    });
  });

  describe("warnings: ambiguous \\W usage", () => {
    test("[^\\W] warns (doubled negation)", () => {
      const { regex, warnings } = hebraicizeRegex("[^\\W]");
      expect(regex).toBe(`[^^${HEB}]`);
      expect(warnings).toHaveLength(1);
      expect(warnings[0]).toMatch(/\[\^\\W\]/);
      expect(warnings[0]).toMatch(/equivalent to \\w/);
    });

    test("[\\W\\s] warns (mixed class)", () => {
      const { regex, warnings } = hebraicizeRegex("[\\W\\s]");
      expect(regex).toBe(`[^${HEB}\\s]`);
      expect(warnings).toHaveLength(1);
      expect(warnings[0]).toMatch(/\[\\W\\s\]/);
      expect(warnings[0]).toMatch(/combines \\W with other class members/);
    });

    test("[\\Wabc] warns (mixed class with literals)", () => {
      const { regex, warnings } = hebraicizeRegex("[\\Wabc]");
      expect(regex).toBe(`[^${HEB}abc]`);
      expect(warnings).toHaveLength(1);
      expect(warnings[0]).toMatch(/combines \\W with other class members/);
    });

    test("[\\W] alone does NOT warn", () => {
      const { warnings } = hebraicizeRegex("[\\W]");
      expect(warnings).toEqual([]);
    });

    test("\\W outside any class does NOT warn", () => {
      const { warnings } = hebraicizeRegex("a\\Wb");
      expect(warnings).toEqual([]);
    });

    test("multiple bad classes produce multiple warnings", () => {
      const { warnings } = hebraicizeRegex("[\\W\\s]x[^\\W]");
      expect(warnings).toHaveLength(2);
    });
  });

  describe("misc", () => {
    test("empty string yields empty regex and no warnings", () => {
      const { regex, warnings } = hebraicizeRegex("");
      expect(regex).toBe("");
      expect(warnings).toEqual([]);
    });

    test("string with no special escapes is unchanged", () => {
      const { regex, warnings } = hebraicizeRegex("abc[xyz]+");
      expect(regex).toBe("abc[xyz]+");
      expect(warnings).toEqual([]);
    });

    test("trailing lone backslash is preserved", () => {
      const { regex, warnings } = hebraicizeRegex("abc\\");
      expect(regex).toBe("abc\\");
      expect(warnings).toEqual([]);
    });
  });
});
