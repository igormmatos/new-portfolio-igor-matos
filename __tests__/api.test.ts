import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "../services/api";
import { supabase } from "../supabaseClient";

vi.mock("../supabaseClient", () => {
  return {
    supabase: {
      from: vi.fn(),
      functions: {
        invoke: vi.fn(),
      },
    },
  };
});

const makeBuilder = (responses: Partial<{
  single: any;
  order: any;
  insert: any;
  update: any;
  delete: any;
  upsert: any;
}>) => {
  const select = vi.fn().mockReturnValue({
    single: vi.fn().mockResolvedValue(responses.single ?? { data: null, error: null }),
    order: vi.fn().mockResolvedValue(responses.order ?? { data: [], error: null }),
  });
  const update = vi.fn().mockReturnValue({
    eq: vi.fn().mockReturnValue({
      select: vi.fn().mockResolvedValue(responses.update ?? { data: [], error: null }),
    }),
  });
  const insert = vi.fn().mockReturnValue({
    select: vi.fn().mockResolvedValue(responses.insert ?? { data: [], error: null }),
  });
  const del = vi.fn().mockReturnValue({
    eq: vi.fn().mockResolvedValue(responses.delete ?? { error: null }),
  });
  const upsert = vi.fn().mockResolvedValue(responses.upsert ?? { error: null });

  return { select, update, insert, delete: del, upsert };
};

describe("api i18n CRUD", () => {
  const sb = supabase as unknown as {
    from: ReturnType<typeof vi.fn>;
    functions: { invoke: ReturnType<typeof vi.fn> };
  };

  beforeEach(() => {
    sb.from.mockReset();
    sb.functions.invoke.mockReset();
  });

  it("adds localized fields on updateProject when translation succeeds", async () => {
    const builder = makeBuilder({});
    sb.from.mockReturnValue(builder);
    sb.functions.invoke.mockResolvedValue({
      data: {
        translations: {
          en: { title: "Title EN", description: "Desc EN" },
          fr: { title: "Title FR", description: "Desc FR" },
        },
      },
      error: null,
    });

    await api.updateProject("11111111-1111-1111-1111-111111111111", {
      title: "Titulo PT",
      description: "Desc PT",
    });

    const payload = builder.update.mock.calls[0][0];
    expect(payload.title).toBe("Titulo PT");
    expect(payload.title_pt).toBe("Titulo PT");
    expect(payload.title_en).toBe("Title EN");
    expect(payload.title_fr).toBe("Title FR");
    expect(payload.description_en).toBe("Desc EN");
    expect(payload.description_fr).toBe("Desc FR");
  });

  it("falls back to pt-BR when translation fails", async () => {
    const builder = makeBuilder({});
    sb.from.mockReturnValue(builder);
    sb.functions.invoke.mockResolvedValue({
      data: null,
      error: new Error("translation failed"),
    });

    await api.updateJourney("11111111-1111-1111-1111-111111111111", {
      title: "Titulo PT",
      description: "Desc PT",
    });

    const payload = builder.update.mock.calls[0][0];
    expect(payload.title_pt).toBe("Titulo PT");
    expect(payload.title_en).toBe("Titulo PT");
    expect(payload.title_fr).toBe("Titulo PT");
    expect(payload.description_fr).toBe("<p>Desc PT</p>");
  });

  it("preserves provided translations when translation fails", async () => {
    const builder = makeBuilder({});
    sb.from.mockReturnValue(builder);
    sb.functions.invoke.mockResolvedValue({
      data: null,
      error: new Error("translation failed"),
    });

    await api.updateProject("11111111-1111-1111-1111-111111111111", {
      title: "Titulo PT",
      title_en: "Existing EN",
      title_fr: "Existing FR",
    });

    const payload = builder.update.mock.calls[0][0];
    expect(payload.title_en).toBe("Existing EN");
    expect(payload.title_fr).toBe("Existing FR");
  });

  it("handles array fields for competencies", async () => {
    const builder = makeBuilder({});
    sb.from.mockReturnValue(builder);
    sb.functions.invoke.mockResolvedValue({
      data: {
        translations: {
          en: { items: ["One", "Two"] },
          fr: { items: ["Un", "Deux"] },
        },
      },
      error: null,
    });

    await api.createCompetency({
      title: "Categoria",
      icon: "fa-solid fa-code",
      items: ["Um", "Dois"],
      display_order: 0,
    } as any);

    const payload = builder.insert.mock.calls[0][0][0];
    expect(payload.items_pt).toEqual(["Um", "Dois"]);
    expect(payload.items_en).toEqual(["One", "Two"]);
    expect(payload.items_fr).toEqual(["Un", "Deux"]);
  });

  it("sanitizes rich text fields before save", async () => {
    const builder = makeBuilder({});
    sb.from.mockReturnValue(builder);
    sb.functions.invoke.mockResolvedValue({
      data: null,
      error: new Error("translation failed"),
    });

    await api.updateProject("11111111-1111-1111-1111-111111111111", {
      description: `<script>alert('x')</script><p onclick="hack()">Texto <a href="javascript:alert(1)">link</a></p>`,
    });

    const payload = builder.update.mock.calls[0][0];
    expect(payload.description).not.toContain("<script");
    expect(payload.description).not.toContain("onclick=");
    expect(payload.description).toContain('href="#"');
  });
});
