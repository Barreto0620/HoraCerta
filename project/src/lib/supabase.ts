// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

// Carrega as variáveis de ambiente com segurança
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Verifica se as variáveis de ambiente estão definidas
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('As variáveis de ambiente do Supabase estão faltando. Verifique seu arquivo .env.local.')
}

// Cria a instância do cliente Supabase para ser usada no projeto
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Opcional: Função de teste de conexão para ser chamada em algum lugar do seu código, se necessário
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)

    if (error) {
      console.error('❌ Erro na conexão com o Supabase:', error)
      return false
    }

    console.log('✅ Conexão com Supabase funcionando!')
    return true
  } catch (err) {
    console.error('❌ Erro ao conectar ao Supabase:', err)
    return false
  }
}