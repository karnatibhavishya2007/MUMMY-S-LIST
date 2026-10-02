import fs from "fs";

const app = fs.readFileSync("src/App.jsx", "utf8");

const sections = [
  app.match(/const vegetables = \[(.*?)\];/s)?.[1] || "",
  app.match(/const eats = \{(.*?)\};\s*const homeEssentials/s)?.[1] || "",
  app.match(/const homeEssentials = \{(.*?)\};/s)?.[1] || "",
];

const names = sections
  .flatMap((section) =>
    [...section.matchAll(/["']([^"']+)["']/g)].map((m) => m[1])
  )
  .filter((name) => name.length > 1);

const uniqueNames = [...new Set(names)];

const imageDir = "public/images";
fs.mkdirSync(imageDir, { recursive: true });

const badWords = [
  "flower",
  "beetle",
  "insect",
  "pest",
  "microscope",
  "diagram",
  "seedling",
  "botanical",
];

function filename(name) {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") + ".jpg"
  );
}

function score(title, name) {
  const t = title.toLowerCase();
  const n = name.toLowerCase();

  let value = 0;

  if (t.includes(n)) value += 20;

  for (const word of n.split(/\s+/)) {
    if (word.length > 2 && t.includes(word)) value += 5;
  }

  for (const word of badWords) {
    if (t.includes(word) && !n.toLowerCase().includes(word)) {
      value -= 20;
    }
  }

  return value;
}

const photoMap = {};

console.log(`Found ${uniqueNames.length} catalogue names.\n`);

for (const name of uniqueNames) {
  const output = `${imageDir}/${filename(name)}`;

  if (fs.existsSync(output)) {
    console.log(`✓ already exists: ${name}`);
    photoMap[name] = `/images/${filename(name)}`;
    continue;
  }

  try {
    const searchUrl =
      "https://commons.wikimedia.org/w/api.php" +
      "?action=query" +
      "&generator=search" +
      "&gsrsearch=" +
      encodeURIComponent(name) +
      "&gsrnamespace=6" +
      "&gsrlimit=10" +
      "&prop=imageinfo" +
      "&iiprop=url" +
      "&iiurlwidth=700" +
      "&format=json" +
      "&origin=*";

    const response = await fetch(searchUrl);

    if (!response.ok) {
      console.log(`✗ search failed: ${name}`);
      continue;
    }

    const data = await response.json();

    const candidates = Object.values(data.query?.pages || {})
      .map((page) => {
        const info = page.imageinfo?.[0];
        return {
          title: page.title || "",
          url: info?.thumburl || info?.url || "",
        };
      })
      .filter((item) => item.url)
      .sort((a, b) => score(b.title, name) - score(a.title, name));

    const chosen = candidates[0];

    if (!chosen) {
      console.log(`✗ no image: ${name}`);
      continue;
    }

    const imageResponse = await fetch(chosen.url);

    if (!imageResponse.ok) {
      console.log(`✗ download failed: ${name}`);
      continue;
    }

    const buffer = Buffer.from(await imageResponse.arrayBuffer());

    fs.writeFileSync(output, buffer);

    photoMap[name] = `/images/${filename(name)}`;

    console.log(`✓ ${name}`);
  } catch (error) {
    console.log(`✗ ${name}`);
  }
}

fs.writeFileSync(
  "generated-photo-map.json",
  JSON.stringify(photoMap, null, 2)
);

console.log("\n==============================");
console.log(`Downloaded ${Object.keys(photoMap).length} images.`);
console.log(`Images are in ${imageDir}/`);
console.log("==============================");
