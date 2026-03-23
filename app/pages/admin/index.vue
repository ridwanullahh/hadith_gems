<template>
  <div class="admin-dashboard">
    <h2 class="text-heading dash-title">Overview</h2>

    <div class="stats-grid stagger-children">
      <div class="stat-card card">
        <div class="stat-icon" style="background: rgba(5,150,105,0.1); color: var(--emerald-600);">📚</div>
        <div class="stat-info">
          <span class="stat-value">{{ stats?.collections || 0 }}</span>
          <span class="stat-name text-label">Collections</span>
        </div>
      </div>
      <div class="stat-card card">
        <div class="stat-icon" style="background: rgba(37,99,235,0.1); color: #2563EB;">📖</div>
        <div class="stat-info">
          <span class="stat-value">{{ stats?.books || 0 }}</span>
          <span class="stat-name text-label">Books</span>
        </div>
      </div>
      <div class="stat-card card">
        <div class="stat-icon" style="background: rgba(197,165,90,0.1); color: var(--gold-600);">📜</div>
        <div class="stat-info">
          <span class="stat-value">{{ formatNumber(stats?.hadiths || 0) }}</span>
          <span class="stat-name text-label">Hadiths</span>
        </div>
      </div>
      <div class="stat-card card">
        <div class="stat-icon" style="background: rgba(124,58,237,0.1); color: #7C3AED;">🔤</div>
        <div class="stat-info">
          <span class="stat-value">{{ formatNumber(stats?.words || 0) }}</span>
          <span class="stat-name text-label">Words</span>
        </div>
      </div>
      <div class="stat-card card">
        <div class="stat-icon" style="background: rgba(219,39,119,0.1); color: #DB2777;">📝</div>
        <div class="stat-info">
          <span class="stat-value">{{ stats?.explanations || 0 }}</span>
          <span class="stat-name text-label">Explanations</span>
        </div>
      </div>
      <div class="stat-card card">
        <div class="stat-icon" style="background: rgba(245,158,11,0.1); color: #F59E0B;">🔖</div>
        <div class="stat-info">
          <span class="stat-value">{{ stats?.bookmarks || 0 }}</span>
          <span class="stat-name text-label">Bookmarks</span>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <h3 class="text-heading" style="margin: var(--sp-6) 0 var(--sp-4);">Quick Actions</h3>
    <div class="actions-grid">
      <NuxtLink to="/admin/collections" class="action-card card">
        <span>📚</span>
        <span>Manage Collections</span>
      </NuxtLink>
      <NuxtLink to="/admin/hadiths" class="action-card card">
        <span>📜</span>
        <span>Manage Hadiths</span>
      </NuxtLink>
      <NuxtLink to="/admin/export" class="action-card card">
        <span>📤</span>
        <span>Export Data</span>
      </NuxtLink>
      <NuxtLink to="/admin/import" class="action-card card">
        <span>📥</span>
        <span>Import Data</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Admin Dashboard — Hadith Gems' })

const { data: stats } = await useFetch('/api/stats')

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return String(n)
}
</script>

<style scoped>
.dash-title {
  font-size: var(--fs-xl);
  margin-bottom: var(--sp-4);
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--sp-4);
}
.stat-card {
  display: flex;
  align-items: center;
  gap: var(--sp-4);
  padding: var(--sp-5);
}
.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}
.stat-info {
  display: flex;
  flex-direction: column;
}
.stat-value {
  font-family: var(--font-heading);
  font-size: var(--fs-2xl);
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
}
.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: var(--sp-3);
}
.action-card {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: var(--sp-4) var(--sp-5);
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 500;
  font-size: var(--fs-sm);
}
.action-card span:first-child {
  font-size: 1.5rem;
}
</style>
