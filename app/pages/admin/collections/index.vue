<template>
  <div class="admin-collections">
    <div class="page-header flex-between">
      <h2 class="text-heading">Collections</h2>
      <button class="btn btn-primary" @click="showCreate = true">+ New Collection</button>
    </div>

    <!-- Collections Table -->
    <div class="table-wrap card">
      <table class="data-table">
        <thead>
          <tr>
            <th>Icon</th>
            <th>Name</th>
            <th>Arabic</th>
            <th>Hadiths</th>
            <th>Books</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="coll in collections" :key="coll.id">
            <td class="icon-cell">{{ coll.icon }}</td>
            <td>
              <strong>{{ coll.name }}</strong>
              <br><small class="text-tertiary">{{ coll.author }}</small>
            </td>
            <td class="ar-cell">{{ coll.name_ar || coll.nameAr }}</td>
            <td>{{ coll.total_hadiths || coll.totalHadiths }}</td>
            <td>{{ coll.total_books || coll.totalBooks }}</td>
            <td>
              <div class="action-btns">
                <button class="btn btn-sm btn-ghost" @click="editCollection(coll)">Edit</button>
                <button class="btn btn-sm btn-ghost" style="color:var(--mawdu-color);" @click="deleteCollection(coll.id)">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreate || editingColl" class="modal-overlay" @click.self="closeModal">
      <div class="modal card animate-scale-in">
        <h3 class="text-heading modal-title">{{ editingColl ? 'Edit Collection' : 'New Collection' }}</h3>

        <form @submit.prevent="saveCollection" class="modal-form">
          <div class="form-row">
            <div class="form-group">
              <label class="text-label">Slug</label>
              <input v-model="form.slug" class="input" placeholder="e.g. bukhari" required />
            </div>
            <div class="form-group">
              <label class="text-label">Icon</label>
              <input v-model="form.icon" class="input" placeholder="📚" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="text-label">Name (English)</label>
              <input v-model="form.name" class="input" placeholder="Sahih al-Bukhari" required />
            </div>
            <div class="form-group">
              <label class="text-label">Name (Arabic)</label>
              <input v-model="form.nameAr" class="input input-arabic" placeholder="صحيح البخاري" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="text-label">Author (English)</label>
              <input v-model="form.author" class="input" placeholder="Imam al-Bukhari" />
            </div>
            <div class="form-group">
              <label class="text-label">Author (Arabic)</label>
              <input v-model="form.authorAr" class="input input-arabic" placeholder="الإمام البخاري" />
            </div>
          </div>
          <div class="form-group">
            <label class="text-label">Description</label>
            <textarea v-model="form.description" class="input textarea" placeholder="Collection description..." rows="3"></textarea>
          </div>
          <div class="form-group">
            <label class="text-label">Color</label>
            <input v-model="form.color" type="color" class="input" style="height: 40px; cursor:pointer;" />
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
            <button type="submit" class="btn btn-primary">{{ editingColl ? 'Update' : 'Create' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Collections — Admin — Hadith Gems' })

const { data: collections, refresh } = await useFetch('/api/collections')

const showCreate = ref(false)
const editingColl = ref<any>(null)

const form = reactive({
  slug: '', name: '', nameAr: '', author: '', authorAr: '',
  description: '', descriptionAr: '', icon: '📚', color: '#059669', sortOrder: 0,
})

function getToken() {
  return localStorage.getItem('hg-admin-token') || ''
}

function editCollection(coll: any) {
  editingColl.value = coll
  Object.assign(form, {
    slug: coll.slug, name: coll.name, nameAr: coll.name_ar || coll.nameAr || '',
    author: coll.author || '', authorAr: coll.author_ar || coll.authorAr || '',
    description: coll.description || '', icon: coll.icon || '📚', color: coll.color || '#059669',
  })
}

function closeModal() {
  showCreate.value = false
  editingColl.value = null
  Object.assign(form, { slug: '', name: '', nameAr: '', author: '', authorAr: '', description: '', icon: '📚', color: '#059669' })
}

async function saveCollection() {
  const token = getToken()
  if (editingColl.value) {
    await $fetch(`/api/collections/${editingColl.value.id}`, {
      method: 'PUT', body: { ...form },
      headers: { Authorization: `Bearer ${token}` }
    })
  } else {
    await $fetch('/api/collections', {
      method: 'POST', body: { ...form },
      headers: { Authorization: `Bearer ${token}` }
    })
  }
  closeModal()
  refresh()
}

async function deleteCollection(id: number) {
  if (!confirm('Are you sure? This will delete all books and hadiths in this collection.')) return
  const token = getToken()
  await $fetch(`/api/collections/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })
  refresh()
}
</script>

<style scoped>
.page-header {
  margin-bottom: var(--sp-4);
}
.table-wrap {
  overflow-x: auto;
  padding: 0;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--fs-sm);
}
.data-table th {
  text-align: left;
  padding: var(--sp-3) var(--sp-4);
  font-size: var(--fs-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-tertiary);
  border-bottom: 1px solid var(--border-default);
  white-space: nowrap;
}
.data-table td {
  padding: var(--sp-3) var(--sp-4);
  border-bottom: 1px solid var(--border-subtle);
  vertical-align: middle;
}
.data-table tr:hover td {
  background: var(--bg-tertiary);
}
.icon-cell { font-size: 1.5rem; }
.ar-cell { font-family: var(--font-arabic); direction: rtl; }
.text-tertiary { color: var(--text-tertiary); font-size: var(--fs-xs); }
.action-btns { display: flex; gap: var(--sp-1); }

/* Modal */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.5); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; padding: var(--sp-4);
}
.modal {
  width: 100%; max-width: 560px;
  max-height: 90vh; overflow-y: auto;
  padding: var(--sp-6);
}
.modal-title { font-size: var(--fs-lg); margin-bottom: var(--sp-5); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--sp-4); }
.form-group { margin-bottom: var(--sp-4); }
.form-group label { display: block; margin-bottom: var(--sp-2); }
.modal-actions { display: flex; justify-content: flex-end; gap: var(--sp-3); margin-top: var(--sp-4); }

@media (max-width: 640px) {
  .form-row { grid-template-columns: 1fr; }
}
</style>
