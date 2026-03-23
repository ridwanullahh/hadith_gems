<template>
  <div class="container content-width">
    <div v-if="hadith" class="hadith-detail animate-fade-in">
      <!-- Navigation -->
      <div class="detail-nav">
        <button class="btn btn-sm btn-ghost" @click="navigateHadith(-1)" :disabled="!canGoPrev">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>
          Previous
        </button>
        <span class="detail-ref">{{ hadith.reference }}</span>
        <button class="btn btn-sm btn-ghost" @click="navigateHadith(1)" :disabled="!canGoNext">
          Next
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>

      <!-- Main Card -->
      <div class="detail-card card card-elevated islamic-pattern-bg">
        <div class="detail-header">
          <div class="hadith-number">{{ hadith.hadith_number || hadith.hadithNumber }}</div>
          <div class="detail-meta">
            <NuxtLink
              v-if="hadith.collection"
              :to="`/collections/${hadith.collection.slug}`"
              class="collection-link"
            >
              {{ hadith.collection.name }}
            </NuxtLink>
            <span v-if="hadith.grade" class="grade-badge" :class="gradeClass">{{ hadith.grade }}</span>
          </div>
        </div>

        <!-- Arabic Text -->
        <div class="arabic-section">
          <div class="text-bismillah" style="font-size: 1.5rem; margin-bottom: var(--sp-3);">﷽</div>
          <p class="text-arabic-lg hadith-full-arabic">{{ hadith.text_ar || hadith.textAr }}</p>
        </div>

        <div class="islamic-divider">❖</div>

        <!-- Translation -->
        <div v-if="hadith.text_en || hadith.textEn" class="translation-section">
          <h3 class="section-label text-label">Translation</h3>
          <p class="translation-text">{{ hadith.text_en || hadith.textEn }}</p>
        </div>

        <!-- Narrator -->
        <div v-if="hadith.narrator" class="narrator-section">
          <h3 class="section-label text-label">Narrator</h3>
          <p class="narrator-text">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            {{ hadith.narrator }}
          </p>
        </div>

        <!-- Actions -->
        <div class="detail-actions">
          <button class="btn btn-sm btn-secondary" @click="toggleBookmark">
            <svg width="14" height="14" viewBox="0 0 24 24" :fill="isBookmarked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            {{ isBookmarked ? 'Saved' : 'Bookmark' }}
          </button>
          <button class="btn btn-sm btn-secondary" @click="shareHadith">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            Share
          </button>
          <button class="btn btn-sm btn-secondary" @click="copyText">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            Copy
          </button>
        </div>
      </div>

      <!-- Word-by-Word Analysis -->
      <WordByWord v-if="hadith.words?.length" :words="hadith.words" />

      <!-- Explanations -->
      <ExplanationPanel :explanations="hadith.explanations || []" :show-empty="true" />
    </div>

    <div v-else class="empty-state">
      <span class="empty-state-icon">📜</span>
      <span class="empty-state-title">Hadith Not Found</span>
      <NuxtLink to="/collections" class="btn btn-primary">Browse Collections</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const hadithId = computed(() => Number(route.params.id))

const { data: hadith } = await useFetch(`/api/hadiths/${hadithId.value}`)

const isBookmarked = ref(false)
const canGoPrev = computed(() => hadithId.value > 1)
const canGoNext = ref(true)

const gradeClass = computed(() => {
  if (!hadith.value?.grade) return ''
  const g = hadith.value.grade.toLowerCase()
  if (g.includes('sahih')) return 'grade-sahih'
  if (g.includes('hasan')) return 'grade-hasan'
  return 'grade-daif'
})

function navigateHadith(delta: number) {
  navigateTo(`/hadith/${hadithId.value + delta}`)
}

function getSessionId() {
  if (!import.meta.client) return ''
  let sid = localStorage.getItem('hg-session-id')
  if (!sid) {
    sid = 'sess_' + Math.random().toString(36).substring(2) + Date.now()
    localStorage.setItem('hg-session-id', sid)
  }
  return sid
}

async function toggleBookmark() {
  if (!hadith.value) return
  const sessionId = getSessionId()
  if (isBookmarked.value) {
    isBookmarked.value = false
  } else {
    await $fetch('/api/bookmarks', {
      method: 'POST',
      body: { hadithId: hadith.value.id, sessionId }
    })
    isBookmarked.value = true
  }
}

function shareHadith() {
  if (!hadith.value) return
  const text = `${hadith.value.text_ar || hadith.value.textAr}\n\n${hadith.value.text_en || hadith.value.textEn || ''}\n\n— ${hadith.value.reference || ''}`
  if (navigator.share) {
    navigator.share({ title: 'Hadith Gem', text, url: window.location.href })
  } else {
    navigator.clipboard?.writeText(text)
  }
}

function copyText() {
  if (!hadith.value) return
  const text = `${hadith.value.text_ar || hadith.value.textAr}\n\n${hadith.value.text_en || hadith.value.textEn || ''}\n\n— ${hadith.value.reference || ''}`
  navigator.clipboard?.writeText(text)
}

useHead({
  title: computed(() => hadith.value?.reference ? `${hadith.value.reference} — Hadith Gems` : 'Hadith — Hadith Gems')
})
</script>

<style scoped>
.detail-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--sp-2) 0 var(--sp-4);
}
.detail-ref {
  font-size: var(--fs-xs);
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.detail-card {
  padding: var(--sp-6);
  position: relative;
}
.detail-header {
  display: flex;
  align-items: flex-start;
  gap: var(--sp-3);
  margin-bottom: var(--sp-6);
}
.detail-meta {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  flex: 1;
}
.collection-link {
  font-size: var(--fs-sm);
  font-weight: 600;
  color: var(--text-accent);
  text-decoration: none;
}
.collection-link:hover {
  text-decoration: underline;
}
.arabic-section {
  text-align: center;
  margin-bottom: var(--sp-4);
}
.hadith-full-arabic {
  font-size: var(--fs-arabic-lg);
  line-height: 2.4;
  text-align: center;
}
.translation-section {
  margin-bottom: var(--sp-5);
}
.section-label {
  margin-bottom: var(--sp-2);
}
.translation-text {
  font-size: var(--fs-base);
  color: var(--text-secondary);
  line-height: 1.8;
}
.narrator-section {
  margin-bottom: var(--sp-5);
}
.narrator-text {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  font-size: var(--fs-sm);
  color: var(--text-secondary);
}
.detail-actions {
  display: flex;
  gap: var(--sp-2);
  flex-wrap: wrap;
  padding-top: var(--sp-4);
  border-top: 1px solid var(--border-subtle);
}
</style>
