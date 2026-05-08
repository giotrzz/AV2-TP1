// ─────────────────────────────────────────────
//  AppContext.jsx
//
//  Aqui guardamos o "estado global" da aplicação:
//  quem está logado, quais aeronaves existem, etc.
//
//  Usamos a Context API do React para que qualquer
//  componente possa ler e alterar esses dados sem
//  ficar passando props por vários níveis.
// ─────────────────────────────────────────────

import { createContext, useContext, useState } from 'react'
import { funcionariosIniciais, aeronavesIniciais } from '../data/dados'

// 1. Cria o "contexto" (uma espécie de variável global)
const AppContext = createContext()

// 2. Provider: envolve a aplicação e disponibiliza os dados
export function AppProvider({ children }) {
  const [usuarioLogado, setUsuarioLogado] = useState(null)
  const [funcionarios, setFuncionarios] = useState(funcionariosIniciais)
  const [aeronaves, setAeronaves] = useState(aeronavesIniciais)

  // ── Autenticação ──────────────────────────────
  function login(usuario, senha) {
    const encontrado = funcionarios.find(
      (f) => f.usuario === usuario && f.senhaHash === senha
    )
    if (encontrado) {
      setUsuarioLogado(encontrado)
      return true
    }
    return false
  }

  function logout() {
    setUsuarioLogado(null)
  }

  // ── Funcionários ──────────────────────────────
  function adicionarFuncionario(novoFuncionario) {
    setFuncionarios((lista) => [...lista, novoFuncionario])
  }

  // ── Aeronaves ─────────────────────────────────
  function adicionarAeronave(novaAeronave) {
    setAeronaves((lista) => [...lista, novaAeronave])
  }

  // ── Peças ─────────────────────────────────────
  function adicionarPeca(codigoAeronave, novaPeca) {
    setAeronaves((lista) =>
      lista.map((a) =>
        a.codigo === codigoAeronave
          ? { ...a, pecas: [...a.pecas, novaPeca] }
          : a
      )
    )
  }

  function atualizarStatusPeca(codigoAeronave, pecaId, novoStatus) {
    setAeronaves((lista) =>
      lista.map((a) =>
        a.codigo === codigoAeronave
          ? {
              ...a,
              pecas: a.pecas.map((p) =>
                p.id === pecaId ? { ...p, status: novoStatus } : p
              ),
            }
          : a
      )
    )
  }

  // ── Etapas ────────────────────────────────────
  function adicionarEtapa(codigoAeronave, novaEtapa) {
    setAeronaves((lista) =>
      lista.map((a) =>
        a.codigo === codigoAeronave
          ? { ...a, etapas: [...a.etapas, novaEtapa] }
          : a
      )
    )
  }

  function atualizarStatusEtapa(codigoAeronave, etapaId, novoStatus) {
    setAeronaves((lista) =>
      lista.map((a) =>
        a.codigo === codigoAeronave
          ? {
              ...a,
              etapas: a.etapas.map((e) =>
                e.id === etapaId ? { ...e, status: novoStatus } : e
              ),
            }
          : a
      )
    )
  }

  function associarFuncionarioEtapa(codigoAeronave, etapaId, funcionarioId) {
    setAeronaves((lista) =>
      lista.map((a) =>
        a.codigo === codigoAeronave
          ? {
              ...a,
              etapas: a.etapas.map((e) => {
                if (e.id !== etapaId) return e
                if (e.funcionariosIds.includes(funcionarioId)) return e
                return { ...e, funcionariosIds: [...e.funcionariosIds, funcionarioId] }
              }),
            }
          : a
      )
    )
  }

  // ── Testes ────────────────────────────────────
  function adicionarTeste(codigoAeronave, novoTeste) {
    setAeronaves((lista) =>
      lista.map((a) =>
        a.codigo === codigoAeronave
          ? { ...a, testes: [...a.testes, novoTeste] }
          : a
      )
    )
  }

  // ── Helper: verificar permissão ───────────────
  function temPermissao(...niveis) {
    if (!usuarioLogado) return false
    return niveis.includes(usuarioLogado.nivelPermissao)
  }

  // Tudo que fica disponível para os componentes
  return (
    <AppContext.Provider
      value={{
        usuarioLogado,
        funcionarios,
        aeronaves,
        login,
        logout,
        temPermissao,
        adicionarFuncionario,
        adicionarAeronave,
        adicionarPeca,
        atualizarStatusPeca,
        adicionarEtapa,
        atualizarStatusEtapa,
        associarFuncionarioEtapa,
        adicionarTeste,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

// 3. Hook personalizado — facilita o uso nos componentes
//    Em vez de: const ctx = useContext(AppContext)
//    Basta:     const { login, aeronaves } = useApp()
export function useApp() {
  return useContext(AppContext)
}