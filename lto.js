#!/usr/bin/env node

function random() {
  return Math.ceil(Math.random() * 137) % 45 || 45;
}

const set = new Set();

while (set.size < 6) {
  set.add(random());
}

console.log(...[...set].sort((a, b) => a - b));
