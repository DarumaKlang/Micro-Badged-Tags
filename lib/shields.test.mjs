import assert from "node:assert/strict";
import test from "node:test";
import {
  buildMarkdown,
  buildReactSnippet,
  isValidHttpUrl,
} from "./shields.ts";

const baseOptions = {
  text: 'Release "candidate"\nready',
  left: { kind: "text", text: "QA [review] `now`" },
  leftColor: "#123456",
  textColor: "#abcdef",
  style: "flat",
};

test("React snippet serializes text and left segment as valid JSX expressions", () => {
  const snippet = buildReactSnippet(baseOptions, "md");

  assert.ok(
    snippet.includes(`text={${JSON.stringify(baseOptions.text)}}`),
  );
  assert.ok(
    snippet.includes(
      `left={{ kind: "text", text: ${JSON.stringify(baseOptions.left.text)} }}`,
    ),
  );
  assert.ok(snippet.includes('leftColor={"#123456"}'));
});

test("React snippet handles icon slugs", () => {
  const snippet = buildReactSnippet(
    { ...baseOptions, left: { kind: "icon", icon: "github" } },
    "lg",
  );

  assert.ok(snippet.includes('left={{ kind: "icon", icon: "github" }}'));
});

test("Markdown escapes alt text and supports encoded HTTP destinations", () => {
  const markdown = buildMarkdown(
    { ...baseOptions, text: "Ready" },
    "https://example.com/docs page?next=(release)",
  );

  assert.ok(markdown.startsWith("[![QA \\[review\\] \\`now\\`: Ready]("));
  assert.ok(markdown.endsWith(`(<${new URL("https://example.com/docs page?next=(release)").href}>)`));
});

test("Markdown rejects non-HTTP links", () => {
  assert.equal(isValidHttpUrl("javascript:alert(1)"), false);
  assert.equal(isValidHttpUrl("/relative/path"), false);
  assert.equal(isValidHttpUrl("https://user:password@example.com"), false);
  assert.throws(
    () => buildMarkdown(baseOptions, "javascript:alert(1)"),
    /http or https/,
  );
});
