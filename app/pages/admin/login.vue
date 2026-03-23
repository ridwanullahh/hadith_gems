<template>
  <div class="login-page flex-center">
    <div class="login-card card animate-scale-in">
      <div class="login-header">
        <span class="login-icon">◆</span>
        <h1 class="text-heading">Admin Login</h1>
        <p class="login-subtitle">Hadith Gems Administration</p>
      </div>

      <form @submit.prevent="login" class="login-form">
        <div class="form-group">
          <label class="text-label" for="username">Username</label>
          <input v-model="username" id="username" type="text" class="input" placeholder="Enter username" required />
        </div>
        <div class="form-group">
          <label class="text-label" for="password">Password</label>
          <input v-model="password" id="password" type="password" class="input" placeholder="Enter password" required />
        </div>
        <p v-if="error" class="error-msg">{{ error }}</p>
        <button type="submit" class="btn btn-primary btn-lg login-btn" :disabled="loading">
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <NuxtLink to="/" class="back-home">← Back to Hadith Gems</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })
useHead({ title: 'Admin Login — Hadith Gems' })

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function login() {
  error.value = ''
  loading.value = true

  try {
    const data = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { username: username.value, password: password.value }
    }) as any

    if (data.success) {
      localStorage.setItem('hg-admin-token', data.token)
      navigateTo('/admin')
    }
  } catch (e: any) {
    error.value = 'Invalid username or password'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--emerald-900), var(--midnight-800));
  padding: var(--sp-4);
}
.login-card {
  width: 100%;
  max-width: 400px;
  padding: var(--sp-8);
}
.login-header {
  text-align: center;
  margin-bottom: var(--sp-8);
}
.login-icon {
  font-size: 2.5rem;
  background: linear-gradient(135deg, var(--emerald-500), var(--gold-400));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: block;
  margin-bottom: var(--sp-3);
}
.login-header h1 {
  font-size: var(--fs-xl);
  margin-bottom: var(--sp-1);
}
.login-subtitle {
  font-size: var(--fs-sm);
  color: var(--text-tertiary);
}
.form-group {
  margin-bottom: var(--sp-4);
}
.form-group label {
  display: block;
  margin-bottom: var(--sp-2);
}
.error-msg {
  color: var(--mawdu-color);
  font-size: var(--fs-sm);
  margin-bottom: var(--sp-4);
  text-align: center;
}
.login-btn {
  width: 100%;
  margin-top: var(--sp-2);
}
.back-home {
  display: block;
  text-align: center;
  margin-top: var(--sp-6);
  font-size: var(--fs-sm);
  color: var(--text-tertiary);
  text-decoration: none;
}
.back-home:hover {
  color: var(--text-accent);
}
</style>
