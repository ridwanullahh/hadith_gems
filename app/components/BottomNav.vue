<template>
  <nav class="bottom-nav no-print" aria-label="Main navigation">
    <NuxtLink to="/" class="bottom-nav-item" :class="{ active: route.path === '/' }">
      <div class="nav-icon-wrap">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      </div>
      <span class="nav-text">Home</span>
    </NuxtLink>

    <NuxtLink to="/collections" class="bottom-nav-item" :class="{ active: route.path.startsWith('/collections') }">
      <div class="nav-icon-wrap">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
      </div>
      <span class="nav-text">Collections</span>
    </NuxtLink>

    <NuxtLink to="/search" class="bottom-nav-item bottom-nav-center" :class="{ active: route.path === '/search' }">
      <div class="nav-icon-wrap center-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      </div>
      <span class="nav-text">Search</span>
    </NuxtLink>

    <NuxtLink to="/bookmarks" class="bottom-nav-item" :class="{ active: route.path === '/bookmarks' }">
      <div class="nav-icon-wrap">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
      </div>
      <span class="nav-text">Saved</span>
    </NuxtLink>

    <NuxtLink to="/settings" class="bottom-nav-item" :class="{ active: route.path === '/settings' }">
      <div class="nav-icon-wrap">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
      </div>
      <span class="nav-text">More</span>
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute()
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--bottom-nav-height);
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 100;
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.bottom-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: var(--sp-1) var(--sp-3);
  text-decoration: none;
  color: var(--text-tertiary);
  transition: all var(--transition-fast);
  border-radius: var(--radius-lg);
  min-width: 56px;
  position: relative;
}

.bottom-nav-item:active {
  transform: scale(0.92);
}

.bottom-nav-item.active {
  color: var(--text-accent);
}

.bottom-nav-item.active .nav-icon-wrap {
  background: var(--bg-accent);
  transform: scale(1);
}

.nav-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 28px;
  border-radius: var(--radius-full);
  transition: all var(--transition-base);
}

.center-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--emerald-700), var(--emerald-500));
  color: white !important;
  margin-top: -16px;
  box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
}

.center-icon svg {
  stroke: white;
}

.bottom-nav-center {
  color: var(--text-primary);
}

.bottom-nav-center.active {
  color: var(--text-primary);
}

.nav-text {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

@media (min-width: 1024px) {
  .bottom-nav {
    display: none;
  }
}
</style>
