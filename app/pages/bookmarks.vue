<template>
  <div class="container content-width">
    <div class="page-header animate-fade-in">
      <h1 class="text-heading page-title">Saved Hadiths</h1>
      <p class="page-subtitle">Your bookmarked hadiths for easy access</p>
    </div>

    <div v-if="bookmarks?.data?.length" class="bookmarks-list stagger-children">
      <HadithCard
        v-for="hadith in bookmarks.data"
        :key="hadith.id"
        :hadith="hadith"
        :is-bookmarked="true"
        @click="navigateTo(`/hadith/${hadith.id}`)"
        @bookmark="removeBookmark(hadith.bookmarkId)"
      />
    </div>

    <div v-else class="empty-state">
      <span class="empty-state-icon">🔖</span>
      <span class="empty-state-title">No Bookmarks Yet</span>
      <span class="empty-state-text">Save hadiths you want to revisit by tapping the bookmark icon</span>
      <NuxtLink to="/collections" class="btn btn-primary" style="margin-top: var(--sp-4);">Browse Collections</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Saved — Hadith Gems' })

function getSessionId() {
  if (!import.meta.client) return ''
  let sid = localStorage.getItem('hg-session-id')
  if (!sid) {
    sid = 'sess_' + Math.random().toString(36).substring(2) + Date.now()
    localStorage.setItem('hg-session-id', sid)
  }
  return sid
}

const sessionId = import.meta.client ? getSessionId() : ''

const { data: bookmarks, refresh } = await useFetch('/api/bookmarks', {
  query: { sessionId }
})

async function removeBookmark(bookmarkId: number) {
  await $fetch(`/api/bookmarks/${bookmarkId}`, { method: 'DELETE' })
  refresh()
}
</script>

<style scoped>
.page-header {
  padding: var(--sp-4) 0 var(--sp-6);
}
.page-title {
  font-size: var(--fs-2xl);
  margin-bottom: var(--sp-1);
}
.page-subtitle {
  color: var(--text-tertiary);
  font-size: var(--fs-sm);
}
.bookmarks-list {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}
</style>
