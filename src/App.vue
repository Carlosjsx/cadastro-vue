

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

const termoBusca = ref('');


interface Formulario {
  nome: string
  email: string
  telefone: string
}

interface Usuario extends Formulario {
  id: number
}

const API_URL = 'https://6a8529b09c451dc67a6351f4.mockapi.io/usuarios';

const formulario = ref<Formulario>({ nome: '', email: '', telefone: '' })
const usuarios = ref<Usuario[]>([])
const carregando = ref(false)
const erro = ref<string | null>(null)

// GET: busca os usuários ao montar o componente
async function buscarUsuarios(): Promise<void> {
  carregando.value = true
  erro.value = null

  try {
    const resposta = await fetch(API_URL)
    if (!resposta.ok) throw new Error(`Erro HTTP: ${resposta.status}`)
    usuarios.value = await resposta.json()
  } catch (e) {
    erro.value = e instanceof Error ? e.message : 'Erro ao buscar usuários'
  } finally {
    carregando.value = false
  }
}

onMounted(buscarUsuarios)

// POST: cadastra um novo usuário
async function addUser(): Promise<void> {
  if (!formulario.value.nome.trim() ||
    !formulario.value.email.trim() ||
    !formulario.value.telefone.trim()) {
    alert('Campo obrigatório!')
    return
  }

  if (formulario.value.nome.length <= 9 ||
    formulario.value.email.length <= 9 ||
    formulario.value.telefone.length < 2) {
    alert('Nome e e-mail precisam de mais de 9 caracteres')
    return
  }

  const jaCadastrado = usuarios.value.some(u => u.email === formulario.value.email)
  if (jaCadastrado) {
    alert('Usuário e-mail já cadastrado!')
    return
  }

  try {
    const resposta = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formulario.value), // o id é gerado pelo servidor
    })
    if (!resposta.ok) throw new Error(`Erro HTTP: ${resposta.status}`)

    const novoUsuario: Usuario = await resposta.json()
    usuarios.value.push(novoUsuario)
    formulario.value = { nome: '', email: '', telefone: '' } // limpa o form

    alert('Cadastrado com sucesso novo usuário!')
  } catch (e) {
    alert(e instanceof Error ? e.message : 'Erro ao cadastrar')
  }
}

// DELETE: remove um usuário
async function removeUser(id: number): Promise<void> {
  if (!confirm('Deseja excluir usuário?')) return

  try {
    const resposta = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
    if (!resposta.ok) throw new Error(`Erro HTTP: ${resposta.status}`)

    usuarios.value = usuarios.value.filter(u => u.id !== id)
  } catch (e) {
    alert(e instanceof Error ? e.message : 'Erro ao excluir')
  }
}

const filtrados = computed(()=> usuarios.value.filter(u=>u.nome.toLocaleLowerCase().includes(termoBusca.value.toLowerCase()))) 

</script>

<template>
  <h1 class="title-main">Cadastro de clientes</h1>

  <form class="form" @submit.prevent="addUser">
    <input v-model="formulario.nome" placeholder="Nome completo" />
    <input v-model="formulario.email" placeholder="E-mail" />
    <input v-model="formulario.telefone" placeholder="(88)9.9999-9999" />
    <button type="submit">Cadastrar usuário</button>
  </form>

  <div class="campo-busca">
    <input type="text" placeholder="Buscar usuário..." v-model="termoBusca"/>
  </div>

  <p v-if="carregando" class="status">Carregando...</p>
  <p v-else-if="erro" class="status">Erro: {{ erro }}</p>

  <p v-if="filtrados.length < 1" class="erro-search">Nada localizado</p>


  <ul v-else class="cards">
    <li class="card" v-for="usuario in filtrados" :key="usuario.id">
      <p>{{ usuario.nome }}</p>
      <p>{{ usuario.telefone }}</p>
      <p>{{ usuario.email }}</p>
      <div class="actions">
        <button class="btn-remove" @click="removeUser(usuario.id)">
          <img src="https://img.icons8.com/pulsar-line/48/filled-trash.png" alt="filled-trash" />
        </button>
      </div>
    </li>
  </ul>
</template>
<style>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

html {
  font-family: Arial, Helvetica, sans-serif;
}

li {
  list-style: none;
}

button {
  border-radius: 6px;
  cursor: pointer;
}

.title-main {
  font-size: 2rem;
  line-height: 100%;
  text-align: center;
  margin: 2rem .5rem 1.3rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 1rem;
  max-width: 992px;
  margin: 0 auto;
}

.form input {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 13px 5px;
}

.campo-busca input{
  padding:1rem;
  margin-left:6rem;
}

.erro-search{
  text-align: center;
  color:red;
}

.form button {
  background-color: seagreen;
  color: white;
  font-weight: bold;
  letter-spacing: 1.05px;
  border: 0;
  padding: 13px;
}


.cards {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 1rem;
  max-width: 992px;
  margin: 0 auto;
}

.card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #00000050;

  @media (max-width:568px) {
    box-shadow: 0 0 5px #00000050;
    display: flex;
    flex-direction: column;
    align-items: start;
    padding: 1rem 1.1rem 0;
  }
}

.actions {
  display: flex;
  gap: 15px;
  padding: 1rem 0;
}

.actions button {
  background-color: transparent;
  border: 0;
}

.actions img {
  width: 24px;
}
</style>
