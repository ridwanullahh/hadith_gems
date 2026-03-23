<template>
  <div class="admin-import">
    <h2 class="text-heading" style="margin-bottom: var(--sp-6);">Import Data</h2>

    <div class="import-card card" style="padding: var(--sp-6);">
      <h3 class="text-heading" style="font-size: var(--fs-base); margin-bottom: var(--sp-3);">📥 Import Hadith Collection</h3>
      <p style="font-size: var(--fs-sm); color: var(--text-secondary); margin-bottom: var(--sp-5);">
        Upload a JSON file containing a hadith collection. The file should follow the Hadith Gems export format
        or a compatible structure with collections, books, and hadiths arrays.
      </p>

      <div class="upload-area" @dragover.prevent @drop.prevent="handleDrop" @click="triggerFileInput">
        <input ref="fileInput" type="file" accept=".json" @change="handleFileSelect" style="display:none;" />
        <div v-if="!file" class="upload-placeholder">
          <span style="font-size: 3rem; opacity: 0.4;">📄</span>
          <p>Drop a JSON file here or click to browse</p>
        </div>
        <div v-else class="upload-selected">
          <span style="font-size: 2rem;">📄</span>
          <div>
            <strong>{{ file.name }}</strong>
            <p style="font-size: var(--fs-xs); color: var(--text-tertiary);">{{ formatSize(file.size) }}</p>
          </div>
          <button class="btn btn-sm btn-ghost" @click.stop="file = null">Remove</button>
        </div>
      </div>

      <div v-if="file" style="margin-top: var(--sp-4);">
        <button class="btn btn-primary btn-lg" @click="importData" :disabled="importing">
          {{ importing ? 'Importing...' : 'Import Data' }}
        </button>
      </div>

      <div v-if="importResult" class="import-result card card-accent" style="margin-top: var(--sp-4); padding: var(--sp-4);">
        <p style="color: var(--sahih-color); font-weight: 600;">✅ {{ importResult }}</p>
      </div>

      <div v-if="importError" class="import-error" style="margin-top: var(--sp-4); color: var(--mawdu-color);">
        ❌ {{ importError }}
      </div>
    </div>

    <div class="format-info card" style="margin-top: var(--sp-6); padding: var(--sp-6);">
      <h4 class="text-heading" style="font-size: var(--fs-sm); margin-bottom: var(--sp-3);">Expected JSON Format</h4>
      <pre class="code-preview">{{ jsonExample }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Import — Admin — Hadith Gems' })

const fileInput = ref<HTMLInputElement>()
const file = ref<File | null>(null)
const importing = ref(false)
const importResult = ref('')
const importError = ref('')

const jsonExample = `{
  "collections": [{
    "slug": "my-collection",
    "name": "Collection Name",
    "nameAr": "اسم المجموعة",
    "author": "Author Name",
    "books": [{
      "name": "Book 1",
      "hadiths": [{
        "textAr": "Arabic text...",
        "textEn": "English translation...",
        "narrator": "Narrator name",
        "grade": "Sahih"
      }]
    }]
  }]
}`

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileSelect(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files?.[0]) file.value = input.files[0]
}

function handleDrop(e: DragEvent) {
  const f = e.dataTransfer?.files?.[0]
  if (f && f.name.endsWith('.json')) file.value = f
}

function formatSize(bytes: number) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

async function importData() {
  if (!file.value) return
  importing.value = true
  importResult.value = ''
  importError.value = ''

  try {
    const text = await file.value.text()
    const data = JSON.parse(text)

    const token = localStorage.getItem('hg-admin-token') || ''
    let imported = 0

    // Handle both formats
    const collections = data.collections || [data]

    for (const coll of collections) {
      // Create collection
      const collRes = await $fetch('/api/collections', {
        method: 'POST',
        body: {
          slug: coll.slug || coll.name.toLowerCase().replace(/\s+/g, '-'),
          name: coll.name, nameAr: coll.nameAr, author: coll.author,
          icon: coll.icon || '📚', color: coll.color || '#059669',
        },
        headers: { Authorization: `Bearer ${token}` }
      }) as any

      // Create hadiths from books
      if (coll.books) {
        for (const book of coll.books) {
          if (book.hadiths) {
            for (const h of book.hadiths) {
              await $fetch('/api/hadiths', {
                method: 'POST',
                body: {
                  collectionId: collRes.id, bookId: 1,
                  hadithNumber: h.hadithNumber || ++imported,
                  textAr: h.textAr || h.arab || h.arabic || '',
                  textEn: h.textEn || h.text || h.english || '',
                  narrator: h.narrator || '', grade: h.grade || '',
                },
                headers: { Authorization: `Bearer ${token}` }
              })
              imported++
            }
          }
        }
      }
    }

    importResult.value = `Successfully imported ${imported} hadiths!`
    file.value = null
  } catch (e: any) {
    importError.value = e.message || 'Failed to import data'
  } finally {
    importing.value = false
  }
}
</script>

<style scoped>
.upload-area {
  border: 2px dashed var(--border-default);
  border-radius: var(--radius-xl);
  padding: var(--sp-8);
  text-align: center;
  cursor: pointer;
  transition: all var(--transition-fast);
}
.upload-area:hover {
  border-color: var(--emerald-500);
  background: var(--bg-accent);
}
.upload-placeholder p {
  margin-top: var(--sp-3);
  font-size: var(--fs-sm);
  color: var(--text-tertiary);
}
.upload-selected {
  display: flex;
  align-items: center;
  gap: var(--sp-4);
  text-align: left;
}
.code-preview {
  background: var(--bg-tertiary);
  padding: var(--sp-4);
  border-radius: var(--radius-lg);
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  overflow-x: auto;
  line-height: 1.6;
  color: var(--text-secondary);
}
</style>
