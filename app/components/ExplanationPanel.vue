<template>
  <div class="explanation-panel" v-if="explanations.length > 0 || showEmpty">
    <button class="panel-toggle" @click="expanded = !expanded">
      <div class="toggle-left">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <span class="panel-title text-heading">Explanations & Commentary</span>
        <span class="badge badge-emerald" v-if="explanations.length">{{ explanations.length }}</span>
      </div>
      <svg class="toggle-chevron" :class="{ rotated: expanded }" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
    </button>

    <Transition name="expand">
      <div v-if="expanded" class="panel-content">
        <div v-for="exp in explanations" :key="exp.id" class="explanation-item">
          <h4 v-if="exp.title" class="exp-title">{{ exp.title }}</h4>
          <p class="exp-content">{{ exp.content }}</p>
          <span v-if="exp.source" class="exp-source">— {{ exp.source }}</span>
        </div>
        <div v-if="explanations.length === 0" class="empty-state">
          <span class="empty-state-icon">📝</span>
          <span class="empty-state-text">No explanations available yet. Admins can add commentary through the admin panel.</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  explanations: any[]
  showEmpty?: boolean
}>()

const expanded = ref(false)
</script>

<style scoped>
.explanation-panel {
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  overflow: hidden;
  margin-top: var(--sp-4);
}

.panel-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: var(--sp-4) var(--sp-5);
  background: var(--bg-secondary);
  border: none;
  cursor: pointer;
  font-family: var(--font-body);
  color: var(--text-primary);
  transition: background var(--transition-fast);
}

.panel-toggle:hover {
  background: var(--bg-tertiary);
}

.toggle-left {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
}

.panel-title {
  font-size: var(--fs-sm);
}

.toggle-chevron {
  transition: transform var(--transition-base);
  color: var(--text-tertiary);
}

.toggle-chevron.rotated {
  transform: rotate(180deg);
}

.panel-content {
  padding: var(--sp-5);
  background: var(--bg-primary);
  border-top: 1px solid var(--border-subtle);
}

.explanation-item {
  padding: var(--sp-4);
  border-left: 3px solid var(--emerald-500);
  margin-bottom: var(--sp-4);
  background: var(--bg-secondary);
  border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
}

.explanation-item:last-child {
  margin-bottom: 0;
}

.exp-title {
  font-family: var(--font-heading);
  font-size: var(--fs-base);
  font-weight: 600;
  margin-bottom: var(--sp-2);
  color: var(--text-accent);
}

.exp-content {
  font-size: var(--fs-sm);
  line-height: 1.8;
  color: var(--text-secondary);
}

.exp-source {
  display: block;
  margin-top: var(--sp-2);
  font-size: var(--fs-xs);
  color: var(--text-tertiary);
  font-style: italic;
}

.expand-enter-active, .expand-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
  overflow: hidden;
}
.expand-enter-from, .expand-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
