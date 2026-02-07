import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

type TextValue = string | string[];

type TranslateRequest = {
  texts: Record<string, TextValue>;
  sourceLang?: string;
};

type TranslateResponse = {
  translations: {
    en: Record<string, TextValue>;
    fr: Record<string, TextValue>;
  };
};

const DEFAULT_API_URL = "https://api-free.deepl.com/v2/translate";

const toDeepLTarget = (lang: "en" | "fr") => (lang === "en" ? "EN" : "FR");
const toDeepLSource = (lang: string) => {
  if (lang.toUpperCase() === "PT-BR") return "PT";
  return lang.toUpperCase();
};

const flattenTexts = (texts: Record<string, TextValue>) => {
  const entries: { key: string; index: number; text: string }[] = [];
  Object.entries(texts).forEach(([key, value]) => {
    if (typeof value === "string") {
      if (value.trim().length > 0) entries.push({ key, index: 0, text: value });
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item, idx) => {
        if (typeof item === "string" && item.trim().length > 0) {
          entries.push({ key, index: idx, text: item });
        }
      });
    }
  });
  return entries;
};

const rebuildTexts = (
  base: Record<string, TextValue>,
  entries: { key: string; index: number; text: string }[],
  translated: string[],
) => {
  const result: Record<string, TextValue> = {};
  Object.entries(base).forEach(([key, value]) => {
    result[key] = Array.isArray(value) ? [...value] : value;
  });
  entries.forEach((entry, i) => {
    const current = result[entry.key];
    if (typeof current === "string") {
      result[entry.key] = translated[i] ?? current;
      return;
    }
    if (Array.isArray(current)) {
      const copy = [...current];
      copy[entry.index] = translated[i] ?? copy[entry.index];
      result[entry.key] = copy;
    }
  });
  return result;
};

const translateTexts = async (
  texts: Record<string, TextValue>,
  target: "en" | "fr",
  sourceLang: string,
) => {
  const apiKey = Deno.env.get("DEEPL_API_KEY");
  if (!apiKey) {
    throw new Error("DEEPL_API_KEY is not set");
  }

  const apiUrl = Deno.env.get("DEEPL_API_URL") || DEFAULT_API_URL;
  const flat = flattenTexts(texts);
  if (flat.length === 0) return { ...texts };

  const body = new URLSearchParams();
  body.append("source_lang", toDeepLSource(sourceLang));
  body.append("target_lang", toDeepLTarget(target));
  body.append("tag_handling", "html");
  flat.forEach((item) => body.append("text", item.text));

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `DeepL-Auth-Key ${apiKey}`,
    },
    body,
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`DeepL error: ${response.status} ${errText}`);
  }

  const data = await response.json();
  const translated = (data?.translations || []).map((t: any) => t?.text ?? "");
  return rebuildTexts(texts, flat, translated);
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const requireUser = async (req: Request) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("SUPABASE_URL or SUPABASE_ANON_KEY not set");
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;

  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    method: "GET",
    headers: {
      "Authorization": authHeader,
      "apikey": supabaseAnonKey,
    },
  });

  if (!response.ok) return null;
  return await response.json();
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const user = await requireUser(req);
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const { texts, sourceLang = "PT-BR" } = (await req.json()) as TranslateRequest;
    if (!texts || typeof texts !== "object") {
      return new Response("Invalid payload", { status: 400, headers: corsHeaders });
    }

    const [en, fr] = await Promise.all([
      translateTexts(texts, "en", sourceLang),
      translateTexts(texts, "fr", sourceLang),
    ]);

    const payload: TranslateResponse = { translations: { en, fr } };
    return new Response(JSON.stringify(payload), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error?.message || error) }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
