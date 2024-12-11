export const toHeaderCase = (str: string): string => {
  return String(str)
    .replace(/^[^A-Za-z0-9]*|[^A-Za-z0-9]*$/g, "")
    .replace(/([a-z])([A-Z])/g, (_, a, b) => `${a}_${b.toLowerCase()}`)
    .replace(/[^A-Za-z0-9]+|_+/g, " ")
    .toLowerCase()
    .replace(/( ?)(\w+)( ?)/g, (_, a, b, c) => a + b.charAt(0).toUpperCase() + b.slice(1) + c);
};

export const toSentenceCase = (str: string): string => {
  const textcase = String(str)
    .replace(/^[^A-Za-z0-9]*|[^A-Za-z0-9]*$/g, "")
    .replace(/([a-z])([A-Z])/g, (_, a, b) => `${a}_${b.toLowerCase()}`)
    .replace(/[^A-Za-z0-9]+|_+/g, " ")
    .toLowerCase();

  return textcase.charAt(0).toUpperCase() + textcase.slice(1);
};

export const toApTitleCase = (str: string): string => {
  const stopwords = "a an and at but by for in nor of on or so the to up yet".split(" ");
  const splitOn = /(\s+|[-‑–—,:;!?()])/;

  return str
    .split(splitOn)
    .map((word, index, all) => {
      if (index % 2) return word;
      const lower = word.toLowerCase();
      if (index !== 0 && index !== all.length - 1 && stopwords.includes(lower)) {
        return lower;
      }
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join("");
};

export const fromSnakeCase = (str: string): string => {
  return String(str)
    .replace(/_+/g, " ")
    .replace(/([a-z])([A-Z])/g, (_, a, b) => `${a} ${b}`);
};

export const fromCamelCase = (str: string): string => {
  return String(str)
    .replace(/([a-z])([A-Z])/g, (_, a, b) => `${a} ${b}`)
    .replace(/([A-Z])([A-Z][a-z])/g, (_, a, b) => `${a} ${b}`);
};

export const slugify = (str: string | string[]): string => {
  if (Array.isArray(str)) {
    return str.map((s) => slugify(s)).join("-");
  }

  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "-")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};
