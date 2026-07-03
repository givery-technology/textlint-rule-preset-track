"use strict";

// text-checker から移植した track ルールの検査結果の互換性テスト

const assert = require("assert");
const { TextlintKernel } = require("@textlint/kernel");
const markdownPlugin = require("@textlint/textlint-plugin-markdown");
const rules = require("../lib/rules/track_rules");

function lint(text, ruleId, options, filePath) {
  const kernel = new TextlintKernel();
  return kernel
    .lintText(text, {
      filePath: filePath || "/test/chapter1.md",
      ext: ".md",
      plugins: [
        { pluginId: "markdown", plugin: markdownPlugin.default || markdownPlugin },
      ],
      rules: [{ ruleId, rule: rules[ruleId], options: options || true }],
    })
    .then((result) => result.messages);
}

describe("track rules (text-checker 移植)", function () {
  describe("no-ten", function () {
    it("読点「、」を検出する", async function () {
      const messages = await lint("これは、テストです。\n", "no-ten");
      assert.strictEqual(messages.length, 1);
      assert.strictEqual(messages[0].line, 1);
    });

    it("コードブロック内・インラインコード内でも検出する", async function () {
      const messages = await lint("```js\nconst a = '、'\n```\n\n`、` です\n", "no-ten");
      assert.strictEqual(messages.length, 2);
    });

    it("読点がなければ何も報告しない", async function () {
      const messages = await lint("これは, テストです。\n", "no-ten");
      assert.strictEqual(messages.length, 0);
    });
  });

  describe("no-codeprep", function () {
    it("codeprep を検出する", async function () {
      const messages = await lint("codeprep を使う\n", "no-codeprep");
      assert.strictEqual(messages.length, 1);
    });

    it("URL と imageName は許可される", async function () {
      const messages = await lint(
        "https://example.codeprep.jp/foo\nimageName: codeprep/base\n",
        "no-codeprep"
      );
      assert.strictEqual(messages.length, 0);
    });
  });

  describe("no-hankaku-comma-around-zenkaku", function () {
    it("全角文字に隣接する半角カンマを検出する", async function () {
      const messages = await lint("これは,テストです\n", "no-hankaku-comma-around-zenkaku");
      assert.strictEqual(messages.length, 1);
    });

    it("remote セクションでは検査しない", async function () {
      const messages = await lint(
        "### remote\n\nこれは,テストです\n",
        "no-hankaku-comma-around-zenkaku"
      );
      assert.strictEqual(messages.length, 0);
    });

    it("コードブロック内は検査しない", async function () {
      const messages = await lint(
        "```js\nこれは,テスト\n```\n",
        "no-hankaku-comma-around-zenkaku"
      );
      assert.strictEqual(messages.length, 0);
    });
  });

  describe("hankaku-comma-space", function () {
    it("カンマの後にスペースがない場合に検出する", async function () {
      const messages = await lint("a,b とする\n", "hankaku-comma-space");
      assert.strictEqual(messages.length, 1);
    });

    it("数値のカンマ区切りなどは許可される", async function () {
      const messages = await lint("1,000 円と {,} と `,` です\n", "hankaku-comma-space");
      assert.strictEqual(messages.length, 0);
    });
  });

  describe("no-zenkaku-num", function () {
    it("全角数字を検出する (コードブロック内も対象)", async function () {
      const messages = await lint("```\nｘ = １\n```\n", "no-zenkaku-num");
      assert.strictEqual(messages.length, 1);
    });
  });

  describe("no-kanji-num", function () {
    it("漢数字を検出する", async function () {
      const messages = await lint("三個のりんご\n", "no-kanji-num");
      assert.strictEqual(messages.length, 1);
    });

    it("慣用表現 (exclude) は許可される", async function () {
      const messages = await lint("四則演算と統一と十分な余白\n", "no-kanji-num");
      assert.strictEqual(messages.length, 0);
    });

    it("コードブロック内は検査しない", async function () {
      const messages = await lint("```\nx = 三\n```\n", "no-kanji-num");
      assert.strictEqual(messages.length, 0);
    });
  });

  describe("comment-out-textlint-directive", function () {
    it("コメントアウトされていない textlint ディレクティブを検出する", async function () {
      const messages = await lint(
        "<!-- textlint-disable foo -->\n",
        "comment-out-textlint-directive"
      );
      assert.strictEqual(messages.length, 1);
    });

    it("コメントアウトされていれば許可される", async function () {
      const messages = await lint(
        "// <!-- textlint-disable foo -->\n",
        "comment-out-textlint-directive"
      );
      assert.strictEqual(messages.length, 0);
    });

    it("README.md は検査しない", async function () {
      const messages = await lint(
        "<!-- textlint-disable foo -->\n",
        "comment-out-textlint-directive",
        true,
        "/test/README.md"
      );
      assert.strictEqual(messages.length, 0);
    });
  });

  describe("comment-out-mdformatter-directive", function () {
    it("README.md も検査対象になる", async function () {
      const messages = await lint(
        "<!-- mdformatter-disable -->\n",
        "comment-out-mdformatter-directive",
        true,
        "/test/README.md"
      );
      assert.strictEqual(messages.length, 1);
    });
  });

  describe("code-block-language", function () {
    it("言語指定のないコードブロックを検出する", async function () {
      const messages = await lint("## setup\n\n```\ncode\n```\n", "code-block-language");
      assert.strictEqual(messages.length, 1);
      assert.strictEqual(messages[0].line, 3);
    });

    it("言語指定があれば許可される", async function () {
      const messages = await lint("## setup\n\n```sh\ncode\n```\n", "code-block-language");
      assert.strictEqual(messages.length, 0);
    });

    it("main セクションでは任意", async function () {
      const messages = await lint("### main\n\n```\ncode\n```\n", "code-block-language");
      assert.strictEqual(messages.length, 0);
    });
  });

  describe("textlint-directive-pair", function () {
    it("対応が取れていれば何も報告しない", async function () {
      const messages = await lint(
        "<!-- textlint-disable foo -->\ntext\n<!-- textlint-enable foo -->\n",
        "textlint-directive-pair"
      );
      assert.strictEqual(messages.length, 0);
    });

    it("enable のない disable を検出する", async function () {
      const messages = await lint(
        "<!-- textlint-disable foo -->\ntext\n",
        "textlint-directive-pair"
      );
      assert.strictEqual(messages.length, 1);
    });

    it("ルール名ごとに対応を判定する", async function () {
      const messages = await lint(
        "<!-- textlint-disable foo -->\n<!-- textlint-disable bar -->\n<!-- textlint-enable foo -->\n",
        "textlint-directive-pair"
      );
      assert.strictEqual(messages.length, 1);
    });
  });

  describe("mdformatter-directive-pair", function () {
    it("enable のない disable を検出する", async function () {
      const messages = await lint(
        "<!-- mdformatter-disable -->\ntext\n",
        "mdformatter-directive-pair"
      );
      assert.strictEqual(messages.length, 1);
    });
  });
});
