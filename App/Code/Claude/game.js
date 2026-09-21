// ===== VELOCITY GAME =====
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Game variables
let gameRunning = false;
let gamePaused = false;
let score = 0;
let lives = 3;
let level = 1;

// Player
const player = {
  x: canvas.width / 2,
  y: canvas.height - 50,
  width: 40,
  height: 40,
  speed: 6,
  vx: 0
};

// Arrays
let obstacles = [];
let powerups = [];
let particles = [];

// Keyboard input
const keys = {};
window.addEventListener('keydown', (e) => {
  keys[e.key] = true;
  
  if (e.key === ' ' && !gameRunning) {
    startGame();
  }
});
window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

// Mobile touch controls
canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  player.x = touch.clientX - player.width / 2;
  player.x = Math.max(0, Math.min(player.x, canvas.width - player.width));
});

// Mouse controls
canvas.addEventListener('mousemove', (e) => {
  player.x = e.clientX - player.width / 2;
  player.x = Math.max(0, Math.min(player.x, canvas.width - player.width));
});

// Obstacle class
class Obstacle {
  constructor() {
    this.width = 40 + Math.random() * 30;
    this.height = 40 + Math.random() * 30;
    this.x = Math.random() * (canvas.width - this.width);
    this.y = -this.height;
    this.speed = 3 + level * 0.5;
    this.color = `hsl(${Math.random() * 60 + 0}, 100%, 50%)`;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }

  update() {
    this.y += this.speed;
  }

  isOffScreen() {
    return this.y > canvas.height;
  }
}

// Powerup class
class Powerup {
  constructor() {
    this.width = 25;
    this.height = 25;
    this.x = Math.random() * (canvas.width - this.width);
    this.y = -this.height;
    this.speed = 2;
    this.type = Math.random() > 0.5 ? 'shield' : 'speed';
  }

  draw() {
    ctx.fillStyle = this.type === 'shield' ? '#64c8ff' : '#ffd700';
    ctx.beginPath();
    ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.type === 'shield' ? '🛡️' : '⚡', this.x + this.width / 2, this.y + this.height / 2);
  }

  update() {
    this.y += this.speed;
  }

  isOffScreen() {
    return this.y > canvas.height;
  }
}

// Particle class
class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 8;
    this.vy = (Math.random() - 0.5) * 8;
    this.life = 30;
    this.color = color;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.life / 30;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.2; // gravity
    this.life--;
  }

  isDead() {
    return this.life <= 0;
  }
}

// Update player position
function updatePlayer() {
  if (keys['ArrowLeft'] || keys['a']) {
    player.vx = -player.speed;
  } else if (keys['ArrowRight'] || keys['d']) {
    player.vx = player.speed;
  } else {
    player.vx *= 0.8;
  }

  player.x += player.vx;
  player.x = Math.max(0, Math.min(player.x, canvas.width - player.width));
}

// Draw player
function drawPlayer() {
  ctx.fillStyle = '#00ff88';
  ctx.fillRect(player.x, player.y, player.width, player.height);
  ctx.strokeStyle = '#00cc6f';
  ctx.lineWidth = 3;
  ctx.strokeRect(player.x, player.y, player.width, player.height);

  // Glow effect
  ctx.strokeStyle = 'rgba(0, 255, 136, 0.2)';
  ctx.lineWidth = 10;
  ctx.strokeRect(player.x - 5, player.y - 5, player.width + 10, player.height + 10);
}

// Collision detection
function checkCollisions() {
  // Check obstacles
  for (let i = obstacles.length - 1; i >= 0; i--) {
    const obs = obstacles[i];
    if (
      player.x < obs.x + obs.width &&
      player.x + player.width > obs.x &&
      player.y < obs.y + obs.height &&
      player.y + player.height > obs.y
    ) {
      lives--;
      createExplosion(obs.x, obs.y, obs.color);
      obstacles.splice(i, 1);
      if (lives <= 0) {
        endGame();
      }
    }
  }

  // Check powerups
  for (let i = powerups.length - 1; i >= 0; i--) {
    const pw = powerups[i];
    const dist = Math.hypot(
      (player.x + player.width / 2) - (pw.x + pw.width / 2),
      (player.y + player.height / 2) - (pw.y + pw.height / 2)
    );

    if (dist < player.width / 2 + pw.width / 2) {
      if (pw.type === 'shield' && lives < 3) {
        lives++;
      }
      score += 50;
      createExplosion(pw.x, pw.y, pw.type === 'shield' ? '#64c8ff' : '#ffd700');
      powerups.splice(i, 1);
    }
  }
}

// Create explosion effect
function createExplosion(x, y, color) {
  for (let i = 0; i < 15; i++) {
    particles.push(new Particle(x, y, color));
  }
}

// Update game state
function update() {
  updatePlayer();

  // Update obstacles
  obstacles.forEach((obs) => {
    obs.update();
  });

  // Remove offscreen obstacles and add score
  obstacles = obstacles.filter((obs) => {
    if (obs.isOffScreen()) {
      score += 10;
      return false;
    }
    return true;
  });

  // Update powerups
  powerups.forEach((pw) => {
    pw.update();
  });

  powerups = powerups.filter((pw) => !pw.isOffScreen());

  // Update particles
  particles.forEach((p) => {
    p.update();
  });

  particles = particles.filter((p) => !p.isDead());

  checkCollisions();

  // Spawn obstacles
  if (Math.random() < 0.02 + level * 0.002) {
    obstacles.push(new Obstacle());
  }

  // Spawn powerups (less frequently)
  if (Math.random() < 0.005) {
    powerups.push(new Powerup());
  }

  // Increase level
  if (score > 0 && score % 500 === 0) {
    level = Math.floor(score / 500) + 1;
  }

  // Update UI
  document.getElementById('score').textContent = score;
  document.getElementById('lives').textContent = lives;
}

// Draw everything
function draw() {
  // Clear canvas with gradient
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#0a0e27');
  gradient.addColorStop(1, '#1a1a3e');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw grid
  ctx.strokeStyle = 'rgba(0, 255, 136, 0.05)';
  ctx.lineWidth = 1;
  for (let i = 0; i < canvas.width; i += 50) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, canvas.height);
    ctx.stroke();
  }
  for (let i = 0; i < canvas.height; i += 50) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(canvas.width, i);
    ctx.stroke();
  }

  // Draw level
  ctx.fillStyle = '#64c8ff';
  ctx.font = 'bold 16px Courier New';
  ctx.textAlign = 'right';
  ctx.fillText(`Level: ${level}`, canvas.width - 20, 60);

  // Draw game objects
  obstacles.forEach((obs) => obs.draw());
  powerups.forEach((pw) => pw.draw());
  particles.forEach((p) => p.draw());
  drawPlayer();
}

// Game loop
function gameLoop() {
  if (gameRunning) {
    update();
  }
  draw();
  requestAnimationFrame(gameLoop);
}

// Start game
function startGame() {
  gameRunning = true;
  score = 0;
  lives = 3;
  level = 1;
  obstacles = [];
  powerups = [];
  particles = [];
  player.x = canvas.width / 2;
  player.y = canvas.height - 50;
  document.getElementById('gameScreen').style.display = 'block';
  document.getElementById('homeScreen').style.display = 'none';
  document.getElementById('gameOverScreen').style.display = 'none';
}

// End game
function endGame() {
  gameRunning = false;
  document.getElementById('finalScore').textContent = score;
  document.getElementById('gameOverScreen').style.display = 'flex';
}

// UI Buttons
document.getElementById('playBtn').addEventListener('click', startGame);
document.getElementById('backBtn').addEventListener('click', () => {
  gameRunning = false;
  document.getElementById('gameScreen').style.display = 'none';
  document.getElementById('homeScreen').style.display = 'flex';
  document.getElementById('gameOverScreen').style.display = 'none';
});
document.getElementById('retryBtn').addEventListener('click', startGame);
document.getElementById('homeBtn').addEventListener('click', () => {
  gameRunning = false;
  document.getElementById('gameScreen').style.display = 'none';
  document.getElementById('homeScreen').style.display = 'flex';
  document.getElementById('gameOverScreen').style.display = 'none';
});

// Start game loop
gameLoop();
