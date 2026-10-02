
import { supabase } from "./lib/supabase";

import { useEffect, useMemo, useState } from "react";
import openversePhotoMap from "../openverse-photo-map.json";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  ClipboardList,
  Edit3,
  History,
  Home,
  Link2,
  Minus,
  Plus,
  Search,
  Share2,
  ShoppingCart,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

const STORAGE_KEY = "mummys-list-v1";
const CHANNEL_NAME = "mummys-list-sync";

const categoryMeta = {
  Vegetables: {
    icon: "🥬",
    color: "green",
  },
  Fruits: {
    icon: "🍎",
    color: "red",
  },
  Eats: {
    icon: "🌾",
    color: "yellow",
  },
  "Home Essentials": {
    icon: "🏠",
    color: "peach",
  },
};

const vegetables = [
  "Potato",
  "Tomato",
  "Onion",
  "Carrot",
  "Radish",
  "Beetroot",
  "Sweet Potato",
  "Cabbage",
  "Cauliflower",
  "Spinach",
  "Fenugreek Leaves",
  "Coriander Leaves",
  "Green Peas",
  "Green Beans",
  "Cluster Beans",
  "Broad Beans",
  "Okra",
  "Brinjal",
  "Bottle Gourd",
  "Bitter Gourd",
  "Ridge Gourd",
  "Snake Gourd",
  "Ash Gourd",
  "Pointed Gourd",
  "Ivy Gourd",
  "Drumstick",
  "Raw Banana",
  "Pumpkin",
  "Cucumber",
  "Capsicum",
  "Green Chilli",
  "Corn",
  "Mushroom",
  "Yam",
  "Spring Onion",
  "Garlic",
  "Ginger",
  "Mustard Greens",
  "Field Beans",
  "Fresh Pigeon Peas",
  "Elephant Foot Yam",
  "Green Chickpeas",
];

const fruits = [
  "Apple",
  "Banana",
  "Orange",
  "Sweet Lime",
  "Lemon",
  "Mango",
  "Papaya",
  "Watermelon",
  "Muskmelon",
  "Grapes",
  "Pomegranate",
  "Guava",
  "Pineapple",
  "Sapota",
  "Custard Apple",
  "Coconut",
  "Pear",
  "Kiwi",
  "Strawberry",
  "Dragon Fruit",
];

const eats = {
  "Whole Spices": [
    "Black Pepper",
    "Cumin Seeds",
    "Coriander Seeds",
    "Mustard Seeds",
    "Nigella Seeds",
    "Sesame Seeds",
    "Poppy Seeds",
    "Cardamom",
    "Cloves",
    "Cinnamon",
    "Bay Leaf",
    "Star Anise",
    "Mace",
    "Nutmeg",
    "Dry Red Chillies",
    "Saffron",
    "Turmeric",
    "Asafoetida",
    "Tamarind",
    "Curry Leaves",
  ],

  "Spice Powders": [
    "Red Chilli Powder",
    "Garam Masala",
    "Curry Powder",
    "Biryani Masala",
    "Pav Bhaji Masala",
    "Fish Masala",
    "Chutney Powder",
    "Idli Podi",
  ],

  "Dals & Pulses": [
    "Toor Dal",
    "Urad Dal",
    "Split Peas",
    "Chickpeas",
    "Kidney Beans",
    "Black-Eyed Peas",
    "Pigeon Pea",
    "Field Beans",
    "Soybeans",
  ],

  "Rice & Grains": [
    "Rice",
    "Basmati Rice",
    "Brown Rice",
    "Broken Rice",
    "Wheat",
    "Whole Wheat",
    "Ragi",
    "Bajra",
    "Foxtail Millet",
    "Pearl Millet",
    "Quinoa",
    "Oats",
    "Barley",
    "Cornmeal",
  ],

  Flours: [
    "Whole Wheat Flour",
    "All-Purpose Flour",
    "Semolina",
    "Rice Flour",
    "Corn Flour",
    "Barley Flour",
    "Oats Flour",
    "Gram Flour",
    "Finger Millet Flour",
    "Pearl Millet Flour",
    "Sorghum Flour",
    "Roasted Gram Flour",
    "Black Gram Flour",
    "Yellow Moong Flour",
    "Soy Flour",
    "Buckwheat Flour",
    "Water Chestnut Flour",
    "Amaranth Flour",
    "Tapioca Flour",
    "Spiced Wheat & Chickpea Blend",
    "Roasted Multigrain & Spice Blend",
    "Multigrain Flour",
  ],

  "Dry Foods & Cooking Ingredients": [
    "Sugar",
    "Salt",
    "Jaggery",
    "Cooking Oil",
    "Ghee",
    "Vermicelli",
    "Poha",
    "Sabudana",
    "Coconut",
    "Desiccated Coconut",
    "Peanuts",
    "Almonds",
    "Cashews",
    "Raisins",
    "Walnuts",
    "Dates",
    "Pickle",
    "Papad",
    "Tea",
    "Coffee",
  ],
};

const homeEssentials = {
  Cleaning: [
    "Dishwash Liquid",
    "Dishwash Bar",
    "Floor Cleaner",
    "Toilet Cleaner",
    "Glass Cleaner",
    "Disinfectant",
    "Cleaning Brush",
    "Scrub Pad",
    "Broom",
    "Dustpan",
  ],

  Household: [
    "Garbage Bags",
    "Tissues",
    "Kitchen Towels",
    "Aluminium Foil",
    "Cling Film",
    "Storage Bags",
    "Plastic Buckets",
    "Mugs",
    "Clothes Hangers",
    "Mosquito Repellent",
  ],

  "Personal Care": [
    "Handwash",
    "Hand Sanitizer",
    "Shampoo",
    "Conditioner",
    "Toothpaste",
    "Toothbrush",
    "Bath Soap",
    "Face Wash",
    "Hair Oil",
    "Body Lotion",
  ],

  Laundry: [
    "Detergent Powder",
    "Detergent Liquid",
    "Fabric Softener",
    "Laundry Bar",
    "Bleach",
    "Laundry Brush",
    "Cloth Clips",
  ],

  "Kitchen & Utility": [
    "Sponges",
    "Food Storage Containers",
    "Water Bottles",
    "Disposable Plates",
    "Disposable Cups",
    "Kitchen Gloves",
    "Matchbox",
    "Lighter",
  ],
};

const emojiMap = {
  Potato: "🥔",
  Tomato: "🍅",
  Onion: "🧅",
  Carrot: "🥕",
  Radish: "🌱",
  Beetroot: "🫜",
  "Sweet Potato": "🍠",
  Cabbage: "🥬",
  Cauliflower: "🥦",
  Spinach: "🥬",
  "Fenugreek Leaves": "🌿",
  "Coriander Leaves": "🌿",
  "Green Peas": "🫛",
  "Green Beans": "🫘",
  "Cluster Beans": "🫘",
  "Broad Beans": "🫘",
  Okra: "🌱",
  Brinjal: "🍆",
  "Bottle Gourd": "🥒",
  "Bitter Gourd": "🥒",
  "Ridge Gourd": "🥒",
  "Snake Gourd": "🥒",
  "Ash Gourd": "🎃",
  "Pointed Gourd": "🥒",
  "Ivy Gourd": "🥒",
  Drumstick: "🌿",
  "Raw Banana": "🍌",
  "Raw Papaya": "🥭",
  Pumpkin: "🎃",
  Cucumber: "🥒",
  Capsicum: "🫑",
  "Green Chilli": "🌶️",
  Corn: "🌽",
  Mushroom: "🍄",
  Yam: "🥔",
  "Spring Onion": "🌱",
  Garlic: "🧄",
  Ginger: "🫚",
  "Green Amaranth": "🌿",
  "Mustard Greens": "🌿",
  "Gongura Leaves": "🌿",
  "Sorrel Leaves": "🌿",
  "Yellow Cucumber": "🥒",
  "Field Beans": "🫘",
  "Fresh Pigeon Peas": "🫘",
  "Raw Tamarind": "🌿",
  "Plantain Flower": "🌸",
  "Banana Stem": "🌿",
  "Elephant Foot Yam": "🥔",
  "Green Chickpeas": "🫛",

  "Black Pepper": "⚫",
  "White Pepper": "⚪",
  "Cumin Seeds": "🌿",
  "Coriander Seeds": "🌿",
  "Mustard Seeds": "🌿",
  "Fenugreek Seeds": "🌿",
  "Fennel Seeds": "🌿",
  "Carom Seeds": "🌿",
  "Nigella Seeds": "🌿",
  "Sesame Seeds": "🌿",
  "Poppy Seeds": "🌿",
  Cardamom: "🌿",
  Cloves: "🌿",
  Cinnamon: "🪵",
  "Bay Leaf": "🍃",
  "Star Anise": "⭐",
  Mace: "🌿",
  Nutmeg: "🌰",
  "Dry Red Chillies": "🌶️",
  Saffron: "🌸",
  Turmeric: "🟡",
  Asafoetida: "🌿",
  Tamarind: "🌿",
  "Dry Ginger": "🫚",
  "Curry Leaves": "🍃",
  Kokum: "🫐",

  "Turmeric Powder": "🟡",
  "Red Chilli Powder": "🌶️",
  "Coriander Powder": "🌿",
  "Cumin Powder": "🌿",
  "Black Pepper Powder": "⚫",
  "Garam Masala": "🌿",
  "Sambar Powder": "🌶️",
  "Rasam Powder": "🌶️",
  "Curry Powder": "🌿",
  "Biryani Masala": "🌿",
  "Chaat Masala": "🌿",
  "Pav Bhaji Masala": "🌿",
  "Kitchen King Masala": "🌿",
  "Chicken Masala": "🌿",
  "Meat Masala": "🌿",
  "Fish Masala": "🌿",
  "Pulihora Powder": "🌿",
  "Gongura Powder": "🌿",
  "Chutney Powder": "🌿",
  "Peanut Chutney Powder": "🥜",
  "Idli Podi": "🌶️",
  "Vangi Bath Masala": "🌿",

  "Toor Dal": "🫘",
  "Moong Dal": "🫘",
  "Masoor Dal": "🫘",
  "Chana Dal": "🫘",
  "Urad Dal": "🫘",
  "Split Peas": "🫛",
  "Whole Green Gram": "🫘",
  "Whole Black Gram": "🫘",
  Chickpeas: "🫘",
  "Black Chickpeas": "🫘",
  "Kidney Beans": "🫘",
  "Black-Eyed Peas": "🫘",
  Cowpeas: "🫘",
  "Horse Gram": "🫘",
  "Pigeon Pea": "🫘",
  "Red Peas": "🫘",
  Soybeans: "🫘",

  Rice: "🍚",
  "Sona Masuri Rice": "🍚",
  "Basmati Rice": "🍚",
  "Brown Rice": "🍚",
  "Raw Rice": "🍚",
  "Parboiled Rice": "🍚",
  "Broken Rice": "🍚",
  Wheat: "🌾",
  "Whole Wheat": "🌾",
  Semolina: "🌾",
  Ragi: "🌾",
  Jowar: "🌾",
  Bajra: "🌾",
  "Foxtail Millet": "🌾",
  "Little Millet": "🌾",
  "Pearl Millet": "🌾",
  "Finger Millet": "🌾",
  Quinoa: "🌾",
  Oats: "🌾",
  Barley: "🌾",
  Cornmeal: "🌽",

  "Wheat Flour": "🌾",
  "Rice Flour": "🌾",
  "Gram Flour": "🌾",
  Maida: "🌾",
  "Ragi Flour": "🌾",
  "Jowar Flour": "🌾",
  "Bajra Flour": "🌾",
  "Corn Flour": "🌽",
  "Multigrain Flour": "🌾",
  "Oat Flour": "🌾",
  Besan: "🌾",

  Sugar: "🧂",
  Salt: "🧂",
  Jaggery: "🟤",
  "Cooking Oil": "🫗",
  Ghee: "🧈",
  Vermicelli: "🍜",
  Poha: "🌾",
  Sabudana: "⚪",
  Coconut: "🥥",
  "Desiccated Coconut": "🥥",
  Peanuts: "🥜",
  Almonds: "🥜",
  Cashews: "🥜",
  Raisins: "🍇",
  Walnuts: "🥜",
  Dates: "🌴",
  Pickle: "🥫",
  Papad: "🥠",
  Tea: "🍵",
  Coffee: "☕",

  "Dishwash Liquid": "🧴",
  "Dishwash Bar": "🧼",
  "Floor Cleaner": "🧴",
  "Toilet Cleaner": "🧴",
  "Glass Cleaner": "🧴",
  Disinfectant: "🧴",
  "Scrub Pad": "🧽",
  "Steel Scrubber": "🧽",
  "Cleaning Cloth": "🧻",
  "Garbage Bags": "🗑️",
  Broom: "🧹",
  Mop: "🧹",
  "Toilet Paper": "🧻",
  Tissues: "🧻",
  "Paper Towels": "🧻",
  "Aluminium Foil": "📦",
  "Cling Film": "📦",
  "Butter Paper": "📄",
  Toothpicks: "🪥",
  Matchbox: "🔥",
  Candles: "🕯️",
  Handwash: "🧴",
  "Hand Sanitizer": "🧴",
  "Bath Soap": "🧼",
  Shampoo: "🧴",
  Toothpaste: "🪥",
  Toothbrush: "🪥",
  "Hair Oil": "🧴",
  "Detergent Powder": "🧺",
  "Detergent Liquid": "🧴",
  "Fabric Softener": "🧴",
  "Laundry Bar": "🧼",
  Bleach: "🧴",
  Sponges: "🧽",
  "Kitchen Towels": "🧻",
  "Storage Bags": "🛍️",
  "Food Storage Containers": "📦",
  "Water Bottles": "🍼",
  "Disposable Plates": "🍽️",
  "Disposable Cups": "🥤",
};

const photoMap = Object.fromEntries(
  Object.entries(openversePhotoMap).map(
    ([name, data]) => [name, data.url]
  )
);

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function makeId(prefix = "id") {
  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}


function getEmoji(name) {
  return emojiMap[name] || "🛒";
}

function getPhotoUrl(name) {
  return photoMap[name] || "";
}



function createCatalogueItem(
  name,
  category,
  subcategory,
  extra = {}
) {
  return {
    id:
      extra.id ||
      `${slugify(category)}-${slugify(name)}`,
    name,
    teluguName: extra.teluguName || "",
    category,
    subcategory,
    custom: Boolean(extra.custom),
  };
}

const teluguNames = {
  "Whole Wheat Flour": "గోధుమ పిండి",
  "All-Purpose Flour": "మైదా పిండి",
  "Semolina": "బొండా పిండి / సుజీ / రవ్వ",
  "Rice Flour": "బియ్యం పిండి",
  "Corn Flour": "మొక్కజొన్న పిండి",
  "Barley Flour": "యవల పిండి / జావ పిండి",
  "Oats Flour": "ఓట్స్ పిండి",
  "Gram Flour": "సెనగ పిండి",
  "Finger Millet Flour": "రాగి పిండి / తైదలు పిండి",
  "Pearl Millet Flour": "సజ్జ పిండి",
  "Sorghum Flour": "జొన్న పిండి",
  "Roasted Gram Flour": "పుట్నాల పిండి / పప్పుల పిండి",
  "Black Gram Flour": "మినప పిండి",
  "Yellow Moong Flour": "పెసర పిండి",
  "Soy Flour": "సోయాబీన్ పిండి",
  "Buckwheat Flour": "కుట్టు పిండి",
  "Water Chestnut Flour": "సింఘాడా పిండి",
  "Amaranth Flour": "రాజ్‌గిరా పిండి",
  "Tapioca Flour": "సగ్గుబియ్యం పిండి",
  "Spiced Wheat & Chickpea Blend": "మిస్సీ పిండి",
  "Roasted Multigrain & Spice Blend": "భజని పిండి",
  "Multigrain Flour": "మల్టీగ్రెయిన్ పిండి",

  "Dishwash Liquid": "గిన్నెలు కడిగే లిక్విడ్",
  "Dishwash Bar": "గిన్నెలు కడిగే బార్",
  "Floor Cleaner": "నేల క్లీనర్",
  "Toilet Cleaner": "టాయిలెట్ క్లీనర్",
  "Glass Cleaner": "గ్లాస్ క్లీనర్",
  "Disinfectant": "క్రిమిసంహారక లిక్విడ్",
  "Cleaning Brush": "క్లీనింగ్ బ్రష్",
  "Scrub Pad": "స్క్రబ్ ప్యాడ్",
  "Broom": "చీపురు",
  "Dustpan": "చెత్త ఎత్తుకునే డస్ట్‌పాన్",
  "Garbage Bags": "చెత్త సంచులు",
  "Tissues": "టిష్యూ పేపర్లు",
  "Kitchen Towels": "కిచెన్ టవల్స్",
  "Aluminium Foil": "అల్యూమినియం ఫాయిల్",
  "Cling Film": "క్లింగ్ ఫిల్మ్",
  "Storage Bags": "స్టోరేజ్ బ్యాగులు",
  "Plastic Buckets": "ప్లాస్టిక్ బకెట్లు",
  "Mugs": "మగ్గులు",
  "Clothes Hangers": "బట్టలు వేలాడదీసే హ్యాంగర్లు",
  "Mosquito Repellent": "దోమల మందు",
  "Conditioner": "హెయిర్ కండిషనర్",
  "Bath Soap": "స్నానం సబ్బు",
  "Face Wash": "ఫేస్ వాష్",
  "Body Lotion": "బాడీ లోషన్",
  "Detergent Powder": "బట్టల సర్ఫ్",
  "Detergent Liquid": "బట్టలు ఉతికే లిక్విడ్",
  "Fabric Softener": "ఫ్యాబ్రిక్ సాఫ్టెనర్",
  "Laundry Brush": "బట్టలు ఉతికే బ్రష్",
  "Cloth Clips": "బట్టల క్లిప్పులు",
  "Disposable Plates": "వాడేసి పడేసే ప్లేట్లు",
  "Disposable Cups": "వాడేసి పడేసే కప్పులు",
  "Kitchen Gloves": "కిచెన్ గ్లౌజులు",
  "Matchbox": "అగ్గిపెట్టె",
  "Lighter": "లైటర్",

  "Potato": "ఆలుగడ్డ",
  "Tomato": "టమాటా",
  "Onion": "ఉల్లిగడ్డ",
  "Carrot": "క్యారెట్",
  "Radish": "ముల్లంగి",
  "Beetroot": "బీట్‌రూట్",
  "Sweet Potato": "చిలగడదుంప",
  "Cabbage": "క్యాబేజీ",
  "Cauliflower": "కాలీఫ్లవర్",
  "Spinach": "పాలకూర",
  "Fenugreek Leaves": "మెంతికూర",
  "Coriander Leaves": "కొత్తిమీర",
  "Green Peas": "పచ్చి బఠాణీలు",
  "Green Beans": "చిక్కుడు",
  "Cluster Beans": "గోరుచిక్కుడు",
  "Broad Beans": "బచ్చలి చిక్కుడు",
  "Okra": "బెండకాయ",
  "Brinjal": "వంకాయ",
  "Bottle Gourd": "సొరకాయ",
  "Bitter Gourd": "కాకరకాయ",
  "Ridge Gourd": "బీరకాయ",
  "Snake Gourd": "పొట్లకాయ",
  "Ash Gourd": "బూడిద గుమ్మడికాయ",
  "Pointed Gourd": "పొట్లకాయ",
  "Ivy Gourd": "దొండకాయ",
  "Drumstick": "మునగకాయ",
  "Raw Banana": "అరటికాయ",
  "Pumpkin": "గుమ్మడికాయ",
  "Cucumber": "దోసకాయ",
  "Capsicum": "క్యాప్సికమ్",
  "Green Chilli": "పచ్చిమిర్చి",
  "Corn": "మొక్కజొన్న",
  "Mushroom": "పుట్టగొడుగు",
  "Yam": "కందగడ్డ",
  "Spring Onion": "ఉల్లికాడలు",
  "Garlic": "వెల్లుల్లి",
  "Ginger": "అల్లం",
  "Mustard Greens": "ఆవ ఆకులు",
  "Field Beans": "చిక్కుడు",
  "Fresh Pigeon Peas": "కందులు",
  "Elephant Foot Yam": "కంద",
  "Green Chickpeas": "పచ్చి శనగలు",

  "Black Pepper": "మిరియాలు",
  "Cumin Seeds": "జీలకర్ర",
  "Coriander Seeds": "ధనియాలు",
  "Mustard Seeds": "ఆవాలు",
  "Nigella Seeds": "నల్లజీలకర్ర",
  "Sesame Seeds": "నువ్వులు",
  "Poppy Seeds": "గసగసాలు",
  "Cardamom": "ఏలకులు",
  "Cloves": "లవంగాలు",
  "Cinnamon": "దాల్చిన చెక్క",
  "Bay Leaf": "బిర్యానీ ఆకు",
  "Star Anise": "అనాసపువ్వు",
  "Mace": "జాపత్రి",
  "Nutmeg": "జాజికాయ",
  "Dry Red Chillies": "ఎండుమిర్చి",
  "Saffron": "కుంకుమపువ్వు",
  "Turmeric": "పసుపు",
  "Asafoetida": "ఇంగువ",
  "Tamarind": "చింతపండు",
  "Curry Leaves": "కరివేపాకు",

  "Red Chilli Powder": "కారం",
  "Garam Masala": "గరం మసాలా",
  "Curry Powder": "కర్రీ పౌడర్",
  "Biryani Masala": "బిర్యానీ మసాలా",
  "Pav Bhaji Masala": "పావ్ భాజీ మసాలా",
  "Chicken Masala": "చికెన్ మసాలా",
  "Fish Masala": "ఫిష్ మసాలా",
  "Chutney Powder": "చట్నీ పొడి",
  "Idli Podi": "ఇడ్లీ పొడి",

  "Toor Dal": "కందిపప్పు",
  "Urad Dal": "మినపప్పు",
  "Split Peas": "పచ్చి బఠాణీ పప్పు",
  "Chickpeas": "శనగలు",
  "Kidney Beans": "రాజ్మా",
  "Black-Eyed Peas": "అలసందలు",
  "Pigeon Pea": "కందులు",
  "Soybeans": "సోయాబీన్స్",

  "Rice": "బియ్యం",
  "Basmati Rice": "బాస్మతి బియ్యం",
  "Brown Rice": "బ్రౌన్ రైస్",
  "Broken Rice": "నూకలు",
  "Wheat": "గోధుమలు",
  "Whole Wheat": "గోధుమలు",
  "Ragi": "రాగులు",
  "Bajra": "సజ్జలు",
  "Foxtail Millet": "కొర్రలు",
  "Pearl Millet": "సజ్జలు",
  "Quinoa": "క్వినోవా",
  "Oats": "ఓట్స్",
  "Barley": "బార్లీ",
  "Cornmeal": "మొక్కజొన్న పిండి",

  "Sugar": "చక్కెర",
  "Salt": "ఉప్పు",
  "Jaggery": "బెల్లం",
  "Cooking Oil": "వంట నూనె",
  "Ghee": "నెయ్యి",
  "Vermicelli": "సేమ్యా",
  "Poha": "అటుకులు",
  "Sabudana": "సగ్గుబియ్యం",
  "Coconut": "కొబ్బరికాయ",
  "Desiccated Coconut": "ఎండు కొబ్బరి",
  "Peanuts": "వేరుశనగలు",
  "Almonds": "బాదం",
  "Cashews": "జీడిపప్పు",
  "Raisins": "ఎండు ద్రాక్ష",
  "Walnuts": "ఆక్రోట్లు",
  "Dates": "ఖర్జూరం",
  "Pickle": "ఊరగాయ",
  "Papad": "అప్పడం",
  "Tea": "టీ",
  "Coffee": "కాఫీ",

  "Handwash": "చేతులు కడుక్కునే సబ్బు",
  "Hand Sanitizer": "హ్యాండ్ శానిటైజర్",
  "Shampoo": "షాంపూ",
  "Toothpaste": "టూత్‌పేస్ట్",
  "Toothbrush": "టూత్‌బ్రష్",
  "Hair Oil": "జుట్టు నూనె",
  "Sponges": "స్పాంజీలు",
  "Food Storage Containers": "ఆహారం పెట్టుకునే డబ్బాలు",
  "Water Bottles": "నీళ్ల సీసాలు",
};

const fruitTeluguNames = {
  "Apple": "ఆపిల్",
  "Banana": "అరటిపండు",
  "Orange": "కమలాపండు",
  "Sweet Lime": "బత్తాయి",
  "Lemon": "నిమ్మకాయ",
  "Mango": "మామిడిపండు",
  "Papaya": "బొప్పాయి",
  "Watermelon": "పుచ్చకాయ",
  "Muskmelon": "ఖర్బూజ",
  "Grapes": "ద్రాక్ష",
  "Pomegranate": "దానిమ్మ",
  "Guava": "జామపండు",
  "Pineapple": "అనాసపండు",
  "Sapota": "సపోటా",
  "Custard Apple": "సీతాఫలం",
  "Coconut": "కొబ్బరికాయ",
  "Pear": "బేరిపండు",
  "Kiwi": "కివీ",
  "Strawberry": "స్ట్రాబెర్రీ",
  "Dragon Fruit": "డ్రాగన్ ఫ్రూట్",
};

function buildCatalogue() {
  const result = [];

  vegetables.forEach((name) => {
    result.push(
      createCatalogueItem(
        name,
        "Vegetables",
        "Vegetables",
        {
          teluguName: teluguNames[name] || "",
        }
      )
    );
  });

  fruits.forEach((name) => {
    result.push(
      createCatalogueItem(
        name,
        "Fruits",
        "Fruits",
        {
          teluguName:
            fruitTeluguNames[name] || "",
        }
      )
    );
  });

  Object.entries(eats).forEach(
    ([subcategory, items]) => {
      items.forEach((name) => {
        result.push(
          createCatalogueItem(
            name,
            "Eats",
            subcategory,
            {
              teluguName: teluguNames[name] || "",
            }
          )
        );
      });
    }
  );

  Object.entries(homeEssentials).forEach(
    ([subcategory, items]) => {
      items.forEach((name) => {
        result.push(
          createCatalogueItem(
            name,
            "Home Essentials",
            subcategory,
            {
              teluguName: teluguNames[name] || "",
            }
          )
        );
      });
    }
  );

  return result;
}

const builtInCatalogue = buildCatalogue();

function loadState() {
  try {
    const raw = localStorage.getItem(
      STORAGE_KEY
    );

    if (!raw) {
      return {
        cart: [],
        sharedList: null,
        history: [],
        customCatalogue: [],
      };
    }

    const parsed = JSON.parse(raw);

    return {
      cart: parsed.cart || [],
      sharedList: parsed.sharedList || null,
      history: parsed.history || [],
      customCatalogue:
        parsed.customCatalogue || [],
    };
  } catch {
    return {
      cart: [],
      sharedList: null,
      history: [],
      customCatalogue: [],
    };
  }
}

function getDefaultUnit(item) {
  const name = item.name.toLowerCase();

  if (
    name.includes("rice") ||
    name.includes("dal") ||
    name.includes("flour") ||
    name.includes("wheat") ||
    name.includes("sugar") ||
    name.includes("salt") ||
    name.includes("masala") ||
    name.includes("powder") ||
    name.includes("seeds") ||
    name.includes("pepper")
  ) {
    return "kg";
  }

  if (
    item.category === "Vegetables" ||
    item.category === "Fruits"
  ) {
    return "kg";
  }

  if (item.category === "Home Essentials") {
    return "piece";
  }

  return "pack";
}

function getCartItemForCatalogueItem(
  cart,
  itemId
) {
  return (
    cart.find(
      (cartItem) =>
        cartItem.itemId === itemId
    ) || null
  );
}

function getQuantityStep(unit) {
  switch (unit) {
    case "g":
      return 50;
    case "ml":
      return 50;
    case "kg":
      return 0.25;
    case "litre":
      return 0.25;
    default:
      return 1;
  }
}

function formatQuantity(quantity) {
  const number = Number(quantity);

  if (Number.isNaN(number)) {
    return quantity;
  }

  return Number.isInteger(number)
    ? String(number)
    : String(Number(number.toFixed(2)));
}

function getSubcategoryOptions(category) {
  if (category === "Vegetables") {
    return ["Vegetables"];
  }

  if (category === "Fruits") {
    return ["Fruits"];
  }

  if (category === "Eats") {
    return Object.keys(eats);
  }

  if (category === "Home Essentials") {
    return Object.keys(homeEssentials);
  }

  return [];
}

function findExistingSubcategory(
  name,
  category
) {
  const normalized = name
    .trim()
    .toLowerCase();

  if (!normalized) {
    return "";
  }

  if (category === "Vegetables") {
    return "Vegetables";
  }

  if (category === "Fruits") {
    return "Fruits";
  }

  const source =
    category === "Eats"
      ? eats
      : category === "Home Essentials"
      ? homeEssentials
      : {};

  for (const [
    subcategory,
    items,
  ] of Object.entries(source)) {
    if (
      items.some(
        (item) =>
          item.toLowerCase() === normalized
      )
    ) {
      return subcategory;
    }
  }

  return (
    getSubcategoryOptions(category)[0] ||
    "Custom"
  );
}

export default function App() {
  const [state, setState] = useState(loadState);

  const [screen, setScreen] =
    useState("home");

  const [activeCategory, setActiveCategory] =
    useState("Vegetables");

  const [activeSubcategory, setActiveSubcategory] =
    useState("All");

  const [search, setSearch] = useState("");

  const [selectedItem, setSelectedItem] =
    useState(null);

  const [showCustom, setShowCustom] =
    useState(false);

  const [showCart, setShowCart] =
    useState(false);

  const [
    showCategoryPicker,
    setShowCategoryPicker,
  ] = useState(false);

  const [showRemarkFor, setShowRemarkFor] =
    useState(null);

  const [toast, setToast] = useState("");
  const [finishNotice, setFinishNotice] = useState(null);

  const [
    selectedListCategories,
    setSelectedListCategories,
  ] = useState([
    "Vegetables",
    "Fruits",
    "Eats",
    "Home Essentials",
  ]);

  const [
    selectedHistoryIds,
    setSelectedHistoryIds,
  ] = useState([]);

  const catalogue = useMemo(
    () => [
      ...builtInCatalogue,
      ...(state.customCatalogue || []),
    ],
    [state.customCatalogue]
  );

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(state)
    );

    try {
      const channel =
        new BroadcastChannel(CHANNEL_NAME);

      channel.postMessage(state);
      channel.close();
    } catch {
      // BroadcastChannel may not be available.
    }
  }, [state]);

  useEffect(() => {
    try {
      const channel =
        new BroadcastChannel(CHANNEL_NAME);

      channel.onmessage = (event) => {
        if (event.data) {
          setState(event.data);
        }
      };

      return () => {
        channel.close();
      };
    } catch {
      return undefined;
    }
  }, []);


  useEffect(() => {
    async function loadSharedListFromUrl() {
      const params = new URLSearchParams(window.location.search);
      const shareCode = params.get("share");

      if (!shareCode) {
        return;
      }

      try {
        const { data, error } = await supabase
          .from("shared_lists")
          .select("data")
          .eq("share_code", shareCode)
          .single();

        if (error || !data?.data) {
          console.error("Shared list error:", error);
          notify("Shared list not found");
          return;
        }

        setState((prev) => ({
          ...prev,
          sharedList: data.data,
        }));

        setScreen("shared");
        notify("Shared list loaded!");
      } catch (error) {
        console.error("Load shared list error:", error);
        notify("Could not load shared list");
      }
    }

    loadSharedListFromUrl();
  }, []);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setToast("");
    }, 2200);

    return () => clearTimeout(timer);
  }, [toast]);

  const subcategories = useMemo(() => {
    if (activeCategory === "Fruits") {
      return ["All"];
    }

    if (activeCategory === "Eats") {
      return ["All", ...Object.keys(eats)];
    }

    if (
      activeCategory === "Home Essentials"
    ) {
      return [
        "All",
        ...Object.keys(homeEssentials),
      ];
    }

    return ["All"];
  }, [activeCategory]);

  const visibleItems = useMemo(() => {
  const query = search
    .trim()
    .toLowerCase();

  return catalogue.filter((item) => {
    // When searching, search the ENTIRE catalogue,
    // regardless of the currently selected category.
    if (query) {
      return (
        item.name
          .toLowerCase()
          .includes(query) ||
        item.subcategory
          .toLowerCase()
          .includes(query) ||
        item.category
          .toLowerCase()
          .includes(query) ||
        (item.teluguName || "")
          .toLowerCase()
          .includes(query)
      );
    }

    // Normal browsing stays category/subcategory based.
    const categoryMatches =
      item.category === activeCategory;

    const subcategoryMatches =
      activeSubcategory === "All" ||
      item.subcategory === activeSubcategory;

    return (
      categoryMatches &&
      subcategoryMatches
    );
  });
}, [
  catalogue,
  activeCategory,
  activeSubcategory,
  search,
]);

  function notify(message) {
    setToast(message);
  }

  function changeCategory(category) {
    setActiveCategory(category);
    setActiveSubcategory("All");
    setSearch("");
  }

  function getCartQuantityForItem(itemId) {
    const existing =
      getCartItemForCatalogueItem(
        state.cart,
        itemId
      );

    return existing
      ? Number(existing.quantity || 0)
      : 0;
  }

  function updateCartItem(
    cartItemId,
    updates
  ) {
    setState((prev) => ({
      ...prev,
      cart: prev.cart.map(
        (item) =>
          item.id === cartItemId
            ? {
                ...item,
                ...updates,
              }
            : item
      ),
    }));
  }

  function removeCartItem(cartItemId) {
    setState((prev) => ({
      ...prev,
      cart: prev.cart.filter(
        (item) => item.id !== cartItemId
      ),
    }));
  }

  function addToCart(item, config = {}) {
    const quantity = Number(
      config.quantity
    );

    if (!quantity || quantity <= 0) {
      notify("Enter a valid quantity.");
      return;
    }

    const unit =
      config.unit || getDefaultUnit(item);

    const specification =
      config.specification?.trim() || "";

    setState((prev) => {
      const existingIndex =
        prev.cart.findIndex(
          (cartItem) =>
            cartItem.itemId === item.id
        );

      const cartItem = {
        id:
          existingIndex !== -1
            ? prev.cart[existingIndex].id
            : makeId("cart"),

        itemId: item.id || null,

        name: item.name,

        category:
          item.category ||
          "Home Essentials",

        subcategory:
          item.subcategory || "Custom",

        emoji:
          item.emoji || getEmoji(item.name),

        image:
          item.image ||
          getPhotoUrl(item.name),

        quantity,

        unit,

        specification,
      };

      if (existingIndex !== -1) {
        const updatedCart = [
          ...prev.cart,
        ];

        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],
          ...cartItem,
        };

        return {
          ...prev,
          cart: updatedCart,
        };
      }

      return {
        ...prev,
        cart: [
          ...prev.cart,
          cartItem,
        ],
      };
    });

    setSelectedItem(null);

    notify(
      `${item.name} requirement saved`
    );
  }

  function quickAdd(item) {
    addToCart(item, {
      quantity: 1,
      unit: getDefaultUnit(item),
      specification: "",
    });
  }

  function increaseItem(item) {
    const existing =
      getCartItemForCatalogueItem(
        state.cart,
        item.id
      );

    if (!existing) {
      quickAdd(item);
      return;
    }

    const step = getQuantityStep(
      existing.unit
    );

    const nextQuantity =
      Number(existing.quantity || 0) +
      step;

    updateCartItem(existing.id, {
      quantity: Number(
        nextQuantity.toFixed(2)
      ),
    });

    notify(
      `${item.name}: ${formatQuantity(
        nextQuantity
      )} ${existing.unit}`
    );
  }

  function decreaseItem(item) {
    const existing =
      getCartItemForCatalogueItem(
        state.cart,
        item.id
      );

    if (!existing) {
      return;
    }

    const step = getQuantityStep(
      existing.unit
    );

    const nextQuantity =
      Number(existing.quantity || 0) -
      step;

    if (nextQuantity <= 0) {
      removeCartItem(existing.id);
      notify(`${item.name} removed`);
      return;
    }

    updateCartItem(existing.id, {
      quantity: Number(
        nextQuantity.toFixed(2)
      ),
    });
  }

  function addCustomCatalogueItem(
    customItem
  ) {
    setState((prev) => {
      const existing =
        (prev.customCatalogue || []).find(
          (item) =>
            item.name.toLowerCase() ===
              customItem.name.toLowerCase() &&
            item.category ===
              customItem.category
        );

      if (existing) {
        return prev;
      }

      return {
        ...prev,
        customCatalogue: [
          ...(prev.customCatalogue || []),
          customItem,
        ],
      };
    });
  }

  function createSharedList() {
    if (!state.cart.length) {
      notify("Add items to your cart first.");
      return;
    }

    const filteredItems =
      state.cart.filter((item) =>
        selectedListCategories.includes(
          item.category
        )
      );

    if (!filteredItems.length) {
      notify(
        "Select at least one category with items."
      );
      return;
    }

    const sharedItems =
      filteredItems.map((item) => ({
        ...item,
        sharedId: makeId("shared"),
        completed: false,
        remark: "",
        updatedAt: Date.now(),
      }));

    setState((prev) => ({
      ...prev,

      // Keep the Cart unchanged.
      // Final List is a snapshot of the selected items.
      sharedList: {
        id: makeId("list"),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        items: sharedItems,
      },
    }));

    setShowCategoryPicker(false);
    setScreen("shared");
    notify("Shared list created");
  }

  function toggleComplete(sharedId) {
    setState((prev) => {
      if (!prev.sharedList) {
        return prev;
      }

      return {
        ...prev,
        sharedList: {
          ...prev.sharedList,
          updatedAt: Date.now(),
          items:
            prev.sharedList.items.map(
              (item) =>
                item.sharedId === sharedId
                  ? {
                      ...item,
                      completed:
                        !item.completed,
                      updatedAt:
                        Date.now(),
                    }
                  : item
            ),
        },
      };
    });
  }

  function updateRemark(
    sharedId,
    remark
  ) {
    setState((prev) => {
      if (!prev.sharedList) {
        return prev;
      }

      return {
        ...prev,
        sharedList: {
          ...prev.sharedList,
          updatedAt: Date.now(),
          items:
            prev.sharedList.items.map(
              (item) =>
                item.sharedId === sharedId
                  ? {
                      ...item,
                      remark,
                      updatedAt:
                        Date.now(),
                    }
                  : item
            ),
        },
      };
    });
  }

  function finishList() {
    if (!state.sharedList) {
      return;
    }

    const historyItem = {
      ...state.sharedList,
      completedAt: Date.now(),
    };

    // Items that were not completed were not available
    // or were skipped during shopping. Put them back
    // into the planning cart so they are not forgotten.
    const unavailableItems =
      state.sharedList.items
        .filter((item) => !item.completed)
        .map((item) => ({
          ...item,
          completed: false,
          updatedAt: Date.now(),
        }));

    setState((prev) => ({
      ...prev,

      // Save the completed shopping session.
      history: [
        historyItem,
        ...(prev.history || []),
      ],

      // No active shopping list remains.
      sharedList: null,

      // Restore only unfinished/unavailable items.
      cart: unavailableItems,
    }));

    if (unavailableItems.length > 0) {
      setFinishNotice({
        type: "remaining",
        items: unavailableItems,
      });
    } else {
      setFinishNotice({
        type: "complete",
        items: [],
      });
    }
  }

  function deleteSelectedHistory() {
    if (!selectedHistoryIds.length) {
      notify("Select at least one list.");
      return;
    }

    setState((prev) => ({
      ...prev,
      history: (prev.history || []).filter(
        (item) =>
          !selectedHistoryIds.includes(item.id)
      ),
    }));

    setSelectedHistoryIds([]);
    notify("Selected lists deleted");
  }

  function deleteAllHistory() {
    if (!state.history?.length) {
      return;
    }

    if (
      !window.confirm(
        "Delete all shopping history?"
      )
    ) {
      return;
    }

    setState((prev) => ({
      ...prev,
      history: [],
    }));

    setSelectedHistoryIds([]);
    notify("All shopping history deleted");
  }

  function reuseHistory(historyItem) {
    const items =
      historyItem.items.map((item) => ({
        ...item,
        sharedId: makeId("shared"),
        completed: false,
        updatedAt: Date.now(),
      }));

    setState((prev) => ({
      ...prev,
      sharedList: {
        id: makeId("list"),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        items,
      },
    }));

    setScreen("shared");
    notify("Previous list restored");
  }

  async function shareFinalListAsText() {
    if (!state.sharedList?.items?.length) {
      notify("Your final list is empty");
      return;
    }

    const categoryOrder = [
      "Vegetables",
      "Fruits",
      "Eats",
      "Home Essentials",
    ];

    const groups = categoryOrder
      .map((category) => ({
        category,
        items: state.sharedList.items.filter(
          (item) => item.category === category
        ),
      }))
      .filter(
        (group) => group.items.length > 0
      );

    const lines = [
      "🛒 Mummy's List",
      "",
    ];

    groups.forEach((group) => {
      lines.push(group.category);

      group.items.forEach((item) => {
        const details = [
          item.specification,
          `${formatQuantity(item.quantity)} ${item.unit}`,
        ].filter(Boolean);

        lines.push(
          `• ${item.name} - ${details.join(" - ")}`
        );
      });

      lines.push("");
    });

    const shareText = lines
      .join("\n")
      .trim();

    try {
      if (
        navigator.share &&
        typeof navigator.share === "function"
      ) {
        await navigator.share({
          title: "Mummy's List",
          text: shareText,
        });

        return;
      }

      await navigator.clipboard.writeText(
        shareText
      );

      notify("Shopping list copied!");
    } catch (error) {
      if (error?.name === "AbortError") {
        return;
      }

      console.error(
        "Share final list error:",
        error
      );

      notify("Could not share the list");
    }
  }

  async function shareList() {
    if (!state.sharedList) {
      return;
    }

    try {
      notify("Creating share link...");

      const shareCode = Math.random()
        .toString(36)
        .slice(2, 9);

      const { error } = await supabase
        .from("shared_lists")
        .insert({
          share_code: shareCode,
          data: state.sharedList,
        });

      if (error) {
        console.error("Share link error:", error);
        notify("Could not create share link");
        return;
      }

      const shareUrl =
        `${window.location.origin}/?share=${shareCode}`;

      try {
        await navigator.clipboard.writeText(shareUrl);
        notify("Share link copied!");
      } catch {
        if (
          navigator.share &&
          typeof navigator.share === "function"
        ) {
          await navigator.share({
            title: "Mummy's List",
            text: "Open my Mummy's List",
            url: shareUrl,
          });
        } else {
          notify("Share link created");
        }
      }
    } catch (error) {
      console.error("Share error:", error);
      notify("Could not create share link");
    }
  }

  const cartCount = state.cart.length;

  const sharedPendingCount =
    state.sharedList?.items.filter(
      (item) => !item.completed
    ).length || 0;

  const sharedCompletedCount =
    state.sharedList?.items.filter(
      (item) => item.completed
    ).length || 0;

  return (
    <div className="app-shell">
      <Header
        screen={screen}
        setScreen={setScreen}
        cartCount={cartCount}
        hasSharedList={Boolean(
          state.sharedList
        )}
        setShowCart={setShowCart}
      />

      {screen === "home" && (
        <HomeScreen
          catalogue={catalogue}
          activeCategory={
            activeCategory
          }
          activeSubcategory={
            activeSubcategory
          }
          subcategories={
            subcategories
          }
          search={search}
          setSearch={setSearch}
          onCategoryChange={
            changeCategory
          }
          setActiveSubcategory={
            setActiveSubcategory
          }
          visibleItems={
            visibleItems
          }
          cart={state.cart}
          sharedList={state.sharedList}
          onOpenItem={
            setSelectedItem
          }
          onIncrease={
            increaseItem
          }
          onDecrease={
            decreaseItem
          }
          onAddCustom={() =>
            setShowCustom(true)
          }
          onOpenShared={() =>
            setScreen("shared")
          }
        />
      )}

      {screen === "shared" && (
        <SharedListScreen
          sharedList={
            state.sharedList
          }
          pendingCount={
            sharedPendingCount
          }
          completedCount={
            sharedCompletedCount
          }
          onBack={() =>
            setScreen("home")
          }
          onToggleComplete={
            toggleComplete
          }
          onRemark={(item) =>
            setShowRemarkFor(item)
          }
          onShareLink={shareList}
          onShareList={
            shareFinalListAsText
          }
          onFinish={finishList}
        />
      )}

      {screen === "history" && (
        <HistoryScreen
          history={state.history}
          onBack={() =>
            setScreen("home")
          }
          onReuse={reuseHistory}
          selectedHistoryIds={
            selectedHistoryIds
          }
          setSelectedHistoryIds={
            setSelectedHistoryIds
          }
          onDeleteSelected={
            deleteSelectedHistory
          }
          onDeleteAll={
            deleteAllHistory
          }
        />
      )}

      {showCart && (
        <CartSheet
          cart={state.cart}
          onClose={() =>
            setShowCart(false)
          }
          onIncrease={
            increaseItem
          }
          onDecrease={
            decreaseItem
          }
          onRemove={
            removeCartItem
          }
          onCreateList={() => {
            setShowCart(false);
            setShowCategoryPicker(
              true
            );
          }}
        />
      )}

      {showCategoryPicker && (
        <CategoryPicker
          selected={
            selectedListCategories
          }
          setSelected={
            setSelectedListCategories
          }
          onClose={() =>
            setShowCategoryPicker(
              false
            )
          }
          onCreate={
            createSharedList
          }
        />
      )}

      {selectedItem && (
        <ItemSheet
          item={selectedItem}
          existingRequirement={getCartItemForCatalogueItem(
            state.cart,
            selectedItem.id
          )}
          onClose={() =>
            setSelectedItem(null)
          }
          onAdd={addToCart}
        />
      )}

      {showCustom && (
        <CustomItemSheet
          onClose={() =>
            setShowCustom(false)
          }
          onAdd={(item, config) => {
            const existingCustom =
              state.customCatalogue.find(
                (customItem) =>
                  customItem.name.toLowerCase() ===
                    item.name.toLowerCase() &&
                  customItem.category ===
                    item.category
              );

            const customItem =
              existingCustom || {
                ...item,
                id: makeId("custom"),
                image: getPhotoUrl(
                  item.name
                ),
                emoji: getEmoji(
                  item.name
                ),
                custom: true,
              };

            addCustomCatalogueItem(
              customItem
            );

            addToCart(
              customItem,
              config
            );

            setShowCustom(false);
          }}
        />
      )}

      {showRemarkFor && (
        <RemarkSheet
          item={showRemarkFor}
          onClose={() =>
            setShowRemarkFor(null)
          }
          onSave={(remark) => {
            updateRemark(
              showRemarkFor.sharedId,
              remark
            );

            setShowRemarkFor(null);
          }}
        />
      )}

      {finishNotice && (
        <div
          className="finish-notice-overlay"
          onMouseDown={() =>
            setFinishNotice(null)
          }
        >
          <div
            className="finish-notice"
            onMouseDown={(e) =>
              e.stopPropagation()
            }
          >
            {finishNotice.type === "complete" ? (
              <>
                <div className="finish-notice-icon">
                  🎉
                </div>

                <h3>
                  Shopping complete!
                </h3>

                <p>
                  Everything on your list is
                  checked off.
                </p>
              </>
            ) : (
              <>
                <div className="finish-notice-icon">
                  🛒
                </div>

                <h3>
                  {finishNotice.items.length}{" "}
                  {finishNotice.items.length === 1
                    ? "item"
                    : "items"}{" "}
                  left
                </h3>

                <p>
                  Added back to your cart so
                  you don't forget them.
                </p>

                <div className="finish-notice-items">
                  {finishNotice.items.map(
                    (item) => (
                      <div
                        key={item.id}
                        className="finish-notice-item"
                      >
                        <span>
                          {item.name}
                        </span>

                        <strong>
                          {formatQuantity(
                            item.quantity
                          )}{" "}
                          {item.unit}
                        </strong>
                      </div>
                    )
                  )}
                </div>
              </>
            )}

            <button
              className="primary-button full"
              onClick={() => {
                setFinishNotice(null);
                setScreen("history");
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast">
          {toast}
        </div>
      )}
    </div>
  );
}

function Header({
  screen,
  setScreen,
  cartCount,
  hasSharedList,
  setShowCart,
}) {
  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-mark">
          🛒
        </div>

        <div>
          <strong>
            MUMMY'S LIST
          </strong>
          <span>
            Plan it. Share it. Shop it.
          </span>
        </div>
      </div>

      <div className="topbar-actions">
        {hasSharedList && (
          <button
            className={`icon-button ${
              screen === "shared"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setScreen("shared")
            }
            title="Shared list"
          >
            <ClipboardList size={19} />
          </button>
        )}

        <button
          className={`icon-button ${
            screen === "history"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setScreen("history")
          }
          title="History"
        >
          <History size={19} />
        </button>

        <button
          className="cart-button"
          onClick={() =>
            setShowCart(true)
          }
        >
          <ShoppingCart size={25} strokeWidth={2.3} />

          {cartCount > 0 && (
            <span>
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

function HomeScreen({
  catalogue,
  activeCategory,
  activeSubcategory,
  subcategories,
  search,
  setSearch,
  onCategoryChange,
  setActiveSubcategory,
  visibleItems,
  cart,
  sharedList,
  onOpenItem,
  onIncrease,
  onDecrease,
  onAddCustom,
  onOpenShared,
}) {
  return (
    <main className="page">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <Sparkles size={15} />
            Your family's shopping planner
          </span>

          <h1>
            Tell us what
            <br />
            <span>you need.</span>
          </h1>

          <p>
            Choose the groceries, specify
            exactly what you want, and turn
            them into one simple shopping
            list.
          </p>
        </div>

        <div className="hero-art">
          🥕
          <span>🥬</span>
          <span>🍅</span>
          <span>🧅</span>
        </div>
      </section>


      <div className="search-box">
        <Search size={19} />

        <input
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          placeholder="Search groceries..."
        />

        {search && (
          <button
            className="clear-search"
            onClick={() =>
              setSearch("")
            }
          >
            <X size={17} />
          </button>
        )}
      </div>

      <section>
        <div className="section-heading">
          <div>
            <span className="section-kicker">
              Browse
            </span>
            <h2>
              What are we shopping for?
            </h2>
          </div>
        </div>

        <div className="category-grid">
          {Object.entries(
            categoryMeta
          ).map(
            ([
              category,
              meta,
            ]) => (
              <button
                key={category}
                className={`category-card ${meta.color} ${
                  activeCategory ===
                  category
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  onCategoryChange(
                    category
                  )
                }
              >
                <span className="category-icon">
                  {meta.icon}
                </span>

                <span>
                  <strong>
                    {category}
                  </strong>

                  <small>
                    {
                      catalogue.filter(
                        (item) =>
                          item.category ===
                          category
                      ).length
                    }{" "}
                    items
                  </small>
                </span>
              </button>
            )
          )}
        </div>
      </section>

      {subcategories.length > 1 && (
        <div className="subcategory-scroll">
          {subcategories.map(
            (subcategory) => (
              <button
                key={subcategory}
                className={
                  activeSubcategory ===
                  subcategory
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveSubcategory(
                    subcategory
                  )
                }
              >
                {subcategory}
              </button>
            )
          )}
        </div>
      )}

      <section className="catalogue-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">
              {activeCategory}
            </span>

            <h2>
              {activeSubcategory ===
              "All"
                ? "Pick your items"
                : activeSubcategory}
            </h2>
          </div>

          <span className="item-count">
            {visibleItems.length}
          </span>
        </div>

        {visibleItems.length > 0 ? (
          <div className="grocery-grid">
            {visibleItems.map(
              (item) => (
                <GroceryCard
                  key={item.id}
                  item={item}
                  requirement={getCartItemForCatalogueItem(
                    cart,
                    item.id
                  )}
                  onOpen={() =>
                    onOpenItem(item)
                  }
                  onIncrease={() =>
                    onIncrease(item)
                  }
                  onDecrease={() =>
                    onDecrease(item)
                  }
                />
              )
            )}
          </div>
        ) : (
          <div className="empty-state">
            <div>🔎</div>
            <h3>
              Nothing found
            </h3>
            <p>
              Try another search or add
              the item manually.
            </p>
          </div>
        )}
      </section>

      <button
        className="custom-item-button"
        onClick={onAddCustom}
      >
        <Plus size={18} />
        Can't find your item?
        <span>Add it manually</span>
      </button>
    </main>
  );
}

function GroceryCard({
  item,
  requirement,
  onOpen,
  onIncrease,
  onDecrease,
}) {
  const hasRequirement = Boolean(requirement);

  return (
    <article
      className={`grocery-card ${hasRequirement ? "has-quantity" : ""}`}
      onClick={onOpen}
    >
      <div className="grocery-image text-item-image">
        <div className="item-english-name">{item.name}</div>
        {item.teluguName && (
          <div className="item-telugu-name">{item.teluguName}</div>
        )}

        {hasRequirement && (
          <span className="card-quantity-badge requirement-badge">
            ✓ {formatQuantity(requirement.quantity)} {requirement.unit}
          </span>
        )}
      </div>

      <div className="grocery-info">
        <div>
          <small>
            {hasRequirement
              ? `${formatQuantity(requirement.quantity)} ${requirement.unit}`
              : item.subcategory}
          </small>
        </div>

        {hasRequirement ? (
          <div
            className="card-quantity-controls"
            onClick={(event) => event.stopPropagation()}
          >
            <button onClick={onDecrease} aria-label={`Decrease ${item.name}`}>
              <Minus size={15} />
            </button>

            <strong>{formatQuantity(requirement.quantity)}</strong>

            <button onClick={onIncrease} aria-label={`Increase ${item.name}`}>
              <Plus size={15} />
            </button>
          </div>
        ) : (
          <button
            className="add-round"
            onClick={(event) => {
              event.stopPropagation();
              onOpen();
            }}
            aria-label={`Add ${item.name}`}
          >
            <Plus size={18} />
          </button>
        )}
      </div>

      {hasRequirement && requirement.specification && (
        <div className="card-specification">
          {requirement.specification}
        </div>
      )}
    </article>
  );
}

function ItemSheet({
  item,
  existingRequirement,
  onClose,
  onAdd,
}) {
  const initialQuantity =
    existingRequirement?.quantity ?? 1;

  const initialUnit =
    existingRequirement?.unit ??
    getDefaultUnit(item);

  const initialSpecification =
    existingRequirement?.specification ??
    "";

  const [quantity, setQuantity] =
    useState(
      String(initialQuantity)
    );

  const [unit, setUnit] =
    useState(initialUnit);

  const [specification, setSpecification] =
    useState(initialSpecification);

  const units = [
    "g",
    "kg",
    "ml",
    "litre",
    "piece",
    "pack",
    "dozen",
    "bunch",
  ];

  const step = getQuantityStep(unit);

  function changeQuantity(direction) {
    const current =
      Number(quantity) || 0;

    let next =
      direction === "increase"
        ? current + step
        : current - step;

    if (next <= 0) {
      next = step;
    }

    setQuantity(
      Number(next.toFixed(2))
    );
  }

  function handleUnitChange(nextUnit) {
    setUnit(nextUnit);

    if (
      nextUnit === "g" &&
      Number(quantity) === 1
    ) {
      setQuantity("250");
    }

    if (
      nextUnit === "ml" &&
      Number(quantity) === 1
    ) {
      setQuantity("250");
    }
  }

  function handleDone() {
    const numericQuantity =
      Number(quantity);

    if (
      !numericQuantity ||
      numericQuantity <= 0
    ) {
      return;
    }

    onAdd(item, {
      quantity: numericQuantity,
      unit,
      specification,
    });
  }

  return (
    <div
      className="overlay"
      onMouseDown={onClose}
    >
      <div
        className="sheet"
        onMouseDown={(e) =>
          e.stopPropagation()
        }
      >
        <div className="sheet-handle" />

        <div className="sheet-header">
          <button
            className="icon-button"
            onClick={onClose}
          >
            <X size={19} />
          </button>

          <strong>
            {existingRequirement
              ? "Edit requirement"
              : "Add requirement"}
          </strong>

          <span />
        </div>

        <div className="item-preview">
          <div className="large-photo text-item-preview">
            <div className="item-english-name">
              {item.name}
            </div>

            {item.teluguName && (
              <div className="item-telugu-name">
                {item.teluguName}
              </div>
            )}
          </div>

          <div>
            <span className="section-kicker">
              {item.subcategory}
            </span>

            <h2>{item.name}</h2>

            {item.teluguName && (
              <p className="item-preview-telugu">
                {item.teluguName}
              </p>
            )}

            <p>
              Tell the shopper exactly
              what you need.
            </p>
          </div>
        </div>

        <label className="field-label">
          Quantity
        </label>

        <div className="quantity-row">
          <button
            onClick={() =>
              changeQuantity(
                "decrease"
              )
            }
          >
            <Minus size={18} />
          </button>

          <input
            className="quantity-input"
            type="number"
            min="0.01"
            step="any"
            value={quantity}
            onChange={(e) =>
              setQuantity(
                e.target.value
              )
            }
          />

          <button
            onClick={() =>
              changeQuantity(
                "increase"
              )
            }
          >
            <Plus size={18} />
          </button>

          <select
            value={unit}
            onChange={(e) =>
              handleUnitChange(
                e.target.value
              )
            }
          >
            {units.map((u) => (
              <option
                key={u}
                value={u}
              >
                {u}
              </option>
            ))}
          </select>
        </div>

        <div className="quantity-hints">
          {unit === "g" && (
            <>
              <button
                onClick={() =>
                  setQuantity("250")
                }
              >
                250 g
              </button>

              <button
                onClick={() =>
                  setQuantity("500")
                }
              >
                500 g
              </button>

              <button
                onClick={() =>
                  setQuantity("750")
                }
              >
                750 g
              </button>
            </>
          )}

          {unit === "kg" && (
            <>
              <button
                onClick={() =>
                  setQuantity("0.5")
                }
              >
                0.5 kg
              </button>

              <button
                onClick={() =>
                  setQuantity("1")
                }
              >
                1 kg
              </button>

              <button
                onClick={() =>
                  setQuantity("2")
                }
              >
                2 kg
              </button>
            </>
          )}

          {unit === "bunch" && (
            <>
              <button
                onClick={() =>
                  setQuantity("1")
                }
              >
                1 bunch
              </button>

              <button
                onClick={() =>
                  setQuantity("2")
                }
              >
                2 bunches
              </button>
            </>
          )}
        </div>

        <label className="field-label">
          Specification{" "}
          <span>optional</span>
        </label>

        <textarea
          value={specification}
          onChange={(e) =>
            setSpecification(
              e.target.value
            )
          }
          placeholder='Example: "Ripe, but not too soft"'
          rows={3}
        />

        <button
          className="primary-button full"
          onClick={handleDone}
        >
          <Check size={18} />
          Done
        </button>
      </div>
    </div>
  );
}

function CustomItemSheet({
  onClose,
  onAdd,
}) {
  const [name, setName] =
    useState("");

  const [quantity, setQuantity] =
    useState("1");

  const [unit, setUnit] =
    useState("piece");

  const [category, setCategory] =
    useState("Home Essentials");

  const [subcategory, setSubcategory] =
    useState("Cleaning");

  const [specification, setSpecification] =
    useState("");

  const units = [
    "g",
    "kg",
    "ml",
    "litre",
    "piece",
    "pack",
    "dozen",
    "bunch",
  ];

  const subcategoryOptions =
    getSubcategoryOptions(category);

  function handleCategoryChange(
    nextCategory
  ) {
    setCategory(nextCategory);

    const options =
      getSubcategoryOptions(
        nextCategory
      );

    setSubcategory(
      options[0] || ""
    );
  }

  function handleNameChange(value) {
    setName(value);

    const normalized =
      value.trim().toLowerCase();

    if (!normalized) {
      return;
    }

    const matchingItem =
      builtInCatalogue.find(
        (item) =>
          item.name.toLowerCase() ===
          normalized
      );

    if (matchingItem) {
      setCategory(
        matchingItem.category
      );

      setSubcategory(
        matchingItem.subcategory
      );
      return;
    }

    const guessedSubcategory =
      findExistingSubcategory(
        value,
        category
      );

    if (guessedSubcategory) {
      setSubcategory(
        guessedSubcategory
      );
    }
  }

  function handleAdd() {
    const trimmedName =
      name.trim();

    const numericQuantity =
      Number(quantity);

    if (!trimmedName) {
      return;
    }

    if (
      !numericQuantity ||
      numericQuantity <= 0
    ) {
      return;
    }

    onAdd(
      {
        name: trimmedName,
        category,
        subcategory,
        emoji: getEmoji(
          trimmedName
        ),
      },
      {
        quantity: numericQuantity,
        unit,
        specification,
      }
    );
  }

  return (
    <div
      className="overlay"
      onMouseDown={onClose}
    >
      <div
        className="sheet"
        onMouseDown={(e) =>
          e.stopPropagation()
        }
      >
        <div className="sheet-handle" />

        <div className="sheet-header">
          <button
            className="icon-button"
            onClick={onClose}
          >
            <X size={19} />
          </button>

          <strong>
            Add custom item
          </strong>

          <span />
        </div>

        <label className="field-label">
          Item name
        </label>

        <input
          value={name}
          onChange={(e) =>
            handleNameChange(
              e.target.value
            )
          }
          placeholder="e.g. Coconut"
          autoFocus
        />

        <div className="two-fields">
          <div>
            <label className="field-label">
              Quantity
            </label>

            <input
              type="number"
              min="0.01"
              step="any"
              value={quantity}
              onChange={(e) =>
                setQuantity(
                  e.target.value
                )
              }
            />
          </div>

          <div>
            <label className="field-label">
              Unit
            </label>

            <select
              value={unit}
              onChange={(e) =>
                setUnit(
                  e.target.value
                )
              }
            >
              {units.map((u) => (
                <option
                  key={u}
                  value={u}
                >
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>

        <label className="field-label">
          Category
        </label>

        <select
          value={category}
          onChange={(e) =>
            handleCategoryChange(
              e.target.value
            )
          }
        >
          <option value="Vegetables">
            Vegetables
          </option>

          <option value="Fruits">
            Fruits
          </option>

          <option value="Eats">
            Eats
          </option>

          <option value="Home Essentials">
            Home Essentials
          </option>
        </select>

        <label className="field-label">
          Subcategory
        </label>

        <select
          value={subcategory}
          onChange={(e) =>
            setSubcategory(
              e.target.value
            )
          }
        >
          {subcategoryOptions.map(
            (option) => (
              <option
                key={option}
                value={option}
              >
                {option}
              </option>
            )
          )}
        </select>

        <label className="field-label">
          Specification{" "}
          <span>optional</span>
        </label>

        <textarea
          value={specification}
          onChange={(e) =>
            setSpecification(
              e.target.value
            )
          }
          placeholder="Any exact requirement?"
          rows={3}
        />

        <button
          className="primary-button full"
          disabled={
            !name.trim() ||
            !Number(quantity) ||
            Number(quantity) <= 0
          }
          onClick={handleAdd}
        >
          <Plus size={18} />
          Add custom item
        </button>
      </div>
    </div>
  );
}

function CartSheet({
  cart,
  onClose,
  onIncrease,
  onDecrease,
  onRemove,
  onCreateList,
}) {
  const categoryOrder = [
    "Vegetables",
    "Fruits",
    "Eats",
    "Home Essentials",
  ];

  const groupedCart = categoryOrder
    .map((category) => ({
      category,
      items: cart.filter(
        (item) => item.category === category
      ),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div
      className="overlay"
      onMouseDown={onClose}
    >
      <div
        className="sheet cart-sheet"
        onMouseDown={(e) =>
          e.stopPropagation()
        }
      >
        <div className="sheet-handle" />

        <div className="sheet-header">
          <button
            className="icon-button"
            onClick={onClose}
          >
            <X size={19} />
          </button>

          <strong>
            Your shopping list
          </strong>

          <span />
        </div>

        {cart.length === 0 ? (
          <div className="empty-state">
            <div>🛒</div>

            <h3>
              Your cart is empty
            </h3>

            <p>
              Add groceries before creating
              a shopping list.
            </p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {groupedCart.map((group) => (
                <section
                  className="cart-category"
                  key={group.category}
                >
                  <div className="cart-category-heading">
                    <span>
                      {categoryMeta[group.category]?.icon}
                    </span>

                    <strong>
                      {group.category}
                    </strong>
                  </div>

                  <div className="cart-category-items">
                    {group.items.map((item) => (
                      <div
                        className="cart-item"
                        key={item.id}
                      >
                        <div className="cart-item-main">
                          <strong>
                            {item.name}
                          </strong>

                          {item.specification && (
                            <small className="cart-item-specification">
                              {item.specification}
                            </small>
                          )}

                          <span className="cart-item-total">
                            {formatQuantity(
                              item.quantity
                            )}{" "}
                            {item.unit}
                          </span>
                        </div>

                        <div className="cart-item-actions">
                          <div className="mini-quantity">
                            <button
                              onClick={() =>
                                onDecrease(item)
                              }
                              aria-label={`Decrease ${item.name}`}
                            >
                              <Minus size={18} />
                            </button>

                            <strong>
                              {formatQuantity(
                                item.quantity
                              )}
                            </strong>

                            <button
                              onClick={() =>
                                onIncrease(item)
                              }
                              aria-label={`Increase ${item.name}`}
                            >
                              <Plus size={18} />
                            </button>
                          </div>

                          <button
                            className="remove-button"
                            onClick={() =>
                              onRemove(item.id)
                            }
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <button
              className="primary-button full"
              onClick={onCreateList}
            >
              <ClipboardList size={18} />
              Final List
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function CategoryPicker({
  selected,
  setSelected,
  onClose,
  onCreate,
}) {
  const categories =
    Object.keys(categoryMeta);

  function toggle(category) {
    setSelected((prev) =>
      prev.includes(category)
        ? prev.filter(
            (item) =>
              item !== category
          )
        : [...prev, category]
    );
  }

  return (
    <div
      className="overlay"
      onMouseDown={onClose}
    >
      <div
        className="sheet"
        onMouseDown={(e) =>
          e.stopPropagation()
        }
      >
        <div className="sheet-handle" />

        <div className="sheet-header">
          <button
            className="icon-button"
            onClick={onClose}
          >
            <X size={19} />
          </button>

          <strong>
            Choose categories
          </strong>

          <span />
        </div>

        <p className="sheet-description">
          Select which parts of your planned
          groceries should go into this
          shopping list.
        </p>

        <div className="category-picker">
          {categories.map(
            (category) => {
              const active =
                selected.includes(
                  category
                );

              return (
                <button
                  key={category}
                  className={
                    active
                      ? "picker-category active"
                      : "picker-category"
                  }
                  onClick={() =>
                    toggle(category)
                  }
                >
                  <span>
                    {
                      categoryMeta[
                        category
                      ].icon
                    }
                  </span>

                  <strong>
                    {category}
                  </strong>

                  {active && (
                    <Check
                      size={18}
                    />
                  )}
                </button>
              );
            }
          )}
        </div>

        <button
          className="primary-button full"
          disabled={
            selected.length === 0
          }
          onClick={onCreate}
        >
          <ClipboardList
            size={18}
          />
          Create shopping list
        </button>
      </div>
    </div>
  );
}

function SharedListScreen({
  sharedList,
  pendingCount,
  completedCount,
  onBack,
  onToggleComplete,
  onRemark,
  onShareLink,
  onShareList,
  onFinish,
}) {
  if (!sharedList) {
    return (
      <main className="page">
        <button
          className="back-button"
          onClick={onBack}
        >
          <ArrowLeft size={18} />
          Home
        </button>

        <div className="empty-state large">
          <div>🛍️</div>

          <h2>
            No active shopping list
          </h2>

          <p>
            Add items to your cart and create
            a shared list.
          </p>
        </div>
      </main>
    );
  }

  const groups = {};

  sharedList.items.forEach(
    (item) => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }

      groups[item.category].push(
        item
      );
    }
  );

  return (
    <main className="page">
      <div className="screen-top">
        <button
          className="back-button"
          onClick={onBack}
        >
          <ArrowLeft size={18} />
          Home
        </button>

        <button
          className="icon-button"
          onClick={onShareLink}
          title="Share Link"
        >
          <Link2 size={19} />
        </button>
      </div>

      <section className="list-header">
        <span className="eyebrow">
          <ClipboardList size={15} />
          Final shopping list
        </span>

        <h1>
          Ready to shop? 🛒
        </h1>

        <div className="progress-summary">
          <div>
            <strong>
              {completedCount}
            </strong>
            <span>
              Done
            </span>
          </div>

          <div>
            <strong>
              {pendingCount}
            </strong>
            <span>
              Remaining
            </span>
          </div>
        </div>
      </section>

      {Object.entries(groups).map(
        ([
          category,
          items,
        ]) => (
          <section
            className="shared-category"
            key={category}
          >
            <div className="shared-category-title">
              <span>
                {
                  categoryMeta[
                    category
                  ]?.icon || "🛒"
                }
              </span>

              <strong>
                {category}
              </strong>
            </div>

            <div className="shared-items">
              {items.map((item) => (
                <SharedListItem
                  key={item.sharedId}
                  item={item}
                  onToggleComplete={
                    onToggleComplete
                  }
                  onRemark={
                    onRemark
                  }
                />
              ))}
            </div>
          </section>
        )
      )}

      <div className="shared-actions">
        <div className="shared-share-row">
          <button
            className="secondary-button"
            onClick={onShareLink}
          >
            <Link2 size={18} />
            Share Link
          </button>

          <button
            className="secondary-button"
            onClick={onShareList}
          >
            <Share2 size={18} />
            Share List
          </button>
        </div>

        <button
          className="primary-button full"
          onClick={onFinish}
        >
          <Check size={18} />
          Finish Shopping
        </button>
      </div>
    </main>
  );
}

function SharedListItem({
  item,
  onToggleComplete,
  onRemark,
}) {
  return (
    <article
      className={`shared-item ${
        item.completed
          ? "completed"
          : ""
      }`}
    >
      <button
        className="check-circle"
        onClick={() =>
          onToggleComplete(
            item.sharedId
          )
        }
      >
        {item.completed && (
          <Check size={15} />
        )}
      </button>

      <div className="shared-item-image text-shared-item">
        <div className="shared-item-english">
          {item.name}
        </div>

        {item.teluguName && (
          <div className="shared-item-telugu">
            {item.teluguName}
          </div>
        )}
      </div>

      <div className="shared-item-main">
        <strong>
          {item.name}
        </strong>

        <span>
          {formatQuantity(
            item.quantity
          )}{" "}
          {item.unit}
        </span>

        {item.specification && (
          <small>
            {item.specification}
          </small>
        )}

        {item.remark && (
          <div className="remark-preview">
            💬 {item.remark}
          </div>
        )}
      </div>

      <button
        className="remark-button"
        onClick={() =>
          onRemark(item)
        }
      >
        <Edit3 size={16} />

        <span>
          {item.remark
            ? "Edit"
            : "Remark"}
        </span>
      </button>
    </article>
  );
}

function RemarkSheet({
  item,
  onClose,
  onSave,
}) {
  const [remark, setRemark] =
    useState(item.remark || "");

  return (
    <div
      className="overlay"
      onMouseDown={onClose}
    >
      <div
        className="sheet"
        onMouseDown={(e) =>
          e.stopPropagation()
        }
      >
        <div className="sheet-handle" />

        <div className="sheet-header">
          <button
            className="icon-button"
            onClick={onClose}
          >
            <X size={19} />
          </button>

          <strong>
            Add a remark
          </strong>

          <span />
        </div>

        <div className="remark-item-title">
          <span>
            {item.emoji}
          </span>

          <div>
            <strong>
              {item.name}
            </strong>

            <small>
              {formatQuantity(
                item.quantity
              )}{" "}
              {item.unit}
            </small>
          </div>
        </div>

        <label className="field-label">
          Remark
        </label>

        <textarea
          value={remark}
          onChange={(e) =>
            setRemark(
              e.target.value
            )
          }
          placeholder='Example: "Get the small packet"'
          rows={4}
          autoFocus
        />

        <button
          className="primary-button full"
          onClick={() =>
            onSave(remark.trim())
          }
        >
          <Check size={18} />
          Save remark
        </button>
      </div>
    </div>
  );
}

function HistoryScreen({
  history,
  onBack,
  onReuse,
  selectedHistoryIds,
  setSelectedHistoryIds,
  onDeleteSelected,
  onDeleteAll,
}) {
  return (
    <main className="page">
      <div className="screen-top">
        <button
          className="back-button"
          onClick={onBack}
        >
          <ArrowLeft size={18} />
          Home
        </button>
      </div>

      <section className="list-header">
        <span className="eyebrow">
          <History size={15} />
          Previous lists
        </span>

        <h1>
          Your shopping history
        </h1>

        <p>
          Reuse an old list instead of
          rebuilding everything from
          scratch.
        </p>
      </section>

      {history.length > 0 && (
        <div className="history-actions">
          <button
            className="secondary-button"
            onClick={() => {
              if (
                selectedHistoryIds.length ===
                history.length
              ) {
                setSelectedHistoryIds([]);
              } else {
                setSelectedHistoryIds(
                  history.map(
                    (item) => item.id
                  )
                );
              }
            }}
          >
            {selectedHistoryIds.length ===
            history.length
              ? "Unselect All"
              : "Select All"}
          </button>

          <button
            className="secondary-button"
            onClick={onDeleteSelected}
            disabled={
              selectedHistoryIds.length === 0
            }
          >
            🗑️ Delete Selected
          </button>

          <button
            className="secondary-button"
            onClick={onDeleteAll}
          >
            🧹 Delete All
          </button>
        </div>
      )}

      {history.length === 0 ? (
        <div className="empty-state large">
          <div>📋</div>

          <h2>
            No previous lists yet
          </h2>

          <p>
            Completed shopping lists will
            appear here.
          </p>
        </div>
      ) : (
        <div className="history-list">
          {history.map(
            (list) => (
              <article
                className="history-card"
                key={list.id}
              >
                <div className="history-card-top">
                  <div>
                    <label className="history-select">
                      <input
                        type="checkbox"
                        checked={selectedHistoryIds.includes(
                          list.id
                        )}
                        onChange={() => {
                          setSelectedHistoryIds(
                            (prev) =>
                              prev.includes(list.id)
                                ? prev.filter(
                                    (id) =>
                                      id !== list.id
                                  )
                                : [
                                    ...prev,
                                    list.id,
                                  ]
                          );
                        }}
                      />
                      <span>Select</span>
                    </label>

                    <span className="section-kicker">
                      {new Date(
                        list.completedAt ||
                          list.createdAt
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </span>

                    <h3>
                      Shopping list
                    </h3>
                  </div>

                  <span className="history-count">
                    {
                      list.items.length
                    }{" "}
                    items
                  </span>
                </div>

                <div className="history-preview">
                  {list.items
                    .slice(0, 5)
                    .map(
                      (item) => (
                        <span
                          key={
                            item.sharedId
                          }
                        >
                          {item.emoji}{" "}
                          {item.name}
                        </span>
                      )
                    )}

                  {list.items.length >
                    5 && (
                    <span>
                      +
                      {list.items
                        .length -
                        5}{" "}
                      more
                    </span>
                  )}
                </div>

                <button
                  className="secondary-button full"
                  onClick={() =>
                    onReuse(list)
                  }
                >
                  Reuse this list
                  <ChevronRight
                    size={17}
                  />
                </button>
              </article>
            )
          )}
        </div>
      )}
    </main>
  );
}