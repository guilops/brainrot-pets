"use strict";

const SAVE_KEY = "brainrotPetsSaveV1";
const EGG_COST = 50;
const MAX_OFFLINE_SECONDS = 4 * 60 * 60;
const EGG_COST_GROWTH = 1.28;

const pets = [
  { name: "Sapo Meme", emoji: "🐸", rarity: "Comum", cps: 0.4, weight: 48, unlockAt: 0, description: "O rei dos pulinhos e dos memes. Começou humilde, mas nunca para de render moedas." },
  { name: "Pombo Turbo", emoji: "🐦", rarity: "Comum", cps: 0.5, weight: 32, unlockAt: 0, description: "Entrega moedas na velocidade da luz. Se ouvir um pombo, já sabe: vem renda por aí." },
  { name: "Gatinho Pixel", emoji: "🐱", rarity: "Raro", cps: 1.5, weight: 13, unlockAt: 25, description: "Um gatinho saído de um fliperama secreto, com energia pixelada de sobra." },
  { name: "Pato DJ", emoji: "🦆", rarity: "Raro", cps: 2.5, weight: 8, unlockAt: 75, description: "Solta o beat, gira o bico e transforma qualquer pista em uma chuva de moedas." },
  { name: "Capivara Zen", emoji: "🦫", rarity: "Épico", cps: 5, weight: 5, unlockAt: 150, description: "Calminha por fora, máquina de moedas por dentro. A paz nunca foi tão lucrativa." },
  { name: "Dragão Cósmico", emoji: "🐉", rarity: "Lendário", cps: 18, weight: 2, unlockAt: 300, description: "Uma lenda galáctica! Raríssimo, brilhante e com uma chuva de moedas no rastro." },
  { name: "Axolote Neon", emoji: "🦎", rarity: "Lendário", cps: 32, weight: 1, unlockAt: 700, description: "Brilha no escuro e deixa um rastro de neon. Um lendário de outro planeta!" },
  { name: "Unicórnio Glitch", emoji: "🦄", rarity: "Mítico", cps: 75, weight: 0.35, unlockAt: 1500, description: "Um bug raríssimo do universo! Quase impossível de achar e absurdamente poderoso." }
];

const upgrades = [
  { id: "glove", name: "Luva Turbo", emoji: "🧤", description: "+1 moeda por clique", baseCost: 25, clickBonus: 1, cpsBonus: 0 },
  { id: "auto", name: "Auto-Clicker", emoji: "🤖", description: "+0,5 moeda por segundo", baseCost: 75, clickBonus: 0, cpsBonus: 0.5 },
  { id: "coffee", name: "Super Café", emoji: "☕", description: "+2 moedas por clique", baseCost: 180, clickBonus: 2, cpsBonus: 0 }
];

const achievements = [
  { id: "first-click", name: "Primeiro tap!", description: "Faça seu primeiro clique", emoji: "👆", requirement: (s) => s.totalClicks >= 1 },
  { id: "click-100", name: "Dedinhos turbo", description: "Chegue a 100 cliques", emoji: "⚡", requirement: (s) => s.totalClicks >= 100 },
  { id: "coins-500", name: "Chuva de moedas", description: "Junte 500 braincoins", emoji: "🤑", requirement: (s) => s.coins >= 500 },
  { id: "first-pet", name: "Amigo novo", description: "Choque seu primeiro ovo", emoji: "🐣", requirement: (s) => Object.values(s.pets).reduce((sum, count) => sum + count, 0) >= 1 },
  { id: "pet-collector", name: "Turma completa", description: "Colecione 5 pets", emoji: "🏆", requirement: (s) => Object.values(s.pets).reduce((sum, count) => sum + count, 0) >= 5 }
];

const defaultState = () => ({
  coins: 0,
  totalClicks: 0,
  clickPower: 1,
  upgrades: { glove: 0, auto: 0, coffee: 0 },
  pets: {},
  selectedPet: null,
  eggsHatched: 0,
  unlockedAchievements: [],
  savedAt: Date.now()
});

let state = loadState();
let audioContext;
let hatchInProgress = false;
let lastSaveTime = Date.now();

const ui = {
  coins: document.getElementById("coin-count"),
  cps: document.getElementById("cps-count"),
  clicks: document.getElementById("click-count"),
  totalClicks: document.getElementById("total-clicks"),
  petCount: document.getElementById("pet-count"),
  level: document.getElementById("player-level"),
  progress: document.getElementById("level-progress"),
  progressLabel: document.getElementById("progress-label"),
  upgradeList: document.getElementById("upgrade-list"),
  collection: document.getElementById("collection-grid"),
  collectionCount: document.getElementById("collection-count"),
  achievements: document.getElementById("achievement-list"),
  eggCost: document.getElementById("egg-cost"),
  hatchButton: document.getElementById("hatch-button"),
  overlay: document.getElementById("hatch-overlay"),
  hatchEgg: document.getElementById("hatch-egg"),
  hatchResult: document.getElementById("hatch-result"),
  hatchModal: document.querySelector(".hatch-modal"),
  toastStack: document.getElementById("toast-stack"),
  mainPet: document.getElementById("main-pet"),
  activePetLabel: document.getElementById("active-pet-label"),
  petDialog: document.getElementById("pet-dialog"),
  petDialogClose: document.getElementById("pet-dialog-close"),
  petDetailArt: document.getElementById("pet-detail-art"),
  petDetailName: document.getElementById("pet-dialog-name"),
  petDetailRarity: document.getElementById("pet-detail-rarity"),
  petDetailDescription: document.getElementById("pet-detail-description"),
  petDetailCps: document.getElementById("pet-detail-cps"),
  petDetailCount: document.getElementById("pet-detail-count"),
  petDetailChance: document.getElementById("pet-detail-chance"),
  petSelectButton: document.getElementById("pet-select-button")
};

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (!saved || typeof saved !== "object") return defaultState();
    const clean = defaultState();
    clean.coins = finiteNonNegative(saved.coins);
    clean.totalClicks = finiteNonNegative(saved.totalClicks);
    clean.clickPower = Math.max(1, finiteNonNegative(saved.clickPower));
    clean.upgrades = { ...clean.upgrades, ...(saved.upgrades || {}) };
    for (const upgrade of upgrades) {
      clean.upgrades[upgrade.id] = Math.floor(finiteNonNegative(clean.upgrades[upgrade.id]));
    }
    if (saved.pets && typeof saved.pets === "object") {
      for (const pet of pets) clean.pets[pet.name] = Math.floor(finiteNonNegative(saved.pets[pet.name]));
    }
    clean.selectedPet = pets.some((pet) => pet.name === saved.selectedPet && clean.pets[pet.name] > 0)
      ? saved.selectedPet
      : null;
    clean.eggsHatched = Math.floor(finiteNonNegative(saved.eggsHatched));
    clean.unlockedAchievements = Array.isArray(saved.unlockedAchievements)
      ? saved.unlockedAchievements.filter((id) => achievements.some((item) => item.id === id))
      : [];
    clean.savedAt = finiteNonNegative(saved.savedAt) || Date.now();
    return clean;
  } catch (error) {
    console.error("Não foi possível carregar o progresso salvo.", error);
    return defaultState();
  }
}

function finiteNonNegative(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : 0;
}

function saveState() {
  state.savedAt = Date.now();
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    lastSaveTime = state.savedAt;
  } catch (error) {
    console.error("Não foi possível salvar o progresso do jogo.", error);
    showToast("Não foi possível salvar. Verifique o espaço do navegador.");
  }
}

function getCps() {
  const petIncome = pets.reduce((sum, pet) => sum + (state.pets[pet.name] || 0) * pet.cps, 0);
  const upgradeIncome = upgrades.reduce((sum, upgrade) => sum + state.upgrades[upgrade.id] * upgrade.cpsBonus, 0);
  return petIncome + upgradeIncome;
}

function getPetCount() {
  return Object.values(state.pets).reduce((sum, count) => sum + count, 0);
}

function getEggCost() {
  return Math.min(1_000_000_000_000, Math.ceil((EGG_COST * Math.pow(EGG_COST_GROWTH, state.eggsHatched)) / 5) * 5);
}

function getAvailablePets(clickCount = state.totalClicks) {
  return pets.filter((pet) => pet.unlockAt <= clickCount);
}

function formatNumber(number) {
  if (number < 1000) return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: number % 1 ? 1 : 0 }).format(number);
  return new Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 }).format(number);
}

function getUpgradeCost(upgrade) {
  return Math.floor(upgrade.baseCost * Math.pow(1.6, state.upgrades[upgrade.id]));
}

function getLevelInfo() {
  const level = Math.floor(state.totalClicks / 100) + 1;
  return { level, progress: state.totalClicks % 100 };
}

function render() {
  const cps = getCps();
  const petCount = getPetCount();
  const levelInfo = getLevelInfo();
  ui.coins.textContent = formatNumber(state.coins);
  ui.cps.textContent = formatNumber(cps);
  ui.clicks.textContent = formatNumber(state.totalClicks);
  ui.totalClicks.textContent = formatNumber(state.totalClicks);
  ui.petCount.textContent = formatNumber(petCount);
  ui.level.textContent = levelInfo.level;
  ui.progress.style.width = `${levelInfo.progress}%`;
  ui.progressLabel.textContent = `${levelInfo.progress} / 100 XP`;
  renderActivePet();
  ui.eggCost.textContent = formatNumber(getEggCost());
  ui.hatchButton.disabled = hatchInProgress || state.coins < getEggCost();
  renderUpgrades();
  renderCollection();
  renderNextUnlock();
  renderAchievements();
}

function renderUpgrades() {
  ui.upgradeList.replaceChildren();
  for (const upgrade of upgrades) {
    const cost = getUpgradeCost(upgrade);
    const item = document.createElement("div");
    item.className = "upgrade-item";
    const icon = document.createElement("span");
    icon.className = "upgrade-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = upgrade.emoji;
    const copy = document.createElement("div");
    copy.className = "upgrade-copy";
    const name = document.createElement("div");
    name.className = "upgrade-name";
    name.textContent = upgrade.name;
    const description = document.createElement("div");
    description.className = "upgrade-description";
    description.textContent = upgrade.description;
    const level = document.createElement("div");
    level.className = "upgrade-level";
    level.textContent = `Nível ${state.upgrades[upgrade.id]}`;
    const button = document.createElement("button");
    button.className = "upgrade-buy";
    button.type = "button";
    button.disabled = state.coins < cost;
    button.setAttribute("aria-label", `Comprar ${upgrade.name} por ${formatNumber(cost)} moedas`);
    button.innerHTML = `COMPRAR<span>🪙 ${formatNumber(cost)}</span>`;
    button.addEventListener("click", () => buyUpgrade(upgrade.id));
    copy.append(name, description, level);
    item.append(icon, copy, button);
    ui.upgradeList.append(item);
  }
}

function renderCollection() {
  ui.collection.replaceChildren();
  const count = getPetCount();
  const ownedPets = pets.filter((pet) => state.pets[pet.name] > 0);
  const uniqueCount = ownedPets.length;
  ui.collectionCount.textContent = `${count} ${count === 1 ? "pet" : "pets"} · ${uniqueCount}/${pets.length} espécies`;
  if (ownedPets.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-collection";
    empty.innerHTML = "<span aria-hidden=\"true\">🫣</span><p>Seus pets vão aparecer aqui!</p><small>Choque um ovo para começar</small>";
    ui.collection.append(empty);
    return;
  }
  for (const pet of ownedPets) {
    const active = state.selectedPet === pet.name;
    const card = document.createElement("button");
    card.className = `pet-card${active ? " active" : ""}`;
    card.type = "button";
    card.dataset.petName = pet.name;
    card.setAttribute("aria-label", `${pet.name}, ${pet.rarity}, ${formatNumber(pet.cps)} moedas por segundo${active ? ", pet ativo" : ""}. Ver detalhes`);
    const emoji = document.createElement("span");
    emoji.className = "pet-card-emoji";
    emoji.setAttribute("aria-hidden", "true");
    emoji.textContent = pet.emoji;
    const copy = document.createElement("div");
    copy.className = "pet-card-copy";
    const name = document.createElement("div");
    name.className = "pet-card-name";
    name.textContent = pet.name;
    const rarity = document.createElement("div");
    rarity.className = `pet-card-rarity ${getRarityClass(pet)}`;
    rarity.textContent = `${pet.rarity} · +${formatNumber(pet.cps)}/s`;
    const countBadge = document.createElement("span");
    countBadge.className = "pet-card-count";
    countBadge.textContent = `×${state.pets[pet.name]}`;
    const activeBadge = document.createElement("span");
    activeBadge.className = "pet-card-active";
    activeBadge.textContent = active ? "ATIVO" : "VER";
    copy.append(name, rarity);
    card.append(emoji, copy, countBadge, activeBadge);
    card.addEventListener("click", () => openPetDetails(pet.name));
    ui.collection.append(card);
  }
  const availablePets = getAvailablePets().filter((pet) => !state.pets[pet.name]);
  for (const pet of availablePets) {
    const card = document.createElement("div");
    card.className = `pet-card available ${getRarityClass(pet)}`;
    card.setAttribute("aria-label", `${pet.name}, ${pet.rarity}, disponível nos ovos`);
    const icon = document.createElement("span");
    icon.className = "pet-card-emoji";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = pet.emoji;
    const copy = document.createElement("div");
    copy.className = "pet-card-copy";
    const name = document.createElement("div");
    name.className = "pet-card-name";
    name.textContent = pet.name;
    const rarity = document.createElement("div");
    rarity.className = `pet-card-rarity ${getRarityClass(pet)}`;
    rarity.textContent = `${pet.rarity} · Disponível nos ovos`;
    copy.append(name, rarity);
    card.append(icon, copy);
    ui.collection.append(card);
  }
  for (const pet of pets.filter((item) => item.unlockAt > state.totalClicks)) {
    const card = document.createElement("div");
    card.className = `pet-card locked ${getRarityClass(pet)}`;
    card.setAttribute("aria-label", `${pet.rarity} bloqueado, desbloqueia em ${formatNumber(pet.unlockAt)} cliques`);
    const icon = document.createElement("span");
    icon.className = "pet-card-emoji";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "🔒";
    const copy = document.createElement("div");
    copy.className = "pet-card-copy";
    const name = document.createElement("div");
    name.className = "pet-card-name";
    name.textContent = "Pet misterioso";
    const rarity = document.createElement("div");
    rarity.className = `pet-card-rarity ${getRarityClass(pet)}`;
    rarity.textContent = `${pet.rarity} · ${formatNumber(pet.unlockAt - state.totalClicks)} cliques`;
    copy.append(name, rarity);
    card.append(icon, copy);
    ui.collection.append(card);
  }
}

function renderNextUnlock() {
  const nextPet = pets.find((pet) => pet.unlockAt > state.totalClicks);
  const panel = document.getElementById("next-unlock");
  const label = document.getElementById("next-unlock-label");
  const name = document.getElementById("next-unlock-name");
  const rarity = document.getElementById("next-unlock-rarity");
  const progress = document.getElementById("next-unlock-progress");
  if (!nextPet) {
    panel.hidden = true;
    return;
  }
  const previousMilestone = pets.reduce((latest, pet) => pet.unlockAt <= state.totalClicks ? Math.max(latest, pet.unlockAt) : latest, 0);
  const range = nextPet.unlockAt - previousMilestone;
  const earned = state.totalClicks - previousMilestone;
  panel.hidden = false;
  label.textContent = `${formatNumber(nextPet.unlockAt - state.totalClicks)} cliques para desbloquear`;
  name.textContent = nextPet.name;
  rarity.textContent = nextPet.rarity;
  progress.style.width = `${Math.min(100, (earned / range) * 100)}%`;
}

function renderActivePet() {
  const pet = pets.find((item) => item.name === state.selectedPet);
  ui.mainPet.textContent = pet ? pet.emoji : "🐸";
  ui.activePetLabel.textContent = pet ? `${pet.name} · ${pet.rarity}` : "Pet inicial";
  ui.mainPet.parentElement.setAttribute(
    "aria-label",
    `Clique para ganhar braincoins com ${pet ? pet.name : "seu pet inicial"}`
  );
}

let petDialogReturnPetName;

function openPetDetails(petName) {
  const pet = pets.find((item) => item.name === petName && state.pets[item.name] > 0);
  if (!pet) return;
  petDialogReturnPetName = pet.name;
  ui.petDetailArt.textContent = pet.emoji;
  ui.petDetailName.textContent = pet.name;
  ui.petDetailRarity.textContent = pet.rarity;
  ui.petDetailRarity.className = `pet-detail-rarity ${getRarityClass(pet)}`;
  ui.petDetailDescription.textContent = pet.description;
  ui.petDetailCps.textContent = `+${formatNumber(pet.cps)} moedas/s`;
  ui.petDetailCount.textContent = `×${state.pets[pet.name]}`;
  const availablePets = getAvailablePets();
  const totalWeight = availablePets.reduce((sum, item) => sum + item.weight, 0);
  ui.petDetailChance.textContent = `${formatNumber((pet.weight / totalWeight) * 100)}%`;
  const active = state.selectedPet === pet.name;
  ui.petSelectButton.textContent = active ? "✓ Já está selecionado" : "Escolher para clicar";
  ui.petSelectButton.disabled = active;
  ui.petSelectButton.dataset.petName = pet.name;
  ui.petDialog.showModal();
}

function getRarityClass(pet) {
  return pet.rarity.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function selectPet(petName) {
  const pet = pets.find((item) => item.name === petName && state.pets[item.name] > 0);
  if (!pet) return;
  state.selectedPet = pet.name;
  saveState();
  render();
  playTone(620, 0.1, "sine");
  showToast(`${pet.emoji} ${pet.name} agora é seu pet de clique!`);
  ui.petDialog.close();
  document.getElementById("click-button").focus();
}

function renderAchievements() {
  ui.achievements.replaceChildren();
  for (const achievement of achievements) {
    const unlocked = state.unlockedAchievements.includes(achievement.id);
    const item = document.createElement("div");
    item.className = `achievement-item${unlocked ? " unlocked" : ""}`;
    const icon = document.createElement("span");
    icon.className = "achievement-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = achievement.emoji;
    const copy = document.createElement("div");
    copy.className = "achievement-copy";
    const name = document.createElement("div");
    name.className = "achievement-name";
    name.textContent = achievement.name;
    const description = document.createElement("div");
    description.className = "achievement-description";
    description.textContent = achievement.description;
    const status = document.createElement("span");
    status.className = "achievement-status";
    status.textContent = unlocked ? "FEITA!" : "BLOQ.";
    copy.append(name, description);
    item.append(icon, copy, status);
    ui.achievements.append(item);
  }
}

function buyUpgrade(id) {
  const upgrade = upgrades.find((item) => item.id === id);
  if (!upgrade) return;
  const cost = getUpgradeCost(upgrade);
  if (state.coins < cost) return;
  state.coins -= cost;
  state.upgrades[id] += 1;
  state.clickPower += upgrade.clickBonus;
  playTone(540, 0.08, "sine");
  showToast(`${upgrade.emoji} ${upgrade.name} comprado!`);
  checkAchievements();
  saveState();
  render();
}

function handleClick(event) {
  const previousClicks = state.totalClicks;
  state.coins += state.clickPower;
  state.totalClicks += 1;
  if (announcePetUnlock(previousClicks, state.totalClicks)) saveState();
  const button = event.currentTarget;
  button.classList.add("is-clicked");
  window.setTimeout(() => button.classList.remove("is-clicked"), 95);
  createFloatingCoin(event, `+${formatNumber(state.clickPower)}`);
  playTone(380 + Math.random() * 160, 0.045, "triangle", 0.035);
  if (navigator.vibrate) navigator.vibrate(8);
  checkAchievements();
  render();
}

function createFloatingCoin(event, text) {
  const zone = document.querySelector(".click-zone");
  const zoneRect = zone.getBoundingClientRect();
  const x = event.clientX || zoneRect.left + zoneRect.width / 2;
  const y = event.clientY || zoneRect.top + zoneRect.height / 2;
  const float = document.createElement("span");
  float.className = "float-coin";
  float.setAttribute("aria-hidden", "true");
  float.textContent = text;
  float.style.left = `${Math.min(Math.max(x - zoneRect.left, 24), zoneRect.width - 24)}px`;
  float.style.top = `${Math.max(y - zoneRect.top - 12, 48)}px`;
  zone.append(float);
  window.setTimeout(() => float.remove(), 850);
}

function hatchPet() {
  const cost = getEggCost();
  if (hatchInProgress || state.coins < cost) return;
  state.coins -= cost;
  hatchInProgress = true;
  ui.overlay.classList.add("visible");
  ui.overlay.setAttribute("aria-hidden", "false");
  ui.hatchEgg.classList.remove("revealed");
  ui.hatchEgg.textContent = "🥚";
  ui.hatchResult.textContent = "O que será que vem aí?";
  ui.hatchModal.classList.remove("show-result");
  playTone(280, 0.11, "sine");
  render();

  window.setTimeout(() => {
    const pet = pickPet();
    state.eggsHatched += 1;
    state.pets[pet.name] = (state.pets[pet.name] || 0) + 1;
    if (!state.selectedPet) state.selectedPet = pet.name;
    ui.hatchEgg.textContent = pet.emoji;
    ui.hatchEgg.classList.add("revealed");
    ui.hatchResult.textContent = `${pet.name}! (${pet.rarity}) +${formatNumber(pet.cps)} moedas/s`;
    ui.hatchModal.classList.add("show-result");
    playTone(pet.rarity === "Lendário" ? 880 : 660, 0.2, "sine");
    showToast(`${pet.emoji} Você chocou ${pet.name}!`);
    checkAchievements();
    saveState();
    render();
    window.setTimeout(() => {
      ui.overlay.classList.remove("visible");
      ui.overlay.setAttribute("aria-hidden", "true");
      hatchInProgress = false;
      render();
    }, 1500);
  }, 1150);
}

function pickPet() {
  const availablePets = getAvailablePets();
  const totalWeight = availablePets.reduce((sum, pet) => sum + pet.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const pet of availablePets) {
    roll -= pet.weight;
    if (roll < 0) return pet;
  }
  return pets[0];
}

function announcePetUnlock(previousClicks, currentClicks) {
  const newlyUnlocked = pets.find((pet) => pet.unlockAt > previousClicks && pet.unlockAt <= currentClicks);
  if (!newlyUnlocked) return false;
  showToast(`🔓 Novo pet disponível nos ovos: ${newlyUnlocked.name} (${newlyUnlocked.rarity})!`);
  playTone(740, 0.16, "sine");
  return true;
}

function checkAchievements() {
  let changed = false;
  for (const achievement of achievements) {
    if (!state.unlockedAchievements.includes(achievement.id) && achievement.requirement(state)) {
      state.unlockedAchievements.push(achievement.id);
      showToast(`🏆 Conquista desbloqueada: ${achievement.name}!`, true);
      playTone(760, 0.2, "sine");
      changed = true;
    }
  }
  if (changed) renderAchievements();
}

function showToast(message, achievement = false) {
  const toast = document.createElement("div");
  toast.className = `toast${achievement ? " achievement-toast" : ""}`;
  toast.textContent = message;
  ui.toastStack.append(toast);
  window.setTimeout(() => toast.remove(), 3200);
}

function playTone(frequency, duration, waveform, volume = 0.07) {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    audioContext = audioContext || new AudioContextClass();
    if (audioContext.state === "suspended") audioContext.resume();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = waveform;
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    gain.gain.setValueAtTime(volume, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  } catch (error) {
    console.error("Não foi possível reproduzir o efeito sonoro.", error);
  }
}

async function shareRecord() {
  const best = formatNumber(Math.floor(state.coins));
  const message = `Já subi de nível no Brainrot Pets! 🧠🐸 Tenho ${best} braincoins e ${getPetCount()} pets. Consegue me vencer? ${window.location.href}`;
  try {
    if (navigator.share) {
      await navigator.share({ title: "Meu recorde no Brainrot Pets", text: message });
      return;
    }
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(message);
      showToast("📋 Recorde copiado! Manda no grupo!");
      return;
    }
    const textarea = document.createElement("textarea");
    textarea.value = message;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    if (copied) showToast("📋 Recorde copiado! Manda no grupo!");
    else showToast("Não foi possível copiar. Tente novamente.");
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error("Não foi possível compartilhar o recorde.", error);
      showToast("Não foi possível compartilhar agora.");
    }
  }
}

function requestAdBoost() {
  // Integre aqui o SDK do anúncio recompensado e aplique o bônus somente após a confirmação do provedor.
  showToast("🎬 O anúncio recompensado ainda não está conectado.");
}

function applyOfflineEarnings() {
  const now = Date.now();
  const elapsedSeconds = Math.min(Math.max((now - state.savedAt) / 1000, 0), MAX_OFFLINE_SECONDS);
  const earnings = getCps() * elapsedSeconds;
  if (earnings >= 1) {
    state.coins += earnings;
    showToast(`🌙 Enquanto você estava fora, ganhou ${formatNumber(earnings)} braincoins!`);
  }
}

document.getElementById("click-button").addEventListener("click", handleClick);
ui.hatchButton.addEventListener("click", hatchPet);
document.getElementById("share-button").addEventListener("click", shareRecord);
document.getElementById("ad-boost-button").addEventListener("click", requestAdBoost);
ui.petDialogClose.addEventListener("click", () => ui.petDialog.close());
ui.petSelectButton.addEventListener("click", () => selectPet(ui.petSelectButton.dataset.petName));
ui.petDialog.addEventListener("click", (event) => {
  if (event.target === ui.petDialog) ui.petDialog.close();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && ui.petDialog.open) ui.petDialog.close();
});
ui.petDialog.addEventListener("close", () => {
  const selectedCard = [...ui.collection.querySelectorAll(".pet-card[data-pet-name]")]
    .find((card) => card.dataset.petName === petDialogReturnPetName);
  if (selectedCard) selectedCard.focus();
  petDialogReturnPetName = null;
});

applyOfflineEarnings();
render();
checkAchievements();

window.setInterval(() => {
  const cps = getCps();
  if (cps > 0) {
    state.coins += cps;
    checkAchievements();
    render();
  }
}, 1000);

window.setInterval(() => {
  if (Date.now() - lastSaveTime >= 5000) saveState();
}, 5000);

window.addEventListener("beforeunload", saveState);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") saveState();
});
