<template>
  <div id="hadith-gems-app" :data-theme="theme">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const theme = useState('theme', () => {
  if (import.meta.client) {
    return localStorage.getItem('hg-theme') || 'light'
  }
  return 'light'
})

// Watch for theme changes and persist
watch(theme, (val) => {
  if (import.meta.client) {
    localStorage.setItem('hg-theme', val)
  }
})

// Set initial font size from localStorage
onMounted(() => {
  const savedSize = localStorage.getItem('hg-font-size')
  if (savedSize) {
    document.documentElement.style.setProperty('--fs-arabic', `${savedSize}rem`)
  }
})
</script>

<style>
#hadith-gems-app {
  min-height: 100vh;
  min-height: 100dvh;
}
</style>
