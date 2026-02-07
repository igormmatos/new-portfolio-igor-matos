import React from "react";
import { renderToString } from "react-dom/server";
import { I18nProvider, selectLocalizedArray, selectLocalizedColumn, useI18n } from "../i18n";

const RenderKey = ({ keyName }: { keyName: string }) => {
  const { t } = useI18n();
  return <span>{t(keyName)}</span>;
};

describe("i18n helpers", () => {
  it("returns the translation for an existing key", () => {
    const html = renderToString(
      <I18nProvider>
        <RenderKey keyName="nav.home" />
      </I18nProvider>
    );
    expect(html).toContain("Início");
  });

  it("warns and returns the key for a missing translation", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const html = renderToString(
      <I18nProvider>
        <RenderKey keyName="missing.key.example" />
      </I18nProvider>
    );
    expect(warn).toHaveBeenCalled();
    expect(html).toContain("missing.key.example");
    warn.mockRestore();
  });

  it("keeps empty string as a valid localized value", () => {
    const record = { title_en: "" };
    const result = selectLocalizedColumn(record, "title", "en");
    expect(result).toBe("");
  });

  it("returns empty array when localized array field is not an array", () => {
    const record = { items_en: "" };
    const result = selectLocalizedArray(record, "items", "en");
    expect(result).toEqual([]);
  });
});
