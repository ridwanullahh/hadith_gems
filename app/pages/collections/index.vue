<template>
  <div class="container content-width">
    <div class="page-header animate-fade-in">
      <h1 class="text-heading page-title">Hadith Collections</h1>
      <p class="page-subtitle">Browse the major collections of Prophetic traditions</p>
    </div>

    <div v-if="collections && collections.length" class="collections-grid stagger-children">
      <CollectionCard v-for="coll in collections" :key="coll.id" :collection="coll" />
    </div>

    <div v-else class="empty-state">
      <span class="empty-state-icon">📚</span>
      <span class="empty-state-title">No Collections Found</span>
      <span class="empty-state-text">Run the seed script to populate hadith data.</span>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Hadith Collections — Hadith Gems' })

const { data: collections } = await useFetch('/api/collections')
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
.collections-grid {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}
</style>
