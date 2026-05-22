<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  tone: {
    type: String,
    default: "neutral",
  },
});
</script>

<template>
  <article class="card" :data-tone="tone">
    <p class="label">{{ label }}</p>
    <p class="value">{{ value }}</p>
  </article>
</template>

<style scoped>
.card {
  padding: 20px;
  border-radius: 18px;
  border: 1px solid rgba(18, 32, 47, 0.08);
  background: rgba(255, 255, 255, 0.78);
  box-shadow: 0 18px 38px rgba(35, 57, 78, 0.08);
  backdrop-filter: blur(6px);
}

.card[data-tone="good"] {
  border-color: rgba(37, 114, 72, 0.18);
}

.label {
  margin: 0 0 10px;
  font-size: 0.9rem;
  color: #5e7387;
}

.value {
  margin: 0;
  font-size: 1.1rem;
  line-height: 1.4;
  color: #12202f;
}
</style>
