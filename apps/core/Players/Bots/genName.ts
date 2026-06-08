const firstNames = [
  "Alex",
  "Jordan",
  "Taylor",
  "Morgan",
  "Casey",
  "Logan",
  "Ryan",
  "Ethan",
  "Noah",
  "Liam",
  "Mia",
  "Emma",
  "Sophia",
  "Olivia",
  "Ava",
];

const lastNames = [
  "Walker",
  "Stone",
  "Parker",
  "Brooks",
  "Reed",
  "Hayes",
  "Knight",
  "Foster",
  "Cole",
  "Hunter",
  "Fox",
  "Hart",
  "Blake",
  "Grant",
];

const prefixes = [
  "Shadow",
  "Nova",
  "Iron",
  "Rapid",
  "Silent",
  "Ghost",
  "Alpha",
  "Viper",
  "Steel",
  "Frost",
];

function randomItem<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function generateBotName(): string {
  const roll = Math.random();
  if (roll < 0.6) {
    return `${randomItem(firstNames)}${randomItem(lastNames)}`;
  }
  if (roll < 0.9) {
    return `${randomItem(prefixes)}${randomItem(lastNames)}`;
  }
  return `${randomItem(prefixes)}${randomItem(lastNames)}${Math.floor(Math.random() * 1000)}`;
}
