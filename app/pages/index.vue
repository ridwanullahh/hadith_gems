<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero islamic-pattern-bg animate-fade-in">
      <div class="hero-content container">
        <div class="hero-bismillah text-bismillah">﷽</div>
        <h1 class="hero-title text-heading">Hadith Gems</h1>
        <p class="hero-subtitle">Discover the treasures of Prophetic wisdom</p>
        <div class="hero-search" @click="navigateTo('/search')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <span>Search hadiths, narrators, topics...</span>
        </div>
      </div>
    </section>

    <div class="container">
      <!-- Daily Hadith -->
      <section class="section animate-fade-in-up">
        <DailyHadith :hadith="dailyHadith" @refresh="refreshDaily" @share="shareHadith" />
      </section>

      <!-- Quick Stats -->
      <section class="stats-row stagger-children">
        <div class="stat-item card">
          <span class="stat-number">{{ formatNumber(stats?.collections || 0) }}</span>
          <span class="stat-label text-label">Collections</span>
        </div>
        <div class="stat-item card">
          <span class="stat-number">{{ formatNumber(stats?.hadiths || 0) }}</span>
          <span class="stat-label text-label">Hadiths</span>
        </div>
        <div class="stat-item card">
          <span class="stat-number">{{ formatNumber(stats?.books || 0) }}</span>
          <span class="stat-label text-label">Books</span>
        </div>
      </section>

      <!-- Collections -->
      <section class="section">
        <div class="section-header">
          <h2 class="section-title text-heading">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            Hadith Collections
          </h2>
          <NuxtLink to="/collections" class="btn btn-sm btn-ghost">View All →</NuxtLink>
        </div>
        <div class="collections-list stagger-children">
          <CollectionCard
            v-for="coll in collections"
            :key="coll.id"
            :collection="coll"
          />
        </div>
      </section>

      <!-- Features -->
      <section class="section">
        <div class="islamic-divider">❖</div>
        <div class="features-grid stagger-children">
          <div class="feature-card card">
            <span class="feature-icon">🔤</span>
            <h3 class="feature-title">Word-by-Word</h3>
            <p class="feature-desc">Explore Arabic morphology, root words, and translations for every word</p>
          </div>
          <div class="feature-card card">
            <span class="feature-icon">🌐</span>
            <h3 class="feature-title">Multi-Language</h3>
            <p class="feature-desc">Access translations and explanations in multiple languages</p>
          </div>
          <div class="feature-card card">
            <span class="feature-icon">📖</span>
            <h3 class="feature-title">Commentary</h3>
            <p class="feature-desc">Scholarly explanations and commentary for deeper understanding</p>
          </div>
          <div class="feature-card card">
            <span class="feature-icon">📤</span>
            <h3 class="feature-title">Open Data</h3>
            <p class="feature-desc">Export collections as JSON for your Islamic projects</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Hadith Gems — Treasures of Prophetic Wisdom',
  meta: [
    { name: 'description', content: 'Explore the treasures of Prophetic wisdom with word-by-word Hadith sciences, translations, morphology, and explanations.' }
  ]
})

const { data: collections } = await useFetch('/api/collections')
const { data: stats } = await useFetch('/api/stats')

const dailyHadith = ref<any>(null)

async function fetchDaily() {
  const { data } = await useFetch('/api/hadiths/random')
  dailyHadith.value = data.value
}

await fetchDaily()

function refreshDaily() {
  fetchDaily()
}

function shareHadith(hadith: any) {
  if (navigator.share) {
    navigator.share({
      title: 'Hadith Gem',
      text: `${hadith.textAr}\n\n${hadith.textEn || ''}\n\n— ${hadith.reference || ''}`,
      url: window.location.origin + '/hadith/' + hadith.id,
    })
  } else {
    navigator.clipboard?.writeText(
      `${hadith.textAr}\n\n${hadith.textEn || ''}\n\n— ${hadith.reference || ''}`
    )
  }
}

function formatNumber(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return String(n)
}
</script>

<style scoped>
.hero {
  background: linear-gradient(135deg, var(--emerald-900), var(--midnight-800));
  color: white;
  padding: var(--sp-12) 0 var(--sp-10);
  margin: calc(-1 * var(--sp-4)) calc(-1 * var(--sp-4)) var(--sp-6);
  position: relative;
  overflow: hidden;
}

.hero::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  background: linear-gradient(to bottom, transparent, var(--bg-primary));
}

.hero-content {
  text-align: center;
  position: relative;
  z-index: 1;
}

.hero-bismillah {
  font-size: 2.5rem;
  margin-bottom: var(--sp-4);
  color: var(--gold-300);
  text-shadow: 0 2px 20px rgba(197, 165, 90, 0.3);
}

.hero-title {
  font-size: var(--fs-4xl);
  background: linear-gradient(135deg, #fff, var(--gold-300));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: var(--sp-2);
}

.hero-subtitle {
  font-size: var(--fs-md);
  opacity: 0.8;
  color: var(--emerald-100);
  margin-bottom: var(--sp-8);
}

.hero-search {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  max-width: 420px;
  margin: 0 auto;
  padding: var(--sp-4) var(--sp-5);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-full);
  cursor: pointer;
  color: rgba(255, 255, 255, 0.7);
  font-size: var(--fs-sm);
  transition: all var(--transition-base);
}

.hero-search:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.25);
}

.section {
  margin-bottom: var(--sp-8);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--sp-4);
}

.section-title {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  font-size: var(--fs-lg);
  color: var(--text-primary);
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--sp-3);
  margin-bottom: var(--sp-8);
}

.stat-item {
  text-align: center;
  padding: var(--sp-4) var(--sp-3);
}

.stat-number {
  display: block;
  font-family: var(--font-heading);
  font-size: var(--fs-2xl);
  font-weight: 700;
  color: var(--text-accent);
  line-height: 1.2;
}

.stat-label {
  margin-top: var(--sp-1);
  display: block;
}

.collections-list {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--sp-4);
  margin-top: var(--sp-6);
}

.feature-card {
  text-align: center;
  padding: var(--sp-6) var(--sp-4);
}

.feature-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: var(--sp-3);
}

.feature-title {
  font-family: var(--font-heading);
  font-size: var(--fs-base);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--sp-2);
}

.feature-desc {
  font-size: var(--fs-xs);
  color: var(--text-tertiary);
  line-height: 1.5;
}

@media (min-width: 768px) {
  .features-grid {
    grid-template-columns: repeat(4, 1fr);
  }
  .hero-title {
    font-size: 3.5rem;
  }
}
</style>
