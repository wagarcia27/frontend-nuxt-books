<template>
  <section class="auth-wrapper">
    <div class="auth-card">
      <ConfirmToast v-model="showToast" message="Sesión cerrada" />
      <div class="tabs">
        <button :class="{ active: tab==='login' }" @click="tab='login'">Iniciar sesión</button>
        <button :class="{ active: tab==='register' }" @click="tab='register'">Crear cuenta</button>
      </div>
      <form v-if="tab==='login'" class="form" @submit.prevent="onLogin">
        <input v-model="username" class="input" placeholder="Usuario" autocomplete="username" />
        <input v-model="password" class="input" type="password" placeholder="Contraseña" autocomplete="current-password" />
        <button class="btn" :disabled="loading">Entrar</button>
      </form>
      <form v-else class="form" @submit.prevent="onRegister">
        <input v-model="username" class="input" placeholder="Usuario" />
        <input v-model="password" class="input" type="password" placeholder="Contraseña" />
        <button class="btn" :disabled="loading">Crear cuenta</button>
      </form>
      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="info" class="info">{{ info }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
const auth = useAuthStore()
const route = useRoute()
const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const info = ref('')
const tab = ref<'login'|'register'>('login')

const onLogin = async () => {
  loading.value = true; error.value = ''
  const ok = await auth.login(username.value, password.value)
  loading.value = false
  if (ok) navigateTo('/')
  else error.value = 'Credenciales inválidas'
}

const onRegister = async () => {
  loading.value = true; error.value = ''; info.value = ''
  try {
    await auth.register(username.value, password.value)
    info.value = 'Cuenta creada correctamente. Ahora inicia sesión con tus credenciales.'
    password.value = ''
    tab.value = 'login'
  } catch (e: any) {
    error.value = e?.data?.message || 'No se pudo registrar'
  } finally { loading.value = false }
}

const showToast = ref(false)
onMounted(() => {
  if (route.query.msg === 'logout') {
    showToast.value = true
  }
})
</script>

<style scoped>
.auth-wrapper { display: grid; place-items: center; height: calc(100vh - 80px); }
.auth-card { width: min(92vw, 420px); padding: 20px; border-radius: 16px; border:1px solid rgba(255,255,255,0.1); background: linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.03)); box-shadow: 0 16px 40px rgba(0,0,0,0.35); }
.tabs { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; }
.tabs button { padding: 10px; border-radius: 10px; background:#111827; color:#cbd5e1; border:1px solid rgba(255,255,255,0.1); cursor:pointer; }
.tabs button.active { background: var(--primary); color: white; border-color: transparent; }
.form { display: grid; gap: 10px; }
.error { color: #fca5a5; margin-top: 10px; }
</style>

