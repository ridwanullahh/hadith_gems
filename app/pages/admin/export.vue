<template>
  <div class="admin-export">
    <h2 class="text-heading" style="margin-bottom: var(--sp-6);">Export Data</h2>

    <div class="export-options">
      <div class="export-card card">
        <h3 class="text-heading" style="font-size: var(--fs-base); margin-bottom: var(--sp-3);">📤 Export All Collections</h3>
        <p style="font-size: var(--fs-sm); color: var(--text-secondary); margin-bottom: var(--sp-4);">
          Download all hadith collections, books, hadiths, word-by-word data, and explanations as a single JSON file.
        </p>
        <a href="/api/export" target="_blank" class="btn btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Download JSON
        </a>
      </div>

      <div class="export-card card">
        <h3 class="text-heading" style="font-size: var(--fs-base); margin-bottom: var(--sp-3);">📚 Export Single Collection</h3>
        <p style="font-size: var(--fs-sm); color: var(--text-secondary); margin-bottom: var(--sp-4);">
          Export a specific collection with all its data.
        </p>
        <select v-model="selectedCollection" class="input select" style="margin-bottom: var(--sp-3);">
          <option value="">Select a collection</option>
          <option v-for="c in collections" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
        <a v-if="selectedCollection" :href="`/api/export?collectionId=${selectedCollection}`" target="_blank" class="btn btn-primary">
          Download Selected
        </a>
      </div>
    </div>

    <div class="export-info card" style="margin-top: var(--sp-6);">
      <h4 class="text-heading" style="font-size: var(--fs-sm); margin-bottom: var(--sp-2);">ℹ️ About Exports</h4>
      <p style="font-size: var(--fs-xs); color: var(--text-secondary); line-height: 1.7;">
        Exported data is in standard JSON format, making it easy to use in other Islamic projects, apps, and research.
        The export includes: collections, books, hadiths (Arabic + English), word-by-word data, and explanations.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Export — Admin — Hadith Gems' })

const { data: collections } = await useFetch('/api/collections')
const selectedCollection = ref('')
</script>

<style scoped>
.export-options {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--sp-4);
}
.export-card {
  padding: var(--sp-6);
}
</style>
