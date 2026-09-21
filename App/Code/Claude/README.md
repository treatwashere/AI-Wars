# VELOCITY

A high-octane neon dodging game built for the AI Wars challenge. Survive the incoming obstacles, collect power-ups, and beat your high score!

## 🎮 Game Features

- **Progressive Difficulty**: Game speed increases with each level
- **Power-ups**: Collect shields to restore health and speed boosts for temporary advantages
- **Smooth Controls**: Use arrow keys, WASD, or mouse/touch to move
- **Responsive Design**: Works on desktop, tablet, and mobile
- **High Score Tracking**: Beat your personal best
- **Cyberpunk Aesthetic**: Neon graphics with particle effects

## 🕹️ How to Play

1. Click **PLAY GAME** to start
2. Move your player (green square) left and right to dodge incoming obstacles
3. Collect colorful power-ups for bonuses:
   - 🛡️ Shield (blue): Restore 1 life
   - ⚡ Speed (yellow): Temporary movement boost
4. Survive as long as possible and maximize your score!
5. Each 500 points increases the level and spawn rate

## 🎯 Controls

- **Arrow Keys / WASD**: Move left/right
- **Mouse**: Move to cursor position
- **Touch**: Drag to follow your finger
- **Space**: Start game (from home screen)

## 📊 Scoring System

- **10 points**: Dodge each obstacle
- **50 points**: Collect a power-up
- **Level**: Increases every 500 points
- **Lives**: Start with 3, lose 1 per collision

## 🚀 Deployment

### Local Testing
```bash
# Simply open index.html in a modern web browser
open index.html
```

### Deploy to Vercel
```bash
vercel
```

### Deploy to GitHub Pages
1. Push to your GitHub repository
2. Go to Settings → Pages
3. Select "Deploy from a branch"
4. Choose the main branch

## 📁 File Structure

```
velocity-game/
├── index.html      # Main HTML file with game screens
├── style.css       # Neon cyberpunk styling
├── game.js         # Game logic and mechanics
└── README.md       # This file
```

## ⚙️ Technical Details

- **Canvas API**: Used for game rendering
- **No Dependencies**: Pure vanilla JavaScript
- **Optimized Performance**: 60 FPS game loop
- **Responsive**: Auto-scales to window size

## 🎨 Design Features

- Cyberpunk gradient background
- Neon color scheme (#00ff88 primary)
- Particle effects on collisions
- Animated UI elements
- Glow effects and shadows
- Grid background pattern

## 🏆 Made by Claude for AI Wars 🤖

A submission for the AI Wars game challenge where 4 AIs compete to build the best game!

---

**Challenge Requirements**: Impressive gameplay, smooth controls, visual polish ✅
