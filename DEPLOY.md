# Instruções de Deploy - Design Courses Platform

## Pré-requisitos

- Conta no Vercel (https://vercel.com)
- Conta no Supabase (https://supabase.com)
- Conta no Stripe (https://stripe.com)
- Conta no Resend (https://resend.com)
- Git e Node.js instalados localmente

## Passo 1: Configurar Supabase

1. Crie um novo projeto no Supabase
2. Copie a connection string do banco de dados
3. Execute as migrações SQL:
   - Acesse o SQL Editor no Supabase
   - Copie o conteúdo de `drizzle/0001_legal_satana.sql`
   - Execute no editor SQL do Supabase

## Passo 2: Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# OAuth
VITE_APP_ID=seu_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
OWNER_OPEN_ID=seu_owner_open_id
OWNER_NAME=seu_nome

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Resend
RESEND_API_KEY=re_...

# JWT
JWT_SECRET=sua_chave_secreta_aqui

# Built-in APIs
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua_chave_aqui
VITE_FRONTEND_FORGE_API_KEY=sua_chave_aqui
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
```

## Passo 3: Deploy na Vercel

### Via CLI

```bash
npm install -g vercel
vercel login
vercel
```

### Via GitHub

1. Faça push do repositório para GitHub
2. Acesse https://vercel.com/new
3. Importe o repositório GitHub
4. Configure as variáveis de ambiente no painel do Vercel
5. Clique em "Deploy"

## Passo 4: Configurar Webhook do Stripe

1. Acesse o dashboard do Stripe
2. Vá para Webhooks
3. Adicione um novo endpoint:
   - URL: `https://seu-dominio.vercel.app/api/stripe/webhook`
   - Eventos: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copie o "Signing Secret" e adicione como `STRIPE_WEBHOOK_SECRET`

## Passo 5: Testar Pagamentos

Use o cartão de teste do Stripe:
- Número: `4242 4242 4242 4242`
- Data: Qualquer data futura
- CVC: Qualquer 3 dígitos

## Passo 6: Configurar Domínio Customizado (Opcional)

1. No painel do Vercel, vá para Settings → Domains
2. Adicione seu domínio customizado
3. Configure os registros DNS conforme instruído

## Troubleshooting

### Erro de conexão com banco de dados
- Verifique se a connection string está correta
- Certifique-se de que o IP do Vercel está na whitelist do Supabase

### Erro de autenticação OAuth
- Verifique se `VITE_APP_ID` e `OAUTH_SERVER_URL` estão corretos
- Certifique-se de que o domínio do Vercel está registrado na aplicação OAuth

### Erro de pagamento
- Verifique se `STRIPE_SECRET_KEY` e `STRIPE_WEBHOOK_SECRET` estão corretos
- Teste o webhook usando o Stripe CLI

### Erro de e-mails
- Verifique se `RESEND_API_KEY` está correto
- Teste enviando um e-mail manualmente

## Recursos Úteis

- [Documentação Vercel](https://vercel.com/docs)
- [Documentação Supabase](https://supabase.com/docs)
- [Documentação Stripe](https://stripe.com/docs)
- [Documentação Resend](https://resend.com/docs)

## Suporte

Para dúvidas ou problemas, consulte a documentação oficial de cada serviço ou abra uma issue no repositório.
