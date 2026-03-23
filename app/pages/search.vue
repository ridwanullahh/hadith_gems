<template>
  <div class="container content-width">
    <div class="search-page animate-fade-in">
      <!-- Search Input -->
      <div class="search-input-wrap">
        <div class="search-input-container">
          <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            placeholder="Search hadiths in Arabic or English..."
            autofocus
            @keyup.enter="doSearch"
          />
          <button v-if="searchQuery" class="btn btn-icon btn-ghost btn-sm clear-btn" @click="searchQuery = ''; results = null">
            ✕
          </button>
        </div>
      </div>

      <!-- Results -->
      <div v-if="loading" class="search-loading">
        <div v-for="i in 3" :key="i" class="skeleton" style="height: 120px; margin-bottom: 12px; border-radius: 16px;"></div>
      </div>

      <div v-else-if="results?.data?.length" class="search-results">
        <p class="results-count">{{ results.pagination.total }} results found</p>
        <div class="results-list stagger-children">
          <HadithCard
            v-for="hadith in results.data"
            :key="hadith.id"
            :hadith="hadith"
            @click="navigateTo(`/hadith/${hadith.id}`)"
          />
        </div>

        <div v-if="results.pagination.totalPages > 1" class="pagination">
          <button class="btn btn-sm btn-secondary" :disabled="page <= 1" @click="page--; doSearch()">← Previous</button>
          <span class="page-info">{{ page }} / {{ results.pagination.totalPages }}</span>
          <button class="btn btn-sm btn-secondary" :disabled="page >= results.pagination.totalPages" @click="page++; doSearch()">Next →</button>
        </div>
      </div>

      <div v-else-if="searched && !results?.data?.length" class="empty-state">
        <span class="empty-state-icon">🔍</span>
        <span class="empty-state-title">No Results</span>
        <span class="empty-state-text">Try different keywords or search in Arabic</span>
      </div>

      <!-- Initial State -->
      <div v-else class="search-initial">
        <div class="search-tips">
          <h3 class="tips-title text-heading">Search Tips</h3>
          <div class="tips-grid">
            <div class="tip-item">
              <span class="tip-icon">🔤</span>
              <span class="tip-text">Search in Arabic or English</span>
            </div>
            <div class="tip-item">
              <span class="tip-icon">👤</span>
              <span class="tip-text">Search by narrator name</span>
            </div>
            <div class="tip-item">
              <span class="tip-icon">📖</span>
              <span class="tip-text">Search by reference number</span>
            </div>
            <div class="tip-item">
              <span class="tip-icon">🏷️</span>
              <span class="tip-text">Search by topic or keyword</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Search — Hadith Gems' })

const searchQuery = ref('')
const page = ref(1)
const results = ref<any>(null)
const loading = ref(false)
const searched = ref(false)

let debounceTimer: any = null

watch(searchQuery, (val) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  if (val.length >= 2) {
    debounceTimer = setTimeout(() => {
      page.value = 1
      doSearch()
    }, 400)
  } else {
    results.value = null
    searched.value = false
  }
})

async function doSearch() {
  if (!searchQuery.value.trim()) return
  loading.value = true
  searched.value = true
  try {
    const data = await $fetch('/api/hadiths/search', {
      query: { q: searchQuery.value, page: page.value, limit: 20 }
    })
    results.value = data
  } catch (e) {
    console.error('Search error:', e)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.search-page {
  padding-top: var(--sp-4);
}
.search-input-wrap {
  margin-bottom: var(--sp-6);
}
.search-input-container {
  position: relative;
  display: flex;
  align-items: center;
}
.search-icon {
  position: absolute;
  left: var(--sp-4);
  color: var(--text-tertiary);
  pointer-events: none;
}
.search-input {
  width: 100%;
  padding: var(--sp-4) var(--sp-4) var(--sp-4) calc(var(--sp-4) + 28px);
  border: 2px solid var(--border-default);
  border-radius: var(--radius-xl);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: var(--fs-base);
  outline: none;
  transition: all var(--transition-fast);
}
.search-input:focus {
  border-color: var(--emerald-500);
  box-shadow: 0 0 0 4px rgba(5, 150, 105, 0.1);
}
.clear-btn {
  position: absolute;
  right: var(--sp-2);
}
.results-count {
  font-size: var(--fs-sm);
  color: var(--text-tertiary);
  margin-bottom: var(--sp-4);
}
.results-list {
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
.search-initial {
  padding: var(--sp-8) 0;
}
.tips-title {
  font-size: var(--fs-base);
  margin-bottom: var(--sp-4);
  text-align: center;
}
.tips-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--sp-3);
}
.tip-item {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: var(--sp-4);
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-subtle);
}
.tip-icon {
  font-size: 1.3rem;
}
.tip-text {
  font-size: var(--fs-sm);
  color: var(--text-secondary);
}
</style>
