"use strict";

const SAVE_KEY = "brainrotPetsSaveV1";
const EGG_COST = 15;
const MAX_OFFLINE_SECONDS = 4 * 60 * 60;
const EGG_COST_GROWTH = 1.045;
const NEW_PET_CHANCE = 0.85;

const pets = [
  { name: "Sapo Meme", emoji: "🐸", rarity: "Comum", cps: 0.5, weight: 12, unlockAt: 0, description: "O rei dos pulinhos e dos memes. Começou humilde, mas nunca para de render moedas." },
  { name: "Pombo Turbo", emoji: "🐦", rarity: "Comum", cps: 0.6, weight: 12, unlockAt: 0, description: "Entrega moedas na velocidade da luz. Se ouvir um pombo, já sabe: vem renda por aí." },
  { name: "Gatinho Pixel", emoji: "🐱", rarity: "Comum", cps: 0.8, weight: 11, unlockAt: 0, description: "Um gatinho saído de um fliperama secreto, com energia pixelada de sobra." },
  { name: "Pato DJ", emoji: "🦆", rarity: "Comum", cps: 0.9, weight: 11, unlockAt: 0, description: "Solta o beat, gira o bico e transforma qualquer pista em uma chuva de moedas." },
  { name: "Capivara Zen", emoji: "🦫", rarity: "Comum", cps: 1, weight: 10, unlockAt: 0, description: "Calminha por fora, máquina de moedas por dentro. A paz nunca foi tão lucrativa." },
  { name: "Hamster Turbo", emoji: "🐹", rarity: "Comum", cps: 0.7, weight: 10, unlockAt: 0, description: "Corre na rodinha, acelera a diversão e deixa moedas pelo caminho." },
  { name: "Panda Mochi", emoji: "🐼", rarity: "Comum", cps: 1.1, weight: 9, unlockAt: 0, description: "Fofo, sonolento e surpreendentemente bom em juntar braincoins." },
  { name: "Cachorro Sorriso", emoji: "🐶", rarity: "Comum", cps: 1.2, weight: 9, unlockAt: 0, description: "O melhor amigo do clique! A alegria dele rende moedas todo segundo." },
  { name: "Coelho Saltitante", emoji: "🐰", rarity: "Comum", cps: 1.4, weight: 8, unlockAt: 5, description: "Dá um pulinho de cada vez e enche sua carteira num piscar de olhos." },
  { name: "Pintinho Pop", emoji: "🐤", rarity: "Comum", cps: 1.5, weight: 8, unlockAt: 10, description: "Pequeno no tamanho, gigante no carisma e nas moedinhas." },
  { name: "Raposa Foguete", emoji: "🦊", rarity: "Raro", cps: 2.2, weight: 8, unlockAt: 15, description: "Esperta e veloz: essa raposa sempre encontra um novo jeito de farmar." },
  { name: "Pinguim Patinador", emoji: "🐧", rarity: "Raro", cps: 2.5, weight: 8, unlockAt: 20, description: "Desliza no gelo deixando um caminho de moedas brilhantes." },
  { name: "Guaxinim Lancheiro", emoji: "🦝", rarity: "Raro", cps: 2.8, weight: 7, unlockAt: 25, description: "Especialista em lanchinhos roubados e em achar moedas escondidas." },
  { name: "Macaco Banana", emoji: "🐵", rarity: "Raro", cps: 3, weight: 7, unlockAt: 30, description: "Faz bagunça, dança e transforma cada banana numa fortuna." },
  { name: "Tartaruga Ninja", emoji: "🐢", rarity: "Raro", cps: 3.2, weight: 7, unlockAt: 35, description: "No ritmo dela, mas sempre no caminho certo para a riqueza." },
  { name: "Coruja Estudiosa", emoji: "🦉", rarity: "Raro", cps: 3.5, weight: 6, unlockAt: 40, description: "Sabedoria de mestre e visão noturna para encontrar moedas perdidas." },
  { name: "Polvo DJ", emoji: "🐙", rarity: "Raro", cps: 4, weight: 6, unlockAt: 45, description: "Oito braços, oito pistas de dança e uma batida que vale ouro." },
  { name: "Abelhinha Mel", emoji: "🐝", rarity: "Raro", cps: 4.2, weight: 6, unlockAt: 50, description: "Trabalhadora incansável: produz mel, alegria e braincoins." },
  { name: "Sushi Ninja", emoji: "🍣", rarity: "Raro", cps: 4.5, weight: 5, unlockAt: 55, description: "Um rolinho ninja que aparece, faz o serviço e some com estilo." },
  { name: "Caranguejo DJ", emoji: "🦀", rarity: "Raro", cps: 5, weight: 5, unlockAt: 60, description: "Dança de lado, mas só anda para frente quando o assunto é moedas." },
  { name: "Flamingo Fashion", emoji: "🦩", rarity: "Épico", cps: 7, weight: 5, unlockAt: 70, description: "Chega todo estiloso e transforma qualquer coleção em passarela." },
  { name: "Lhama Dramática", emoji: "🦙", rarity: "Épico", cps: 8, weight: 5, unlockAt: 80, description: "Faz drama por tudo, menos pela renda passiva, que não para de crescer." },
  { name: "Tubarão de Boia", emoji: "🦈", rarity: "Épico", cps: 9, weight: 4, unlockAt: 90, description: "O terror da piscina infantil e o melhor amigo da sua carteira." },
  { name: "Abacaxi Ninja", emoji: "🍍", rarity: "Épico", cps: 10, weight: 4, unlockAt: 100, description: "Por fora é espinhoso; por dentro, uma máquina tropical de moedas." },
  { name: "Morcego Astral", emoji: "🦇", rarity: "Épico", cps: 11, weight: 4, unlockAt: 110, description: "Voa pela noite e pelo espaço recolhendo tesouros cósmicos." },
  { name: "Sereia Pixel", emoji: "🧜‍♀️", rarity: "Épico", cps: 12, weight: 4, unlockAt: 120, description: "Seu canto hipnotiza até as moedas, que vêm direto para a coleção." },
  { name: "Golem de Gelatina", emoji: "🟢", rarity: "Épico", cps: 13, weight: 3, unlockAt: 130, description: "Mole, verde e feito de gelatina — mas sua renda é bem sólida." },
  { name: "Cacto Dançarino", emoji: "🌵", rarity: "Épico", cps: 14, weight: 3, unlockAt: 140, description: "Dança sem espetar ninguém e floresce em braincoins." },
  { name: "Dragão Cósmico", emoji: "🐉", rarity: "Lendário", cps: 20, weight: 3, unlockAt: 150, description: "Uma lenda galáctica! Raríssimo, brilhante e com uma chuva de moedas no rastro." },
  { name: "Axolote Neon", emoji: "🦎", rarity: "Lendário", cps: 23, weight: 3, unlockAt: 165, description: "Brilha no escuro e deixa um rastro de neon. Um lendário de outro planeta!" },
  { name: "Unicórnio Glitch", emoji: "🦄", rarity: "Lendário", cps: 26, weight: 2, unlockAt: 180, description: "Um bug raríssimo do universo! Brilha em todas as cores e é absurdamente poderoso." },
  { name: "Fênix de Marshmallow", emoji: "🐦‍🔥", rarity: "Lendário", cps: 30, weight: 2, unlockAt: 195, description: "Renasce quentinha do forno e espalha uma chuva de moedas doces." },
  { name: "Robô Coração", emoji: "🤖", rarity: "Lendário", cps: 34, weight: 2, unlockAt: 210, description: "Foi programado para duas coisas: amizade e renda automática." },
  { name: "Baleia Galáctica", emoji: "🐳", rarity: "Lendário", cps: 38, weight: 2, unlockAt: 225, description: "Nada entre as estrelas cantando canções que atraem moedas." },
  { name: "Gato Arco-íris", emoji: "😺", rarity: "Lendário", cps: 42, weight: 2, unlockAt: 240, description: "Deixa um rastro colorido e uma fortuna por onde passa." },
  { name: "Fantasma Fofo", emoji: "👻", rarity: "Mítico", cps: 55, weight: 2, unlockAt: 260, description: "Dá sustinhos amigáveis e assombra sua carteira com moedas." },
  { name: "Rei dos Patos", emoji: "👑", rarity: "Mítico", cps: 68, weight: 1, unlockAt: 280, description: "O soberano da lagoa chegou! Todo mundo faz quá e paga tributo." },
  { name: "Dragão de Cristal", emoji: "💎", rarity: "Mítico", cps: 82, weight: 1, unlockAt: 300, description: "Feito de cristais raros, brilha mais que qualquer tesouro." },
  { name: "Disco Voador Pet", emoji: "🛸", rarity: "Mítico", cps: 100, weight: 1, unlockAt: 325, description: "Abduz vacas e devolve em forma de braincoins." },
  { name: "Golem de Ouro", emoji: "🪙", rarity: "Mítico", cps: 125, weight: 1, unlockAt: 350, description: "Um colosso dourado que converte cada passo em uma mina de moedas." },
  { name: "Solzinho Meme", emoji: "🌞", rarity: "Mítico", cps: 155, weight: 1, unlockAt: 375, description: "Ilumina sua coleção e aquece seus ganhos o dia inteiro." },
  { name: "Deus do Brainrot", emoji: "🧠", rarity: "Divino", cps: 220, weight: 0.7, unlockAt: 400, description: "A criatura suprema do caos. Quando aparece, a coleção vira lenda." },
  { name: "Gato Astronauta", emoji: "👨‍🚀", rarity: "Divino", cps: 300, weight: 0.5, unlockAt: 450, description: "Foi até a lua atrás de queijo e voltou com uma galáxia de moedas." },
  { name: "Refrigerante Cósmico", emoji: "🥤", rarity: "Divino", cps: 420, weight: 0.35, unlockAt: 500, description: "Uma bebida tão lendária que cada bolha vale uma chuva de braincoins." },
  { name: "Ovo Supremo", emoji: "🥚", rarity: "Divino", cps: 600, weight: 0.2, unlockAt: 600, description: "O mistério final! Um ovo que chocou a si mesmo e virou uma lenda viva." }
];

const upgrades = [
  { id: "glove", name: "Luva Turbo", emoji: "🧤", description: "+1 moeda por clique", baseCost: 15, clickBonus: 1, cpsBonus: 0 },
  { id: "auto", name: "Auto-Clicker", emoji: "🤖", description: "+0,5 moeda por segundo", baseCost: 35, clickBonus: 0, cpsBonus: 0.5 },
  { id: "coffee", name: "Super Café", emoji: "☕", description: "+2 moedas por clique", baseCost: 55, clickBonus: 2, cpsBonus: 0 },
  { id: "pet-snack", name: "Lanchinho Pet", emoji: "🦴", description: "+0,8 moeda/s por pet", baseCost: 45, cpsPerPet: 0.8 },
  { id: "gold-glove", name: "Luva Dourada", emoji: "🥊", description: "+5 moedas por clique", baseCost: 110, clickBonus: 5, cpsBonus: 0 },
  { id: "egg-coupon", name: "Cupom de Ovo", emoji: "🎟️", description: "Ovos 8% mais baratos", baseCost: 75, eggDiscount: 0.08 },
  { id: "drum", name: "Bateria Automática", emoji: "🥁", description: "+2 moedas por segundo", baseCost: 95, clickBonus: 0, cpsBonus: 2 },
  { id: "clicker-mouse", name: "Mouse Gamer", emoji: "🖱️", description: "+4 moedas por clique", baseCost: 160, clickBonus: 4, cpsBonus: 0 },
  { id: "pet-hotel", name: "Hotel dos Pets", emoji: "🏨", description: "+2 moedas/s por pet", baseCost: 180, cpsPerPet: 2 },
  { id: "discount-machine", name: "Máquina de Descontos", emoji: "🏷️", description: "Ovos 12% mais baratos", baseCost: 220, eggDiscount: 0.12 },
  { id: "energy-drink", name: "Energético Galáctico", emoji: "🥤", description: "Multiplica sua força de clique por 1,5", baseCost: 280, clickMultiplier: 1.5 },
  { id: "coin-drone", name: "Drone de Moedas", emoji: "🚁", description: "+8 moedas por segundo", baseCost: 340, clickBonus: 0, cpsBonus: 8 },
  { id: "golden-carrot", name: "Cenoura Dourada", emoji: "🥕", description: "+4 moedas/s por pet", baseCost: 420, cpsPerPet: 4 },
  { id: "mega-click", name: "Mega Tap", emoji: "💥", description: "+15 moedas por clique", baseCost: 600, clickBonus: 15, cpsBonus: 0 },
  { id: "time-machine", name: "Máquina do Tempo", emoji: "⏰", description: "+25 moedas por segundo", baseCost: 800, clickBonus: 0, cpsBonus: 25 },
  { id: "diamond-glove", name: "Luva de Diamante", emoji: "💎", description: "Multiplica sua força de clique por 2", baseCost: 1200, clickMultiplier: 2, cpsBonus: 0 }
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
  upgrades: Object.fromEntries(upgrades.map((upgrade) => [upgrade.id, 0])),
  pets: {},
  selectedPet: null,
  eggsHatched: 0,
  totalCoinsEarned: 0,
  unlockedAchievements: [],
  savedAt: Date.now()
});

let state = loadState();
let audioContext;
let hatchInProgress = false;
let lastSaveTime = Date.now();
let currentMode = "menu";
let timedRun = null;
let timedRunTimer = null;
let timeExpiredPending = false;

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
  petSelectButton: document.getElementById("pet-select-button"),
  timerPanel: document.getElementById("timer-panel"),
  timerLabel: document.getElementById("timer-label"),
  timerProgress: document.getElementById("timer-progress"),
  timerModeName: document.getElementById("timer-mode-name"),
  modeDialog: document.getElementById("mode-dialog"),
  runDialog: document.getElementById("run-dialog"),
  runSummary: document.getElementById("run-summary"),
  modeLabel: document.getElementById("mode-label"),
  openModeButton: document.getElementById("open-mode-button"),
  clickButton: document.getElementById("click-button")
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
    clean.totalCoinsEarned = finiteNonNegative(saved.totalCoinsEarned);
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
  if (currentMode !== "normal") return;
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
  const upgradeIncome = upgrades.reduce((sum, upgrade) => {
    const level = state.upgrades[upgrade.id];
    return sum + level * (upgrade.cpsBonus || 0) + level * (upgrade.cpsPerPet || 0) * getPetCount();
  }, 0);
  return petIncome + upgradeIncome;
}

function getClickPower() {
  return upgrades.reduce(
    (power, upgrade) => power * Math.pow(upgrade.clickMultiplier || 1, state.upgrades[upgrade.id]),
    state.clickPower
  );
}

function getPetCount() {
  return Object.values(state.pets).reduce((sum, count) => sum + count, 0);
}

function getEggCost() {
  const discount = Math.min(0.65, upgrades.reduce(
    (total, upgrade) => total + state.upgrades[upgrade.id] * (upgrade.eggDiscount || 0),
    0
  ));
  const growingCost = EGG_COST * Math.pow(EGG_COST_GROWTH, state.eggsHatched);
  return Math.min(150, Math.max(5, Math.ceil(growingCost * (1 - discount))));
}

function getAvailablePets(clickCount = state.totalClicks) {
  return pets.filter((pet) => pet.unlockAt <= clickCount);
}

function getPetDropChance(pet) {
  const availablePets = getAvailablePets();
  const availableWeight = availablePets.reduce((sum, item) => sum + item.weight, 0);
  const unownedPets = availablePets.filter((item) => !state.pets[item.name]);
  const unownedWeight = unownedPets.reduce((sum, item) => sum + item.weight, 0);
  const petWeight = pet.weight;
  if (!unownedWeight) return petWeight / availableWeight;
  if (state.pets[pet.name]) return (1 - NEW_PET_CHANCE) * petWeight / availableWeight;
  return NEW_PET_CHANCE * petWeight / unownedWeight + (1 - NEW_PET_CHANCE) * petWeight / availableWeight;
}

function formatNumber(number) {
  if (number < 1000) return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: number % 1 ? 1 : 0 }).format(number);
  return new Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 }).format(number);
}

function getUpgradeCost(upgrade) {
  return Math.floor(upgrade.baseCost * Math.pow(1.42, state.upgrades[upgrade.id]));
}

function getLevelInfo() {
  const level = Math.floor(state.totalClicks / 100) + 1;
  return { level, progress: state.totalClicks % 100 };
}

function formatDuration(seconds) {
  if (seconds < 60) return `${seconds} s`;
  if (seconds === 3600) return "1 hora";
  const minutes = seconds / 60;
  return `${minutes} min`;
}

function formatClock(seconds) {
  const remaining = Math.max(0, Math.ceil(seconds));
  const minutes = Math.floor(remaining / 60);
  const secs = remaining % 60;
  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

function renderTimer() {
  if (currentMode !== "timed" || !timedRun) return;
  const remaining = Math.max(0, (timedRun.deadline - Date.now()) / 1000);
  ui.timerLabel.textContent = formatClock(remaining);
  ui.timerProgress.style.width = `${Math.min(100, (remaining / timedRun.durationSeconds) * 100)}%`;
}

function canPlay() {
  if (currentMode === "normal") return true;
  if (currentMode !== "timed" || !timedRun) return false;
  if (Date.now() < timedRun.deadline) return true;
  const firstExpiredAction = !timeExpiredPending;
  timeExpiredPending = true;
  if (!hatchInProgress) finishTimedRun();
  else if (firstExpiredAction) render();
  return false;
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
  ui.modeLabel.hidden = currentMode === "menu" || currentMode === "timed" || currentMode === "finished";
  document.getElementById("timer-panel").hidden = currentMode !== "timed";
  ui.openModeButton.hidden = currentMode === "timed" || currentMode === "finished";
  ui.timerModeName.textContent = timedRun ? `CORRIDA · ${formatDuration(timedRun.durationSeconds)}` : "CORRIDA CONTRA O TEMPO";
  document.getElementById("timer-panel").classList.toggle("urgent", currentMode === "timed" && timedRun && timedRun.deadline - Date.now() <= 10_000);
  const timerExpired = currentMode === "timed" && timedRun && Date.now() >= timedRun.deadline;
  ui.clickButton.disabled = currentMode === "finished" || currentMode === "menu" || timerExpired;
  ui.hatchButton.disabled = currentMode === "finished" || currentMode === "menu" || timerExpired || hatchInProgress || state.coins < getEggCost();
  ui.eggCost.textContent = formatNumber(getEggCost());
  renderTimer();
  renderActivePet();
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
    button.disabled = currentMode === "finished" || currentMode === "menu" ||
      (currentMode === "timed" && timedRun && Date.now() >= timedRun.deadline) || state.coins < cost;
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
  }
  for (const pet of ownedPets) {
    const active = state.selectedPet === pet.name;
    const card = document.createElement("button");
    card.className = `pet-card${active ? " active" : ""}`;
    card.type = "button";
    card.dataset.petName = pet.name;
    card.disabled = currentMode === "finished" || currentMode === "menu" ||
      (currentMode === "timed" && timedRun && Date.now() >= timedRun.deadline);
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
  ui.petDetailChance.textContent = `${formatNumber(getPetDropChance(pet) * 100)}%`;
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
  if (!canPlay()) return;
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
  if (!canPlay()) return;
  const upgrade = upgrades.find((item) => item.id === id);
  if (!upgrade) return;
  const cost = getUpgradeCost(upgrade);
  if (state.coins < cost) return;
  state.coins -= cost;
  state.upgrades[id] += 1;
  state.clickPower += upgrade.clickBonus || 0;
  playTone(540, 0.08, "sine");
  showToast(`${upgrade.emoji} ${upgrade.name} comprado!`);
  checkAchievements();
  saveState();
  render();
}

function handleClick(event) {
  if (!canPlay()) return;
  const previousClicks = state.totalClicks;
  const clickReward = getClickPower();
  state.coins += clickReward;
  state.totalCoinsEarned += clickReward;
  state.totalClicks += 1;
  if (announcePetUnlock(previousClicks, state.totalClicks)) saveState();
  const button = event.currentTarget;
  button.classList.add("is-clicked");
  window.setTimeout(() => button.classList.remove("is-clicked"), 95);
  createFloatingCoin(event, `+${formatNumber(clickReward)}`);
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
  if (!canPlay() || hatchInProgress || state.coins < cost) return;
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
    playTone(["Lendário", "Mítico", "Divino"].includes(pet.rarity) ? 880 : 660, 0.2, "sine");
    showToast(`${pet.emoji} Você chocou ${pet.name}!`);
    checkAchievements();
    saveState();
    render();
    window.setTimeout(() => {
      ui.overlay.classList.remove("visible");
      ui.overlay.setAttribute("aria-hidden", "true");
      hatchInProgress = false;
      render();
      if (timeExpiredPending || (currentMode === "timed" && Date.now() >= timedRun.deadline)) {
        finishTimedRun();
      }
    }, 1500);
  }, 1150);
}

function pickPet() {
  const availablePets = getAvailablePets();
  const unownedPets = availablePets.filter((pet) => !state.pets[pet.name]);
  const pool = unownedPets.length && Math.random() < NEW_PET_CHANCE ? unownedPets : availablePets;
  const totalWeight = pool.reduce((sum, pet) => sum + pet.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const pet of pool) {
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

function startNormalMode() {
  currentMode = "normal";
  timedRun = null;
  timeExpiredPending = false;
  state = loadState();
  lastSaveTime = Date.now();
  applyOfflineEarnings();
  render();
  ui.modeDialog.close();
}

function startTimedRun(durationSeconds) {
  const allowedDurations = [60, 600, 1800, 3600];
  if (!allowedDurations.includes(durationSeconds)) return;
  if (ui.runDialog.open) ui.runDialog.close();
  state = defaultState();
  currentMode = "timed";
  hatchInProgress = false;
  timeExpiredPending = false;
  timedRun = {
    durationSeconds,
    startedAt: Date.now(),
    deadline: Date.now() + durationSeconds * 1000
  };
  render();
  ui.modeDialog.close();
  renderTimer();
}

function openModeMenu() {
  if (currentMode === "timed") return;
  if (currentMode === "normal") saveState();
  if (ui.runDialog.open) ui.runDialog.close();
  if (ui.petDialog.open) ui.petDialog.close();
  currentMode = "menu";
  timedRun = null;
  timeExpiredPending = false;
  state = loadState();
  render();
  if (!ui.modeDialog.open) ui.modeDialog.showModal();
}

function finishTimedRun() {
  if (currentMode !== "timed" || !timedRun || hatchInProgress) {
    timeExpiredPending = true;
    return;
  }
  currentMode = "finished";
  timeExpiredPending = false;
  ui.timerLabel.textContent = "0:00";
  ui.timerProgress.style.width = "0%";
  if (ui.petDialog.open) ui.petDialog.close();
  render();

  const uniquePets = pets.filter((pet) => state.pets[pet.name] > 0).length;
  const upgradesBought = Object.values(state.upgrades).reduce((total, level) => total + level, 0);
  const results = [
    { emoji: "🪙", label: "Moedas coletadas", value: formatNumber(state.totalCoinsEarned) },
    { emoji: "👆", label: "Cliques", value: formatNumber(state.totalClicks) },
    { emoji: "🥚", label: "Ovos chocados", value: formatNumber(state.eggsHatched) },
    { emoji: "🐾", label: "Pets únicos", value: `${uniquePets}/${pets.length}` },
    { emoji: "🛍️", label: "Upgrades comprados", value: formatNumber(upgradesBought) },
    { emoji: "⚡", label: "Renda final", value: `${formatNumber(getCps())}/s` }
  ];
  ui.runSummary.replaceChildren();
  for (const result of results) {
    const item = document.createElement("div");
    item.className = "run-summary-item";
    const icon = document.createElement("span");
    icon.className = "run-summary-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = result.emoji;
    const copy = document.createElement("span");
    copy.className = "run-summary-copy";
    const label = document.createElement("small");
    label.textContent = result.label;
    const value = document.createElement("strong");
    value.textContent = result.value;
    copy.append(label, value);
    item.append(icon, copy);
    ui.runSummary.append(item);
  }
  document.getElementById("run-result-subtitle").textContent =
    `Corrida de ${formatDuration(timedRun.durationSeconds)} concluída. Quer tentar bater esse recorde?`;
  document.getElementById("retry-run-button").textContent =
    `🏁 Correr de novo · ${formatDuration(timedRun.durationSeconds)}`;
  ui.runDialog.showModal();
}

function updateTimedRun() {
  if (currentMode !== "timed" || !timedRun) return;
  renderTimer();
  if (Date.now() >= timedRun.deadline) {
    if (!timeExpiredPending) {
      timeExpiredPending = true;
      if (hatchInProgress) render();
    }
    if (!hatchInProgress) finishTimedRun();
  }
}

function getTimedShareMessage() {
  return `🏁 Minha corrida no Brainrot Pets (${formatDuration(timedRun.durationSeconds)})! Fiz ${formatNumber(state.totalClicks)} cliques, juntei ${formatNumber(state.totalCoinsEarned)} moedas, choquei ${state.eggsHatched} ovos e coletei ${pets.filter((pet) => state.pets[pet.name] > 0).length} pets únicos! Você consegue superar? ${window.location.href}`;
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
  await shareMessage(message, "Meu recorde no Brainrot Pets");
}

async function shareTimedRecord() {
  if (!timedRun || currentMode !== "finished") return;
  await shareMessage(getTimedShareMessage(), "Minha corrida no Brainrot Pets");
}

async function shareMessage(message, title) {
  try {
    if (navigator.share) {
      await navigator.share({ title, text: message });
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

function registerMonetagServiceWorker() {
  if (!("serviceWorker" in navigator) || window.location.protocol === "file:") return;

  navigator.serviceWorker.register("./sw.js", { scope: "./" })
    .then(() => console.info("Service worker da Monetag registrado."))
    .catch((error) => {
      console.error("Não foi possível registrar o service worker da Monetag.", error);
    });
}

function applyOfflineEarnings() {
  const now = Date.now();
  const elapsedSeconds = Math.min(Math.max((now - state.savedAt) / 1000, 0), MAX_OFFLINE_SECONDS);
  const earnings = getCps() * elapsedSeconds;
  if (earnings >= 1) {
    state.coins += earnings;
    state.totalCoinsEarned += earnings;
    showToast(`🌙 Enquanto você estava fora, ganhou ${formatNumber(earnings)} braincoins!`);
  }
}

document.getElementById("normal-mode-button").addEventListener("click", startNormalMode);
document.querySelectorAll(".duration-options [data-duration]").forEach((button) => {
  button.addEventListener("click", () => startTimedRun(Number(button.dataset.duration)));
});
ui.openModeButton.addEventListener("click", openModeMenu);
document.getElementById("share-run-button").addEventListener("click", shareTimedRecord);
document.getElementById("retry-run-button").addEventListener("click", () => {
  if (timedRun) startTimedRun(timedRun.durationSeconds);
});
document.getElementById("run-menu-button").addEventListener("click", openModeMenu);
ui.runDialog.addEventListener("cancel", (event) => event.preventDefault());
ui.modeDialog.addEventListener("cancel", (event) => event.preventDefault());

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

render();
registerMonetagServiceWorker();
ui.modeDialog.showModal();

window.setInterval(() => {
  if (!canPlay()) return;
  const cps = getCps();
  if (cps > 0) {
    state.coins += cps;
    state.totalCoinsEarned += cps;
    checkAchievements();
    render();
  }
}, 1000);

window.setInterval(updateTimedRun, 200);
window.setInterval(() => {
  if (currentMode === "normal" && Date.now() - lastSaveTime >= 5000) saveState();
}, 5000);

window.addEventListener("beforeunload", saveState);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") saveState();
});
