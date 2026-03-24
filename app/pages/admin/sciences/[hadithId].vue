<template>
  <div class="admin-sciences">
    <div class="page-header">
      <NuxtLink to="/admin/hadiths" class="btn btn-sm btn-ghost">← Back to Hadiths</NuxtLink>
      <h2 class="text-heading">Word-by-Word Sciences Editor</h2>
      <p v-if="hadith" class="subtitle">{{ hadith.reference }} — Hadith #{{ hadith.hadith_number || hadith.hadithNumber }}</p>
    </div>

    <!-- Hadith Preview -->
    <div v-if="hadith" class="hadith-preview card">
      <p class="text-arabic" style="font-size: 1.25rem;">{{ hadith.text_ar || hadith.textAr }}</p>
      <p v-if="hadith.text_en || hadith.textEn" class="translation">{{ hadith.text_en || hadith.textEn }}</p>
    </div>

    <!-- Word Editor Grid -->
    <div v-if="words.length" class="words-editor">
      <h3 class="text-heading" style="font-size: var(--fs-base); margin-bottom: var(--sp-4);">
        Edit Words ({{ words.length }} words)
      </h3>

      <div class="words-grid">
        <div v-for="(word, index) in words" :key="word.id" class="word-edit-card card">
          <div class="word-header">
            <span class="word-index">#{{ index + 1 }}</span>
            <span class="word-arabic-display">{{ word.word_ar || word.wordAr }}</span>
          </div>
          <div class="word-fields">
            <div class="field">
              <label class="text-label">Transliteration</label>
              <input v-model="word.transliteration" class="input" placeholder="e.g. bismillah" />
            </div>
            <div class="field">
              <label class="text-label">Meaning (English)</label>
              <input v-model="word.meaningEn" class="input" placeholder="e.g. In the name of" />
            </div>
            <div class="field">
              <label class="text-label">Root (Arabic)</label>
              <input v-model="word.rootAr" class="input input-arabic" placeholder="ب س م" />
            </div>
            <div class="field">
              <label class="text-label">Part of Speech</label>
              <select v-model="word.morphologyPos" class="input select">
                <option value="">Select</option>
                <option value="noun">Noun (اسم)</option>
                <option value="verb">Verb (فعل)</option>
                <option value="particle">Particle (حرف)</option>
                <option value="adjective">Adjective (صفة)</option>
                <option value="pronoun">Pronoun (ضمير)</option>
                <option value="preposition">Preposition (حرف جر)</option>
                <option value="conjunction">Conjunction (حرف عطف)</option>
                <option value="adverb">Adverb (ظرف)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="save-bar">
        <button class="btn btn-primary btn-lg" @click="saveWords" :disabled="saving">
          {{ saving ? 'Saving...' : 'Save All Changes' }}
        </button>
        <span v-if="saved" class="save-msg animate-fade-in">✅ Saved successfully!</span>
      </div>
    </div>

    <div v-else class="empty-state">
      <span class="empty-state-icon">🔤</span>
      <span class="empty-state-title">No Words Found</span>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const route = useRoute()
const hadithId = Number(route.params.hadithId)

useHead({ title: `Sciences Editor — Hadith #${hadithId}` })

const { data: hadith } = await useFetch(`/api/hadiths/${hadithId}`)
const words = ref<any[]>([])
const saving = ref(false)
const saved = ref(false)

// Fetch words and normalize snake_case to camelCase
const { data: wordsData } = await useFetch(`/api/sciences/words/${hadithId}`)
if (wordsData.value?.words) {
  words.value = wordsData.value.words.map((w: any) => ({
    ...w,
    meaningEn: w.meaningEn ?? w.meaning_en ?? '',
    rootAr: w.rootAr ?? w.root_ar ?? '',
    morphologyPos: w.morphologyPos ?? w.morphology_pos ?? '',
  }))
}

function getToken() { return localStorage.getItem('hg-admin-token') || '' }

async function saveWords() {
  saving.value = true
  saved.value = false
  try {
    await $fetch(`/api/sciences/words/${hadithId}`, {
      method: 'PUT',
      body: {
        words: words.value.map(w => ({
          id: w.id,
          transliteration: w.transliteration,
          rootAr: w.root_ar || w.rootAr,
          morphologyPos: w.morphology_pos || w.morphologyPos,
          meaningEn: w.meaning_en || w.meaningEn,
        }))
      },
      headers: { Authorization: `Bearer ${getToken()}` }
    })
    saved.value = true
    setTimeout(() => saved.value = false, 3000)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.page-header { margin-bottom: var(--sp-4); }
.subtitle { font-size: var(--fs-sm); color: var(--text-tertiary); margin-top: var(--sp-1); }
.hadith-preview {
  padding: var(--sp-5); margin-bottom: var(--sp-6);
  border-left: 3px solid var(--emerald-500);
}
.translation {
  margin-top: var(--sp-3); font-size: var(--fs-sm);
  color: var(--text-secondary); line-height: 1.7;
}
.words-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--sp-4);
}
.word-edit-card { padding: var(--sp-4); }
.word-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: var(--sp-3); padding-bottom: var(--sp-2);
  border-bottom: 1px solid var(--border-subtle);
}
.word-index { font-size: var(--fs-xs); color: var(--text-tertiary); font-weight: 600; }
.word-arabic-display {
  font-family: var(--font-arabic); font-size: var(--fs-xl);
  color: var(--text-accent); direction: rtl;
}
.field { margin-bottom: var(--sp-3); }
.field label { display: block; margin-bottom: var(--sp-1); }
.field .input { font-size: var(--fs-sm); padding: var(--sp-2) var(--sp-3); }
.save-bar {
  position: sticky; bottom: 0; z-index: 50;
  display: flex; align-items: center; gap: var(--sp-4);
  padding: var(--sp-4); margin-top: var(--sp-4);
  background: var(--bg-glass); backdrop-filter: blur(20px);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-subtle);
}
.save-msg { font-size: var(--fs-sm); color: var(--sahih-color); }
</style>
