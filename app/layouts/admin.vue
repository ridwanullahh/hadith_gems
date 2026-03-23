<template>
  <div class="admin-layout">
    <!-- Admin Sidebar -->
    <aside class="admin-sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-header">
        <NuxtLink to="/admin" class="sidebar-brand">
          <span class="brand-icon">◆</span>
          <span v-if="!sidebarCollapsed" class="brand-text">Hadith Gems</span>
        </NuxtLink>
        <button class="btn btn-icon btn-ghost" @click="sidebarCollapsed = !sidebarCollapsed" aria-label="Toggle sidebar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
        </button>
      </div>

      <nav class="sidebar-nav">
        <NuxtLink to="/admin" class="nav-item" :class="{ active: route.path === '/admin' }">
          <span class="nav-icon">📊</span>
          <span v-if="!sidebarCollapsed" class="nav-label">Dashboard</span>
        </NuxtLink>
        <NuxtLink to="/admin/collections" class="nav-item" :class="{ active: route.path.startsWith('/admin/collections') }">
          <span class="nav-icon">📚</span>
          <span v-if="!sidebarCollapsed" class="nav-label">Collections</span>
        </NuxtLink>
        <NuxtLink to="/admin/hadiths" class="nav-item" :class="{ active: route.path.startsWith('/admin/hadiths') }">
          <span class="nav-icon">📜</span>
          <span v-if="!sidebarCollapsed" class="nav-label">Hadiths</span>
        </NuxtLink>
        <NuxtLink to="/admin/sciences" class="nav-item" :class="{ active: route.path.startsWith('/admin/sciences') }">
          <span class="nav-icon">🔬</span>
          <span v-if="!sidebarCollapsed" class="nav-label">Sciences</span>
        </NuxtLink>
        <NuxtLink to="/admin/export" class="nav-item" :class="{ active: route.path === '/admin/export' }">
          <span class="nav-icon">📤</span>
          <span v-if="!sidebarCollapsed" class="nav-label">Export</span>
        </NuxtLink>
        <NuxtLink to="/admin/import" class="nav-item" :class="{ active: route.path === '/admin/import' }">
          <span class="nav-icon">📥</span>
          <span v-if="!sidebarCollapsed" class="nav-label">Import</span>
        </NuxtLink>

        <div class="nav-divider"></div>

        <NuxtLink to="/" class="nav-item">
          <span class="nav-icon">🌐</span>
          <span v-if="!sidebarCollapsed" class="nav-label">View Site</span>
        </NuxtLink>
        <button class="nav-item" @click="logout">
          <span class="nav-icon">🚪</span>
          <span v-if="!sidebarCollapsed" class="nav-label">Logout</span>
        </button>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="admin-main">
      <header class="admin-header">
        <button class="btn btn-icon btn-ghost mobile-menu" @click="sidebarCollapsed = !sidebarCollapsed">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
        </button>
        <h1 class="admin-page-title text-heading">{{ pageTitle }}</h1>
        <div class="admin-header-actions">
          <span class="badge badge-emerald">Admin</span>
        </div>
      </header>
      <div class="admin-content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const sidebarCollapsed = ref(false)

const pageTitle = computed(() => {
  const path = route.path
  if (path === '/admin') return 'Dashboard'
  if (path.includes('/collections')) return 'Collections'
  if (path.includes('/hadiths')) return 'Hadiths'
  if (path.includes('/sciences')) return 'Sciences'
  if (path.includes('/export')) return 'Export Data'
  if (path.includes('/import')) return 'Import Data'
  return 'Admin'
})

function logout() {
  if (import.meta.client) {
    localStorage.removeItem('hg-admin-token')
    navigateTo('/admin/login')
  }
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: var(--bg-primary);
}

.admin-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: var(--sidebar-width);
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  z-index: 200;
  transition: width var(--transition-base), transform var(--transition-base);
  overflow: hidden;
}

.admin-sidebar.collapsed {
  width: 64px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--sp-4);
  border-bottom: 1px solid var(--border-subtle);
  height: var(--header-height);
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  text-decoration: none;
  color: var(--text-primary);
  overflow: hidden;
}

.sidebar-brand .brand-icon {
  font-size: 1.3rem;
  flex-shrink: 0;
  background: linear-gradient(135deg, var(--emerald-600), var(--gold-500));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.sidebar-brand .brand-text {
  font-family: var(--font-heading);
  font-size: var(--fs-base);
  font-weight: 700;
  white-space: nowrap;
}

.sidebar-nav {
  flex: 1;
  padding: var(--sp-3);
  display: flex;
  flex-direction: column;
  gap: var(--sp-1);
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: var(--sp-3) var(--sp-3);
  border-radius: var(--radius-lg);
  text-decoration: none;
  color: var(--text-secondary);
  font-size: var(--fs-sm);
  font-weight: 500;
  transition: all var(--transition-fast);
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  font-family: var(--font-body);
  white-space: nowrap;
  overflow: hidden;
}

.nav-item:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.nav-item.active {
  background: var(--bg-accent);
  color: var(--text-accent);
  font-weight: 600;
}

.nav-icon {
  font-size: var(--fs-lg);
  flex-shrink: 0;
  width: 24px;
  text-align: center;
}

.nav-divider {
  height: 1px;
  background: var(--border-subtle);
  margin: var(--sp-2) 0;
}

.admin-main {
  flex: 1;
  margin-left: var(--sidebar-width);
  transition: margin-left var(--transition-base);
  display: flex;
  flex-direction: column;
}

.admin-sidebar.collapsed + .admin-main {
  margin-left: 64px;
}

.admin-header {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: var(--sp-4);
  padding: 0 var(--sp-6);
  height: var(--header-height);
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-subtle);
}

.admin-page-title {
  font-size: var(--fs-lg);
  flex: 1;
}

.mobile-menu {
  display: none;
}

.admin-content {
  flex: 1;
  padding: var(--sp-6);
}

@media (max-width: 1023px) {
  .admin-sidebar {
    transform: translateX(-100%);
    width: var(--sidebar-width);
  }
  .admin-sidebar:not(.collapsed) {
    transform: translateX(0);
    box-shadow: var(--shadow-xl);
  }
  .admin-sidebar.collapsed {
    width: var(--sidebar-width);
  }
  .admin-main {
    margin-left: 0 !important;
  }
  .mobile-menu {
    display: flex;
  }
  .admin-content {
    padding: var(--sp-4);
  }
}
</style>
