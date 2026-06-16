<template>
  <div class="page" :class="{ opened: cardOpened }">

    <div v-if="!cardOpened" class="envelope-wrapper" @click="openCard">
      <div class="envelope">
        <div class="envelope-flap"></div>
        <div class="envelope-body">
          <div class="envelope-letter">
            <span>💌</span>
          </div>
        </div>
      </div>
      <p class="tap-hint">tap to open</p>
    </div>

    <div v-if="cardOpened" class="card-wrapper">
      <div class="card" :class="{ visible: cardVisible }">
        <div class="card-inner">
          <div class="hearts-bg">
            <span v-for="h in hearts" :key="h.id" class="floating-heart" :style="h.style">{{ h.char }}</span>
          </div>

          <div class="card-content">
            <p class="from">From Ali 🌙</p>
            <h1 class="name">Nadene</h1>
            <div class="divider">
              <span>❤️</span>
            </div>
            <p class="message">
              Every day with you is my favourite day.<br />
              I love you more than any code I've ever written,<br />
              and that's saying a lot.<br /><br />
              You make everything better —<br />
              just by being you. 🌸
            </p>
            <p class="sign">— Ali xo</p>
            <div class="sparkles">
              <span v-for="s in sparkles" :key="s.id" class="sparkle" :style="s.style">✨</span>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'SpecialMessage',
  data() {
    return {
      cardOpened: false,
      cardVisible: false,
      hearts: [],
      sparkles: []
    };
  },
  methods: {
    openCard() {
      this.cardOpened = true;
      this.generateHearts();
      this.generateSparkles();
      setTimeout(() => { this.cardVisible = true; }, 100);
    },
    generateHearts() {
      const chars = ['❤️', '💕', '💗', '💖', '🌸', '💓'];
      this.hearts = Array.from({ length: 18 }, (_, i) => ({
        id: i,
        char: chars[Math.floor(Math.random() * chars.length)],
        style: {
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 4}s`,
          animationDuration: `${4 + Math.random() * 4}s`,
          fontSize: `${1 + Math.random() * 1.5}rem`,
          opacity: 0.15 + Math.random() * 0.2
        }
      }));
    },
    generateSparkles() {
      this.sparkles = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        style: {
          left: `${10 + Math.random() * 80}%`,
          top: `${10 + Math.random() * 80}%`,
          animationDelay: `${Math.random() * 2}s`,
          fontSize: `${0.8 + Math.random() * 0.8}rem`
        }
      }));
    }
  }
};
</script>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a0533 0%, #3b0764 50%, #1e1045 100%);
  overflow: hidden;
  position: relative;
}

/* ── Envelope ─────────────────────────────── */
.envelope-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

.envelope {
  width: 220px;
  height: 160px;
  position: relative;
  filter: drop-shadow(0 12px 32px rgba(236, 72, 153, 0.4));
  transition: transform 0.2s;
}

.envelope-wrapper:hover .envelope {
  transform: scale(1.05);
}

.envelope-flap {
  width: 0;
  height: 0;
  border-left: 110px solid transparent;
  border-right: 110px solid transparent;
  border-top: 80px solid #db2777;
  position: absolute;
  top: 0;
  z-index: 2;
  border-radius: 4px 4px 0 0;
}

.envelope-body {
  width: 220px;
  height: 160px;
  background: #ec4899;
  border-radius: 4px;
  position: absolute;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.envelope-letter {
  font-size: 3rem;
  animation: pulse-heart 1.2s ease-in-out infinite;
}

@keyframes pulse-heart {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

.tap-hint {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  margin-top: 20px;
  letter-spacing: 2px;
  text-transform: uppercase;
  font-family: 'Segoe UI', sans-serif;
  animation: blink 2s ease-in-out infinite;
}

@keyframes blink {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

/* ── Card ─────────────────────────────────── */
.card-wrapper {
  padding: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
}

.card {
  background: linear-gradient(145deg, #fff0f6, #fce7f3, #fff);
  border-radius: 20px;
  max-width: 440px;
  width: 100%;
  box-shadow: 0 24px 64px rgba(236, 72, 153, 0.35);
  transform: scale(0.8) translateY(40px);
  opacity: 0;
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
}

.card.visible {
  transform: scale(1) translateY(0);
  opacity: 1;
}

.card-inner {
  padding: 48px 40px;
  position: relative;
  z-index: 1;
}

.hearts-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.floating-heart {
  position: absolute;
  bottom: -20px;
  animation: rise linear infinite;
}

@keyframes rise {
  0% { bottom: -20px; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 0.8; }
  100% { bottom: 110%; opacity: 0; }
}

.from {
  font-size: 0.85rem;
  color: #9d174d;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 8px;
  font-family: 'Segoe UI', sans-serif;
  font-weight: 600;
}

.name {
  font-size: 3.2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #db2777, #9333ea);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 16px 0;
  line-height: 1;
  font-family: Georgia, serif;
}

.divider {
  font-size: 1.4rem;
  margin-bottom: 20px;
}

.message {
  font-size: 1.05rem;
  line-height: 1.85;
  color: #4b1d63;
  margin-bottom: 28px;
  font-family: Georgia, 'Times New Roman', serif;
}

.sign {
  font-size: 1.1rem;
  color: #db2777;
  font-style: italic;
  font-family: Georgia, serif;
  font-weight: 600;
}

.sparkles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.sparkle {
  position: absolute;
  animation: sparkle-pop 2s ease-in-out infinite;
}

@keyframes sparkle-pop {
  0%, 100% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1); opacity: 1; }
}

@media (max-width: 480px) {
  .card-inner { padding: 36px 28px; }
  .name { font-size: 2.6rem; }
  .message { font-size: 0.97rem; }
}
</style>
