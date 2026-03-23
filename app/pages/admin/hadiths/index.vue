<template>
  <div class="admin-hadiths">
    <div class="page-header flex-between">
      <h2 class="text-heading">Hadiths</h2>
      <button class="btn btn-primary" @click="showCreate = true">+ New Hadith</button>
    </div>

    <!-- Filters -->
    <div class="filters card" style="margin-bottom: var(--sp-4); padding: var(--sp-4);">
      <div class="filter-row">
        <select v-model="filterCollection" class="input select" @change="page = 1; fetchHadiths()">
          <option value="">All Collections</option>
          <option v-for="c in allCollections" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
        <input v-model="searchQuery" class="input" placeholder="Search hadiths..." @keyup.enter="page = 1; fetchHadiths()" />
      </div>
    </div>

    <!-- Hadiths Table -->
    <div class="table-wrap card">
      <table class="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Arabic Text</th>
            <th>English</th>
            <th>Grade</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="h in hadiths" :key="h.id">
            <td>{{ h.hadith_number || h.hadithNumber }}</td>
            <td class="ar-cell" style="max-width: 300px;">{{ truncate(h.text_ar || h.textAr, 80) }}</td>
            <td style="max-width: 300px;">{{ truncate(h.text_en || h.textEn, 80) }}</td>
            <td><span v-if="h.grade" class="grade-badge grade-sahih">{{ h.grade }}</span></td>
            <td>
              <div class="action-btns">
                <NuxtLink :to="`/admin/sciences/${h.id}`" class="btn btn-sm btn-ghost">Sciences</NuxtLink>
                <button class="btn btn-sm btn-ghost" @click="editHadith(h)">Edit</button>
                <button class="btn btn-sm btn-ghost" style="color:var(--mawdu-color);" @click="removeHadith(h.id)">Del</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="pagination">
      <button class="btn btn-sm btn-secondary" :disabled="page <= 1" @click="page--; fetchHadiths()">← Prev</button>
      <span>{{ page }} / {{ totalPages }}</span>
      <button class="btn btn-sm btn-secondary" :disabled="page >= totalPages" @click="page++; fetchHadiths()">Next →</button>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreate || editingH" class="modal-overlay" @click.self="closeModal">
      <div class="modal card animate-scale-in">
        <h3 class="text-heading modal-title">{{ editingH ? 'Edit Hadith' : 'New Hadith' }}</h3>
        <form @submit.prevent="saveHadith" class="modal-form">
          <div class="form-row">
            <div class="form-group">
              <label class="text-label">Collection</label>
              <select v-model="form.collectionId" class="input select" required>
                <option v-for="c in allCollections" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="text-label">Hadith Number</label>
              <input v-model.number="form.hadithNumber" type="number" class="input" required />
            </div>
          </div>
          <div class="form-group">
            <label class="text-label">Arabic Text</label>
            <textarea v-model="form.textAr" class="input textarea input-arabic" rows="4" required></textarea>
          </div>
          <div class="form-group">
            <label class="text-label">English Translation</label>
            <textarea v-model="form.textEn" class="input textarea" rows="4"></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="text-label">Narrator</label>
              <input v-model="form.narrator" class="input" />
            </div>
            <div class="form-group">
              <label class="text-label">Grade</label>
              <select v-model="form.grade" class="input select">
                <option value="">Select grade</option>
                <option value="Sahih">Sahih</option>
                <option value="Hasan">Hasan</option>
                <option value="Da'if">Da'if</option>
                <option value="Mawdu">Mawdu'</option>
              </select>
            </div>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
            <button type="submit" class="btn btn-primary">{{ editingH ? 'Update' : 'Create' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Hadiths — Admin — Hadith Gems' })

const { data: allCollections } = await useFetch('/api/collections')

const hadiths = ref<any[]>([])
const page = ref(1)
const totalPages = ref(1)
const filterCollection = ref('')
const searchQuery = ref('')
const showCreate = ref(false)
const editingH = ref<any>(null)

const form = reactive({
  collectionId: 0, bookId: 1, hadithNumber: 1,
  textAr: '', textEn: '', narrator: '', narratorAr: '',
  grade: '', reference: '',
})

function getToken() { return localStorage.getItem('hg-admin-token') || '' }

async function fetchHadiths() {
  const params: any = { page: page.value, limit: 20 }
  if (filterCollection.value) params.collectionId = filterCollection.value

  if (searchQuery.value) {
    const data = await $fetch('/api/hadiths/search', { query: { q: searchQuery.value, page: page.value, limit: 20 } }) as any
    hadiths.value = data.data
    totalPages.value = data.pagination.totalPages
  } else {
    const data = await $fetch('/api/hadiths', { query: params }) as any
    hadiths.value = data.data
    totalPages.value = data.pagination.totalPages
  }
}

await fetchHadiths()

function truncate(text: string, length: number) {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

function editHadith(h: any) {
  editingH.value = h
  Object.assign(form, {
    collectionId: h.collection_id || h.collectionId,
    hadithNumber: h.hadith_number || h.hadithNumber,
    textAr: h.text_ar || h.textAr || '',
    textEn: h.text_en || h.textEn || '',
    narrator: h.narrator || '',
    grade: h.grade || '',
  })
}

function closeModal() {
  showCreate.value = false
  editingH.value = null
  Object.assign(form, { collectionId: 0, hadithNumber: 1, textAr: '', textEn: '', narrator: '', grade: '' })
}

async function saveHadith() {
  const token = getToken()
  if (editingH.value) {
    await $fetch(`/api/hadiths/${editingH.value.id}`, {
      method: 'PUT', body: { ...form },
      headers: { Authorization: `Bearer ${token}` }
    })
  } else {
    await $fetch('/api/hadiths', {
      method: 'POST', body: { ...form },
      headers: { Authorization: `Bearer ${token}` }
    })
  }
  closeModal()
  fetchHadiths()
}

async function removeHadith(id: number) {
  if (!confirm('Delete this hadith?')) return
  await $fetch(`/api/hadiths/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` }
  })
  fetchHadiths()
}
</script>

<style scoped>
.page-header { margin-bottom: var(--sp-4); }
.filter-row { display: flex; gap: var(--sp-3); }
.table-wrap { overflow-x: auto; padding: 0; }
.data-table { width: 100%; border-collapse: collapse; font-size: var(--fs-sm); }
.data-table th {
  text-align: left; padding: var(--sp-3) var(--sp-4);
  font-size: var(--fs-xs); text-transform: uppercase; letter-spacing: 0.05em;
  color: var(--text-tertiary); border-bottom: 1px solid var(--border-default); white-space: nowrap;
}
.data-table td { padding: var(--sp-3) var(--sp-4); border-bottom: 1px solid var(--border-subtle); vertical-align: middle; }
.data-table tr:hover td { background: var(--bg-tertiary); }
.ar-cell { font-family: var(--font-arabic); direction: rtl; font-size: var(--fs-sm); }
.action-btns { display: flex; gap: var(--sp-1); white-space: nowrap; }
.pagination { display: flex; align-items: center; justify-content: center; gap: var(--sp-4); padding: var(--sp-4) 0; font-size: var(--fs-sm); color: var(--text-tertiary); }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: var(--sp-4); }
.modal { width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto; padding: var(--sp-6); }
.modal-title { font-size: var(--fs-lg); margin-bottom: var(--sp-5); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--sp-4); }
.form-group { margin-bottom: var(--sp-4); }
.form-group label { display: block; margin-bottom: var(--sp-2); }
.modal-actions { display: flex; justify-content: flex-end; gap: var(--sp-3); margin-top: var(--sp-4); }
@media (max-width: 640px) { .filter-row, .form-row { grid-template-columns: 1fr; flex-direction: column; } }
</style>
