<template>
  <div class="word-by-word">
    <div class="wbw-header">
      <h3 class="wbw-title text-heading">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
        Word-by-Word Analysis
      </h3>
      <button class="btn btn-sm btn-ghost" @click="collapsed = !collapsed">
        {{ collapsed ? 'Expand' : 'Collapse' }}
      </button>
    </div>

    <div v-if="!collapsed" class="wbw-grid">
      <div
        v-for="word in words"
        :key="word.id"
        class="word-card"
        :class="{ active: activeWord?.id === word.id }"
        @click="activeWord = activeWord?.id === word.id ? null : word"
      >
        <span class="word-arabic">{{ word.wordAr || word.word_ar }}</span>
        <span v-if="word.transliteration" class="word-translit">{{ word.transliteration }}</span>
        <span v-if="word.meaningEn || word.meaning_en" class="word-meaning">{{ word.meaningEn || word.meaning_en }}</span>
        <span v-else class="word-meaning word-empty">—</span>
      </div>
    </div>

    <!-- Expanded word details -->
    <Transition name="slide">
      <div v-if="activeWord" class="word-detail card card-accent">
        <div class="detail-header">
          <span class="detail-arabic">{{ activeWord.wordAr || activeWord.word_ar }}</span>
          <button class="btn btn-icon btn-ghost btn-sm" @click="activeWord = null">&times;</button>
        </div>
        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-label text-label">Transliteration</span>
            <span class="detail-value">{{ activeWord.transliteration || 'Not available' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label text-label">Meaning</span>
            <span class="detail-value">{{ activeWord.meaningEn || activeWord.meaning_en || 'Not available' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label text-label">Root</span>
            <span class="detail-value" style="direction: rtl;">{{ activeWord.rootAr || activeWord.root_ar || '—' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label text-label">Part of Speech</span>
            <span class="detail-value">{{ activeWord.morphologyPos || activeWord.morphology_pos || '—' }}</span>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  words: any[]
}>()

const collapsed = ref(false)
const activeWord = ref<any>(null)
</script>

<style scoped>
.word-by-word {
  margin-top: var(--sp-6);
}

.wbw-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--sp-4);
}

.wbw-title {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  font-size: var(--fs-base);
  color: var(--text-accent);
}

.wbw-grid {
  display: flex;
  flex-wrap: wrap-reverse;
  gap: var(--sp-2);
  direction: rtl;
  justify-content: center;
}

.word-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: var(--sp-3) var(--sp-3);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
  min-width: 60px;
  background: var(--bg-secondary);
}

.word-card:hover {
  border-color: var(--border-accent);
  background: var(--bg-accent);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.word-card.active {
  border-color: var(--emerald-500);
  background: var(--bg-accent);
  box-shadow: var(--shadow-glow);
}

.word-arabic {
  font-family: var(--font-arabic);
  font-size: var(--fs-lg);
  color: var(--text-primary);
  direction: rtl;
}

.word-translit {
  font-size: 10px;
  color: var(--text-accent);
  font-style: italic;
}

.word-meaning {
  font-size: 10px;
  color: var(--text-tertiary);
}

.word-empty {
  opacity: 0.3;
}

.word-detail {
  margin-top: var(--sp-4);
  padding: var(--sp-5);
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--sp-4);
}

.detail-arabic {
  font-family: var(--font-arabic);
  font-size: var(--fs-2xl);
  color: var(--text-accent);
  direction: rtl;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--sp-4);
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: var(--sp-1);
}

.detail-value {
  font-size: var(--fs-base);
  color: var(--text-primary);
  font-weight: 500;
}

.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from, .slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
