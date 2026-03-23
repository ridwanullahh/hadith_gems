<template>
  <div class="daily-hadith card card-gold islamic-pattern-bg animate-fade-in-up">
    <div class="daily-header">
      <span class="daily-label text-label">✨ Daily Hadith</span>
      <button class="btn btn-icon btn-ghost btn-sm" @click="$emit('refresh')" aria-label="Get new hadith">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
      </button>
    </div>

    <div v-if="hadith" class="daily-body">
      <div class="bismillah-deco">﷽</div>
      <p class="text-arabic daily-arabic">{{ hadith.textAr || hadith.text_ar }}</p>
      <div class="islamic-divider">❖</div>
      <p v-if="hadith.textEn || hadith.text_en" class="daily-translation">{{ hadith.textEn || hadith.text_en }}</p>

      <div class="daily-footer">
        <div class="daily-meta">
          <span v-if="hadith.grade" class="grade-badge" :class="gradeClass">{{ hadith.grade }}</span>
          <span v-if="hadith.reference" class="daily-ref">{{ hadith.reference }}</span>
        </div>
        <div class="daily-actions">
          <button class="btn btn-sm btn-ghost" @click.stop="$emit('share', hadith)" title="Share">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            Share
          </button>
          <NuxtLink v-if="hadith.id" :to="`/hadith/${hadith.id}`" class="btn btn-sm btn-primary">
            Read More →
          </NuxtLink>
        </div>
      </div>
    </div>

    <div v-else class="daily-loading">
      <div class="skeleton" style="height: 80px; margin-bottom: 16px;"></div>
      <div class="skeleton" style="height: 60px;"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  hadith: any
}>()

defineEmits(['refresh', 'share'])

const gradeClass = computed(() => {
  if (!props.hadith?.grade) return ''
  const g = props.hadith.grade.toLowerCase()
  if (g.includes('sahih')) return 'grade-sahih'
  if (g.includes('hasan')) return 'grade-hasan'
  return 'grade-daif'
})
</script>

<style scoped>
.daily-hadith {
  padding: var(--sp-6);
  border: 1px solid var(--gold-300);
  position: relative;
  overflow: hidden;
}

.daily-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--sp-4);
}

.daily-label {
  color: var(--text-gold);
  font-size: var(--fs-xs);
}

.bismillah-deco {
  font-family: var(--font-arabic);
  font-size: 2rem;
  color: var(--text-gold);
  text-align: center;
  margin-bottom: var(--sp-3);
  opacity: 0.7;
}

.daily-arabic {
  font-size: var(--fs-arabic-lg);
  text-align: center;
  color: var(--text-primary);
  padding: 0 var(--sp-2);
}

.daily-translation {
  font-size: var(--fs-base);
  color: var(--text-secondary);
  text-align: center;
  line-height: 1.8;
  font-style: italic;
  padding: 0 var(--sp-2);
}

.daily-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--sp-3);
  margin-top: var(--sp-6);
  padding-top: var(--sp-4);
  border-top: 1px solid var(--border-subtle);
}

.daily-meta {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
}

.daily-ref {
  font-size: var(--fs-xs);
  color: var(--text-tertiary);
}

.daily-actions {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
}

.daily-loading {
  padding: var(--sp-4);
}
</style>
