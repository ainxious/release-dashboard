<script setup>
import StatusCard from "./components/StatusCard.vue";

const deploymentCards = [
  {
    label: "Current Version",
    value: "dashboard-web@2026.05.18",
    tone: "neutral",
  },
  {
    label: "Last Deployment",
    value: "2026-05-18 18:42 UTC",
    tone: "good",
  },
  {
    label: "Release Notes",
    value: "Layout fixes and deployment metadata cleanup",
    tone: "neutral",
  },
];
</script>

<template>
  <main class="shell">
    <section class="hero">
      <p class="eyebrow">Internal Operations</p>
      <h1>Deployment Status Dashboard</h1>
      <p class="lede">
        Small internal page used by support and release engineering to confirm
        the active static web deployment.
      </p>
    </section>

    <section class="grid">
      <StatusCard
        v-for="card in deploymentCards"
        :key="card.label"
        :label="card.label"
        :value="card.value"
        :tone="card.tone"
      />
    </section>
  </main>
</template>

<style>
:root {
  font-family: "IBM Plex Sans", "Segoe UI", sans-serif;
  color: #12202f;
  background:
    radial-gradient(circle at top left, rgba(162, 186, 202, 0.3), transparent 28%),
    linear-gradient(180deg, #edf2f6 0%, #dbe5eb 100%);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}

.shell {
  max-width: 960px;
  margin: 0 auto;
  padding: 64px 24px 72px;
}

.hero {
  margin-bottom: 28px;
}

.eyebrow {
  margin: 0 0 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-size: 0.76rem;
  color: #4f677d;
}

h1 {
  margin: 0;
  font-size: clamp(2.2rem, 5vw, 4rem);
  line-height: 0.95;
  letter-spacing: -0.04em;
}

.lede {
  max-width: 48rem;
  margin: 14px 0 0;
  line-height: 1.6;
  color: #33485b;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

@media (max-width: 760px) {
  .shell {
    padding: 40px 18px 48px;
  }

  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
