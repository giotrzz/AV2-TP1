

import { createContext, useContext, useState } from 'react'
import { funcionariosIniciais, aeronavesIniciais } from '../data/dados'

const AppContext = createContext()

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

  function adicionarFuncionario(novoFuncionario) {
    setFuncionarios((lista) => [...lista, novoFuncionario])
  }

  function adicionarAeronave(novaAeronave) {
    setAeronaves((lista) => [...lista, novaAeronave])
  }

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

  function adicionarTeste(codigoAeronave, novoTeste) {
    setAeronaves((lista) =>
      lista.map((a) =>
        a.codigo === codigoAeronave
          ? { ...a, testes: [...a.testes, novoTeste] }
          : a
      )
    )
  }

  function temPermissao(...niveis) {
    if (!usuarioLogado) return false
    return niveis.includes(usuarioLogado.nivelPermissao)
  }

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

export function useApp() {
  return useContext(AppContext)
}