<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="navbar">
    <div class="logo">
      <h2>MeuApp</h2>
    </div>
    
    <nav class="nav-links">
      <RouterLink to="/" class="nav-item">
        Home
      </RouterLink>
      
      <RouterLink :to="{ name: 'carteira-financeira' }" class="nav-item">
        Carteira Financeira
      </RouterLink>
    </nav>
  </header>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #1e293b;
  color: #ffffff;
}

.logo h2 {
  margin: 0;
  font-size: 1.5rem;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-item {
  color: #cbd5e1;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.nav-item:hover {
  color: #ffffff;
}

/* Estilo automático aplicado pelo Vue Router para o link da página atual */
.router-link-active {
  color: #38bdf8;
  border-bottom: 2px solid #38bdf8;
}
</style>