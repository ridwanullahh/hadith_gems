<template>
  <div class="container content-width">
    <div class="page-header animate-fade-in">
      <NuxtLink :to="`/collections/${slug}`" class="back-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>
        Back to collection
      </NuxtLink>
      <h1 class="text-heading page-title">{{ bookName }}</h1>
      <p class="page-subtitle">{{ hadithsData?.pagination?.total || 0 }} Hadiths</p>
    </div>

    <div v-if="hadithsData?.data?.length" class="hadiths-list stagger-children">
      <HadithCard
        v-for="hadith in hadithsData.data"
        :key="hadith.id"
        :hadith="hadith"
        :collection-name="slug"
        @click="navigateTo(`/hadith/${hadith.id}`)"
      />
    </div>

    <!-- Pagination -->
    <div v-if="hadithsData?.pagination?.totalPages > 1" class="pagination">
      <button
        class="btn btn-sm btn-secondary"
        :disabled="page <= 1"
        @click="page--"
      >← Previous</button>
      <span class="page-info">Page {{ page }} of {{ hadithsData.pagination.totalPages }}</span>
      <button
        class="btn btn-sm btn-secondary"
        :disabled="page >= hadithsData.pagination.totalPages"
        @click="page++"
      >Next →</button>
    </div>

    <div v-if="!hadithsData?.data?.length" class="empty-state">
      <span class="empty-state-icon">📜</span>
      <span class="empty-state-title">No Hadiths Found</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string
const bookId = route.params.bookId as string
const page = ref(1)

const { data: hadithsData, refresh } = await useFetch('/api/hadiths', {
  query: computed(() => ({
    bookId,
    page: page.value,
    limit: 20,
  }))
})

const { data: bookData } = await useFetch('/api/books', { query: { collectionId: '' } })
const bookName = computed(() => {
  // Try to find book name from hadith data
  return `Book ${bookId}`
})

watch(page, () => refresh())

useHead({
  title: computed(() => `${bookName.value} — Hadith Gems`)
})
</script>

<style scoped>
.page-header {
  padding: var(--sp-2) 0 var(--sp-6);
}
.back-link {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-1);
  font-size: var(--fs-sm);
  color: var(--text-accent);
  text-decoration: none;
  margin-bottom: var(--sp-3);
  transition: opacity var(--transition-fast);
}
.back-link:hover {
  opacity: 0.7;
}
.page-title {
  font-size: var(--fs-xl);
  margin-bottom: var(--sp-1);
}
.page-subtitle {
  color: var(--text-tertiary);
  font-size: var(--fs-sm);
}
.hadiths-list {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--sp-4);
  padding: var(--sp-6) 0;
}
.page-info {
  font-size: var(--fs-sm);
  color: var(--text-tertiary);
}
</style>
