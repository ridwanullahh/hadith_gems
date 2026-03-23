<template>
  <div class="app-layout">
    <!-- Header -->
    <header class="app-header">
      <div class="header-inner">
        <NuxtLink to="/" class="header-brand">
          <span class="brand-icon">◆</span>
          <span class="brand-text">Hadith Gems</span>
        </NuxtLink>
        <div class="header-actions">
          <NuxtLink to="/search" class="btn btn-icon btn-ghost header-action" aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </NuxtLink>
          <NuxtLink to="/settings" class="btn btn-icon btn-ghost header-action" aria-label="Settings">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="app-content">
      <slot />
    </main>

    <!-- Bottom Navigation (Mobile) -->
    <BottomNav />
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;
}

.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  height: var(--header-height);
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-subtle);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 var(--sp-4);
  max-width: var(--max-page-width);
  margin: 0 auto;
}

.header-brand {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  text-decoration: none;
  color: var(--text-primary);
}

.brand-icon {
  font-size: 1.5rem;
  background: linear-gradient(135deg, var(--emerald-600), var(--gold-500));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-text {
  font-family: var(--font-heading);
  font-size: var(--fs-lg);
  font-weight: 700;
  background: linear-gradient(135deg, var(--emerald-700), var(--gold-600));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--sp-1);
}

.header-action {
  color: var(--text-secondary);
}

.app-content {
  flex: 1;
  padding-bottom: calc(var(--bottom-nav-height) + var(--sp-4));
  padding-top: var(--sp-4);
}

@media (min-width: 1024px) {
  .app-content {
    padding-bottom: var(--sp-8);
  }
}
</style>
