import {
  parseSkillsListInput,
  sanitizeRichText,
  toDisplayHtml,
} from "../services/richText";

describe("richText utils", () => {
  it("removes script and unsafe event handlers", () => {
    const output = sanitizeRichText(
      `<script>alert("x")</script><p onclick="hack()">Texto <a href="javascript:alert(1)">teste</a></p>`
    );

    expect(output).not.toContain("<script");
    expect(output).not.toContain("onclick=");
    expect(output).toContain('href="#"');
    expect(output).toContain("<p>");
  });

  it("keeps allowed formatting tags", () => {
    const output = sanitizeRichText("<p><strong>A</strong> <em>B</em> <u>C</u></p><ul><li>Item</li></ul>");
    expect(output).toContain("<strong>A</strong>");
    expect(output).toContain("<em>B</em>");
    expect(output).toContain("<u>C</u>");
    expect(output).toContain("<ul>");
    expect(output).toContain("<li>Item</li>");
  });

  it("normalizes legacy bold/italic tags from editor output", () => {
    const output = sanitizeRichText("<p><b>Negrito</b> e <i>italico</i></p>");
    expect(output).toContain("<strong>Negrito</strong>");
    expect(output).toContain("<em>italico</em>");
    expect(output).not.toContain("<b>");
    expect(output).not.toContain("<i>");
  });

  it("converts legacy plain text to display html", () => {
    const output = toDisplayHtml("Linha 1\nLinha 2");
    expect(output).toContain("<p>");
    expect(output).toContain("Linha 1");
    expect(output).toContain("<br>");
  });

  it("parses skill list by semicolon only", () => {
    expect(parseSkillsListInput("A; B; C")).toEqual(["A", "B", "C"]);
    expect(parseSkillsListInput("A; ; B ;")).toEqual(["A", "B"]);
    expect(parseSkillsListInput("React, Node.js; Docker")).toEqual(["React, Node.js", "Docker"]);
  });
});
