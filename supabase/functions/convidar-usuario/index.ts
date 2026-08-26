import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return json({ error: 'Não autenticado.' }, 401)
    }

    // Cliente com o JWT de quem chamou — usa RLS normal, não vê nada além do que o próprio usuário vê.
    const callerClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    )

    const { data: papel } = await callerClient.rpc('meu_papel')
    if (papel !== 'pastor') {
      return json({ error: 'Apenas o pastor pode convidar novos usuários.' }, 403)
    }

    const { email, nome, role, redirectTo } = await req.json()
    if (!email || !nome) {
      return json({ error: 'Informe nome e e-mail.' }, 400)
    }

    // Cliente com a service role — só a partir daqui, e só porque já confirmamos que quem
    // chamou é pastor. Nunca exposto ao navegador.
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const { data: convite, error: erroConvite } = await adminClient.auth.admin.inviteUserByEmail(
      email,
      { data: { nome }, redirectTo },
    )
    if (erroConvite) {
      return json({ error: erroConvite.message }, 400)
    }

    if (role && role !== 'ministrador') {
      await adminClient.from('profiles').update({ role }).eq('id', convite.user.id)
    }

    return json({ id: convite.user.id })
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : 'Erro inesperado.' }, 500)
  }
})

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}
