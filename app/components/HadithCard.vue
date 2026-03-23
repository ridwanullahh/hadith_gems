<template>
  <div class="hadith-card card" @click="$emit('click')">
    <div class="card-header">
      <div class="hadith-number">{{ hadith.hadithNumber || hadith.hadith_number }}</div>
      <div class="card-meta">
        <span class="collection-name">{{ collectionName }}</span>
        <span v-if="grade" class="grade-badge" :class="gradeClass">{{ grade }}</span>
      </div>
    </div>

    <div class="card-body">
      <p class="text-arabic hadith-arabic">{{ truncateAr }}</p>
      <p v-if="textEn" class="hadith-translation">{{ truncateEn }}</p>
    </div>

    <div class="card-footer">
      <span v-if="narrator" class="narrator">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        {{ narrator }}
      </span>
      <button class="btn btn-icon btn-ghost btn-sm bookmark-btn" @click.stop="$emit('bookmark')" :aria-label="isBookmarked ? 'Remove bookmark' : 'Add bookmark'">
        <svg width="16" height="16" viewBox="0 0 24 24" :fill="isBookmarked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  hadith: any
  collectionName?: string
  isBookmarked?: boolean
}>()

defineEmits(['click', 'bookmark'])

const textAr = computed(() => props.hadith.textAr || props.hadith.text_ar || '')
const textEn = computed(() => props.hadith.textEn || props.hadith.text_en || '')
const grade = computed(() => props.hadith.grade || '')
const narrator = computed(() => props.hadith.narrator || '')

const truncateAr = computed(() => {
  const text = textAr.value
  return text.length > 200 ? text.substring(0, 200) + '...' : text
})

const truncateEn = computed(() => {
  const text = textEn.value
  return text.length > 180 ? text.substring(0, 180) + '...' : text
})

const gradeClass = computed(() => {
  const g = grade.value.toLowerCase()
  if (g.includes('sahih') || g.includes('صحيح')) return 'grade-sahih'
  if (g.includes('hasan') || g.includes('حسن')) return 'grade-hasan'
  if (g.includes('da') || g.includes('weak') || g.includes('ضعيف')) return 'grade-daif'
  return 'grade-sahih'
})
</script>

<style scoped>
.hadith-card {
  cursor: pointer;
  padding: var(--sp-5);
}

.card-header {
  display: flex;
  align-items: flex-start;
  gap: var(--sp-3);
  margin-bottom: var(--sp-4);
}

.card-meta {
  display: flex;
  flex-direction: column;
  gap: var(--sp-1);
  flex: 1;
}

.collection-name {
  font-size: var(--fs-xs);
  font-weight: 600;
  color: var(--text-accent);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.hadith-arabic {
  font-size: calc(var(--fs-arabic) - 0.125rem);
  line-height: 2;
  margin-bottom: var(--sp-3);
  color: var(--text-primary);
}

.hadith-translation {
  font-size: var(--fs-sm);
  color: var(--text-secondary);
  line-height: 1.7;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--sp-4);
  padding-top: var(--sp-3);
  border-top: 1px solid var(--border-subtle);
}

.narrator {
  display: flex;
  align-items: center;
  gap: var(--sp-1);
  font-size: var(--fs-xs);
  color: var(--text-tertiary);
}

.bookmark-btn {
  color: var(--gold-500);
}
</style>
