import fs from "fs";

const source = fs.readFileSync("src/App.jsx", "utf8");

function getArray(name) {
  const match = source.match(
    new RegExp(`const ${name} = \\[(.*?)\\];`, "s")
  );

  if (!match) return [];

  return [...match[1].matchAll(/"([^"]+)"|'([^']+)'/g)]
    .map((m) => m[1] || m[2])
    .filter(Boolean);
}

function getObject(name) {
  const start = source.indexOf(`const ${name} = {`);
  if (start === -1) return {};

  let depth = 0;
  let end = -1;

  for (let i = start; i < source.length; i++) {
    if (source[i] === "{") depth++;
    if (source[i] === "}") {
      depth--;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }

  if (end === -1) return {};

  const block = source.slice(start, end);
  const result = {};

  const entries = [
    ...block.matchAll(
      /["']([^"']+)["']\s*:\s*\[([\s\S]*?)\]/g
    ),
  ];

  for (const entry of entries) {
    const names = [
      ...entry[2].matchAll(/"([^"]+)"|'([^']+)'/g),
    ].map((m) => m[1] || m[2]);

    result[entry[1]] = names;
  }

  return result;
}

const vegetables = getArray("vegetables");
const eats = getObject("eats");
const homeEssentials = getObject("homeEssentials");

const items = [];

for (const name of vegetables) {
  items.push({
    name,
    category: "Vegetables",
  });
}

for (const [subcategory, names] of Object.entries(eats)) {
  for (const name of names) {
    items.push({
      name,
      category: "Eats",
      subcategory,
    });
  }
}

for (const [subcategory, names] of Object.entries(homeEssentials)) {
  for (const name of names) {
    items.push({
      name,
      category: "Home Essentials",
      subcategory,
    });
  }
}

console.log(`Found ${items.length} real catalogue items.`);

function queriesFor(item) {
  const n = item.name;

  if (item.category === "Vegetables") {
    return [
      `${n} vegetable`,
      `${n} fresh vegetable`,
      `${n} raw vegetable`,
    ];
  }

  if (item.category === "Home Essentials") {
    return [
      `${n} household product`,
      `${n} product`,
      `${n} packaging`,
    ];
  }

  if (item.subcategory === "Spice Powders") {
    return [
      `${n} spice powder`,
      `${n} Indian spice`,
      `${n} masala powder`,
    ];
  }

  if (item.subcategory === "Whole Spices") {
    return [
      `${n} spice`,
      `${n} whole spice`,
      `${n} Indian spice`,
    ];
  }

  if (
    item.subcategory === "Dals & Pulses" ||
    item.subcategory === "Rice & Grains" ||
    item.subcategory === "Flours"
  ) {
    return [
      `${n} food ingredient`,
      `${n} grain food`,
      `${n} Indian food ingredient`,
    ];
  }

  return [
    `${n} food`,
    `${n} ingredient`,
    `${n} grocery`,
  ];
}

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function words(name) {
  return normalize(name)
    .split(/\s+/)
    .filter((word) => word.length >= 3);
}

const badWords = [
  "recipe",
  "restaurant",
  "menu",
  "person",
  "people",
  "man",
  "woman",
  "child",
  "baby",
  "military",
  "war",
  "army",
  "navy",
  "airforce",
  "economic",
  "economy",
  "politics",
  "election",
  "sign",
  "poster",
  "map",
  "drawing",
  "illustration",
  "cartoon",
  "painting",
  "artwork",
  "museum",
  "building",
  "architecture",
  "landscape",
  "animal",
  "dog",
  "cat",
  "fish",
  "chicken",
  "beef",
  "pork",
  "salmon",
  "prosciutto",
  "dinner",
  "lunch",
  "breakfast",
  "dish",
];

function score(result, item) {
  const title = normalize(result.title || "");
  const name = normalize(item.name);
  const itemWords = words(item.name);

  let score = 0;

  if (title === name) score += 200;

  if (title.includes(name)) score += 120;

  let matched = 0;

  for (const word of itemWords) {
    if (title.includes(word)) {
      matched++;
      score += 35;
    }
  }

  if (itemWords.length && matched === itemWords.length) {
    score += 80;
  }

  for (const bad of badWords) {
    if (title.includes(bad)) {
      score -= 150;
    }
  }

  return score;
}

const output = {};
const seenUrls = new Set();

for (let i = 0; i < items.length; i++) {
  const item = items[i];

  const candidates = [];

  for (const query of queriesFor(item)) {
    try {
      const url =
        "https://api.openverse.org/v1/images/?q=" +
        encodeURIComponent(query) +
        "&page_size=20";

      const response = await fetch(url);

      if (!response.ok) continue;

      const data = await response.json();

      for (const result of data.results || []) {
        if (!result.url) continue;

        if (seenUrls.has(result.url)) continue;

        candidates.push({
          ...result,
          query,
          score: score(result, item),
        });
      }
    } catch {}
  }

  candidates.sort((a, b) => b.score - a.score);

  const best = candidates[0];

  if (best && best.score >= 70) {
    output[item.name] = {
      url: best.url,
      title: best.title || "",
      score: best.score,
      source: best.foreign_landing_url || "",
    };

    seenUrls.add(best.url);

    console.log(
      `${i + 1}/${items.length} ✅ ${item.name} → ${best.title || "image"}`
    );
  } else {
    console.log(
      `${i + 1}/${items.length} ❌ ${item.name} → no reliable image`
    );
  }

  await new Promise((resolve) => setTimeout(resolve, 100));
}

fs.writeFileSync(
  "openverse-photo-map.json",
  JSON.stringify(output, null, 2)
);

console.log("");
console.log("====================================");
console.log(`Catalogue items: ${items.length}`);
console.log(`Reliable images: ${Object.keys(output).length}`);
console.log(`Missing images: ${items.length - Object.keys(output).length}`);
console.log("Created: openverse-photo-map.json");
console.log("====================================");
