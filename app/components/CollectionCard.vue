<template>
  <NuxtLink :to="`/collections/${collection.slug}`" class="collection-card card islamic-pattern-bg">
    <div class="collection-icon" :style="{ background: `linear-gradient(135deg, ${collection.color || '#059669'}22, ${collection.color || '#059669'}11)` }">
      <span>{{ collection.icon || '📚' }}</span>
    </div>
    <div class="collection-info">
      <h3 class="collection-name">{{ collection.name }}</h3>
      <p v-if="collection.nameAr || collection.name_ar" class="collection-name-ar">{{ collection.nameAr || collection.name_ar }}</p>
      <p class="collection-author">{{ collection.author }}</p>
    </div>
    <div class="collection-stats">
      <span class="stat">
        <strong>{{ formatNumber(collection.totalHadiths || collection.total_hadiths || 0) }}</strong>
        <small>Hadiths</small>
      </span>
      <span class="stat">
        <strong>{{ collection.totalBooks || collection.total_books || 0 }}</strong>
        <small>Books</small>
      </span>
    </div>
    <div class="card-arrow">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  collection: any
}>()

function formatNumber(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return String(n)
}
</script>

<style scoped>
.collection-card {
  display: flex;
  align-items: center;
  gap: var(--sp-4);
  padding: var(--sp-4) var(--sp-5);
  text-decoration: none;
  color: var(--text-primary);
  position: relative;
}

.collection-icon {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  flex-shrink: 0;
}

.collection-info {
  flex: 1;
  min-width: 0;
}

.collection-name {
  font-family: var(--font-heading);
  font-size: var(--fs-base);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.collection-name-ar {
  font-family: var(--font-arabic);
  font-size: var(--fs-base);
  color: var(--text-accent);
  direction: rtl;
  margin-bottom: 2px;
}

.collection-author {
  font-size: var(--fs-xs);
  color: var(--text-tertiary);
}

.collection-stats {
  display: flex;
  gap: var(--sp-4);
  flex-shrink: 0;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}

.stat strong {
  font-size: var(--fs-sm);
  font-weight: 700;
  color: var(--text-accent);
}

.stat small {
  font-size: 10px;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.card-arrow {
  color: var(--text-tertiary);
  flex-shrink: 0;
  transition: transform var(--transition-fast);
}

.collection-card:hover .card-arrow {
  transform: translateX(3px);
  color: var(--text-accent);
}

@media (max-width: 640px) {
  .collection-stats {
    display: none;
  }
}
</style>
