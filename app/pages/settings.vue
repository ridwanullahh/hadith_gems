<template>
  <div class="container content-width">
    <div class="settings-page animate-fade-in">
      <h1 class="text-heading page-title">Settings</h1>

      <!-- Appearance -->
      <section class="settings-section">
        <h2 class="section-title text-label">Appearance</h2>
        <div class="settings-group card">
          <div class="setting-item">
            <div class="setting-label">
              <span class="setting-icon">🎨</span>
              <div>
                <span class="setting-name">Theme</span>
                <span class="setting-desc">Choose light or dark mode</span>
              </div>
            </div>
            <div class="theme-toggle">
              <button
                class="toggle-btn"
                :class="{ active: currentTheme === 'light' }"
                @click="setTheme('light')"
              >☀️ Light</button>
              <button
                class="toggle-btn"
                :class="{ active: currentTheme === 'dark' }"
                @click="setTheme('dark')"
              >🌙 Dark</button>
            </div>
          </div>

          <div class="setting-divider"></div>

          <div class="setting-item">
            <div class="setting-label">
              <span class="setting-icon">🔤</span>
              <div>
                <span class="setting-name">Arabic Font Size</span>
                <span class="setting-desc">Adjust Arabic text size</span>
              </div>
            </div>
            <div class="font-controls">
              <button class="btn btn-icon btn-secondary btn-sm" @click="changeFontSize(-0.125)">A-</button>
              <span class="font-size-label">{{ arabicFontSize.toFixed(2) }}rem</span>
              <button class="btn btn-icon btn-secondary btn-sm" @click="changeFontSize(0.125)">A+</button>
            </div>
          </div>

          <div class="setting-divider"></div>

          <div class="setting-item">
            <div class="setting-label">
              <span class="setting-icon">✨</span>
              <div>
                <span class="setting-name">Arabic Font Preview</span>
              </div>
            </div>
          </div>
          <p class="text-arabic font-preview" :style="{ fontSize: arabicFontSize + 'rem' }">
            بِسْمِ اللّهِ الرَّحْمَنِ الرَّحِيم
          </p>
        </div>
      </section>

      <!-- About -->
      <section class="settings-section">
        <h2 class="section-title text-label">About</h2>
        <div class="settings-group card">
          <div class="setting-item">
            <div class="setting-label">
              <span class="setting-icon">◆</span>
              <div>
                <span class="setting-name">Hadith Gems</span>
                <span class="setting-desc">Version 1.0.0</span>
              </div>
            </div>
          </div>

          <div class="setting-divider"></div>

          <NuxtLink to="/admin/login" class="setting-item setting-link">
            <div class="setting-label">
              <span class="setting-icon">🔐</span>
              <div>
                <span class="setting-name">Admin Panel</span>
                <span class="setting-desc">Manage hadith data and sciences</span>
              </div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
          </NuxtLink>

          <div class="setting-divider"></div>

          <a href="/api/export" target="_blank" class="setting-item setting-link">
            <div class="setting-label">
              <span class="setting-icon">📤</span>
              <div>
                <span class="setting-name">Export All Data</span>
                <span class="setting-desc">Download as JSON for your projects</span>
              </div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          </a>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Settings — Hadith Gems' })

const theme = useState('theme')
const currentTheme = ref('light')
const arabicFontSize = ref(1.5)

onMounted(() => {
  currentTheme.value = theme.value as string || 'light'
  const savedSize = localStorage.getItem('hg-font-size')
  if (savedSize) arabicFontSize.value = parseFloat(savedSize)
})

function setTheme(t: string) {
  currentTheme.value = t
  theme.value = t
}

function changeFontSize(delta: number) {
  arabicFontSize.value = Math.max(1, Math.min(3, arabicFontSize.value + delta))
  if (import.meta.client) {
    localStorage.setItem('hg-font-size', String(arabicFontSize.value))
    document.documentElement.style.setProperty('--fs-arabic', `${arabicFontSize.value}rem`)
  }
}
</script>

<style scoped>
.settings-page {
  padding-top: var(--sp-4);
}
.page-title {
  font-size: var(--fs-2xl);
  margin-bottom: var(--sp-6);
}
.settings-section {
  margin-bottom: var(--sp-6);
}
.section-title {
  margin-bottom: var(--sp-3);
  padding-left: var(--sp-2);
}
.settings-group {
  padding: 0;
  overflow: hidden;
}
.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--sp-4) var(--sp-5);
  gap: var(--sp-4);
}
.setting-link {
  text-decoration: none;
  color: var(--text-primary);
  transition: background var(--transition-fast);
  cursor: pointer;
}
.setting-link:hover {
  background: var(--bg-tertiary);
}
.setting-label {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
}
.setting-icon {
  font-size: 1.3rem;
  width: 32px;
  text-align: center;
  flex-shrink: 0;
}
.setting-name {
  display: block;
  font-size: var(--fs-sm);
  font-weight: 600;
  color: var(--text-primary);
}
.setting-desc {
  display: block;
  font-size: var(--fs-xs);
  color: var(--text-tertiary);
  margin-top: 1px;
}
.setting-divider {
  height: 1px;
  background: var(--border-subtle);
  margin: 0 var(--sp-5);
}
.theme-toggle {
  display: flex;
  gap: var(--sp-1);
  background: var(--bg-tertiary);
  padding: 3px;
  border-radius: var(--radius-lg);
}
.toggle-btn {
  padding: var(--sp-2) var(--sp-3);
  border: none;
  background: transparent;
  border-radius: var(--radius-md);
  font-size: var(--fs-xs);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  color: var(--text-secondary);
  font-family: var(--font-body);
}
.toggle-btn.active {
  background: var(--bg-secondary);
  color: var(--text-primary);
  box-shadow: var(--shadow-sm);
}
.font-controls {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
}
.font-size-label {
  font-size: var(--fs-xs);
  color: var(--text-tertiary);
  min-width: 50px;
  text-align: center;
}
.font-preview {
  text-align: center;
  padding: var(--sp-4) var(--sp-5) var(--sp-5);
  color: var(--text-accent);
}
</style>
