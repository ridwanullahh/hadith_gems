<template>
  <div class="container content-width">
    <div v-if="collection" class="animate-fade-in">
      <!-- Collection Header -->
      <div class="collection-header card card-glass islamic-pattern-bg">
        <div class="coll-icon" :style="{ background: `linear-gradient(135deg, ${collection.color}33, ${collection.color}11)` }">
          {{ collection.icon || '📚' }}
        </div>
        <div class="coll-info">
          <h1 class="text-heading coll-title">{{ collection.name }}</h1>
          <p v-if="collection.name_ar || collection.nameAr" class="coll-title-ar text-arabic" style="font-size: var(--fs-lg);">{{ collection.name_ar || collection.nameAr }}</p>
          <p class="coll-author">{{ collection.author }}</p>
          <p v-if="collection.description" class="coll-desc">{{ collection.description }}</p>
          <div class="coll-stats">
            <span class="badge badge-emerald">{{ collection.total_hadiths || collection.totalHadiths }} Hadiths</span>
            <span class="badge badge-gold">{{ collection.books?.length || collection.total_books || collection.totalBooks }} Books</span>
          </div>
        </div>
      </div>

      <!-- Books List -->
      <div class="books-section">
        <h2 class="section-title text-heading">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          Books & Chapters
        </h2>
        <div class="books-list stagger-children">
          <NuxtLink
            v-for="book in collection.books"
            :key="book.id"
            :to="`/collections/${slug}/${book.id}`"
            class="book-item card"
          >
            <div class="book-number">{{ book.book_number || book.bookNumber }}</div>
            <div class="book-info">
              <h3 class="book-name">{{ book.name }}</h3>
              <p v-if="book.name_ar || book.nameAr" class="book-name-ar">{{ book.name_ar || book.nameAr }}</p>
            </div>
            <div class="book-count">
              <strong>{{ book.total_hadiths || book.totalHadiths || 0 }}</strong>
              <small>hadiths</small>
            </div>
            <svg class="book-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
          </NuxtLink>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <span class="empty-state-icon">🔍</span>
      <span class="empty-state-title">Collection Not Found</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const { data: collection } = await useFetch(`/api/collections/${slug}`)

useHead({
  title: computed(() => collection.value ? `${collection.value.name} — Hadith Gems` : 'Collection — Hadith Gems')
})
</script>

<style scoped>
.collection-header {
  display: flex;
  gap: var(--sp-5);
  padding: var(--sp-6);
  margin-bottom: var(--sp-6);
  position: relative;
}

.coll-icon {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  flex-shrink: 0;
}

.coll-info {
  flex: 1;
}

.coll-title {
  font-size: var(--fs-xl);
  margin-bottom: var(--sp-1);
}

.coll-title-ar {
  margin-bottom: var(--sp-1);
  color: var(--text-accent);
}

.coll-author {
  font-size: var(--fs-sm);
  color: var(--text-tertiary);
  margin-bottom: var(--sp-2);
}

.coll-desc {
  font-size: var(--fs-sm);
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--sp-3);
}

.coll-stats {
  display: flex;
  gap: var(--sp-2);
}

.books-section {
  margin-top: var(--sp-2);
}

.section-title {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  font-size: var(--fs-lg);
  margin-bottom: var(--sp-4);
}

.books-list {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
}

.book-item {
  display: flex;
  align-items: center;
  gap: var(--sp-4);
  padding: var(--sp-4) var(--sp-5);
  text-decoration: none;
  color: var(--text-primary);
}

.book-number {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-lg);
  background: var(--bg-accent);
  color: var(--text-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: var(--fs-sm);
  flex-shrink: 0;
}

.book-info {
  flex: 1;
  min-width: 0;
}

.book-name {
  font-size: var(--fs-sm);
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.book-name-ar {
  font-family: var(--font-arabic);
  font-size: var(--fs-sm);
  color: var(--text-secondary);
  direction: rtl;
}

.book-count {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.book-count strong {
  font-size: var(--fs-sm);
  color: var(--text-accent);
}

.book-count small {
  font-size: 10px;
  color: var(--text-tertiary);
}

.book-arrow {
  color: var(--text-tertiary);
  flex-shrink: 0;
  transition: transform var(--transition-fast);
}

.book-item:hover .book-arrow {
  transform: translateX(3px);
  color: var(--text-accent);
}

@media (max-width: 640px) {
  .collection-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .coll-stats {
    justify-content: center;
  }
}
</style>
