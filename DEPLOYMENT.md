# Guia de Deploy — DesignHub na Vercel

## Problema Encontrado

Se ao acessar seu deploy na Vercel você vê código JavaScript em vez da página HTML, isso significa que o servidor Express não está sendo executado corretamente. Isso acontece porque a Vercel está tentando servir a aplicação como um site estático.

---

## Solução: Deploy com Node.js Server

A DesignHub é uma aplicação **Node.js com servidor Express**, não um site estático. Para fazer o deploy correto:

### 1. Usar Vercel com suporte a Node.js

A Vercel detecta automaticamente aplicações Node.js quando há um `package.json` com scripts `start`. O projeto já possui:

```json
{
  "scripts": {
    "build": "vite build && esbuild server/_core/index.ts ...",
    "start": "NODE_ENV=production node dist/index.js"
  }
}
```

### 2. Configurar variáveis de ambiente na Vercel

1. Acesse seu projeto na Vercel
2. Vá em **Settings → Environment Variables**
3. Adicione as seguintes variáveis:

| Variável | Valor | Descrição |
|----------|-------|-----------|
| `DATABASE_URL` | `mysql://...` | Connection string do seu banco MySQL |
| `JWT_SECRET` | String aleatória (32+ chars) | Segredo para assinar JWTs |
| `NODE_ENV` | `production` | Ambiente de produção |

### 3. Fazer redeploy

1. Acesse seu projeto na Vercel
2. Clique em **Deployments**
3. Clique nos três pontos (...) do último deploy
4. Selecione **Redeploy**

Ou faça um novo commit no GitHub para disparar um novo deploy automático.

---

## Alternativa: Deploy em Plataformas Especializadas

Se a Vercel continuar com problemas, você pode fazer o deploy em:

### Railway.app

1. Acesse [railway.app](https://railway.app)
2. Clique em **New Project → Deploy from GitHub**
3. Selecione seu repositório
4. Configure as variáveis de ambiente (DATABASE_URL, JWT_SECRET)
5. Railway detectará automaticamente que é uma app Node.js
6. Deploy automático!

### Render.com

1. Acesse [render.com](https://render.com)
2. Clique em **New + → Web Service**
3. Conecte seu repositório GitHub
4. Configure:
   - **Build Command**: `pnpm build`
   - **Start Command**: `pnpm start`
5. Adicione as variáveis de ambiente
6. Deploy!

### PlanetScale (para o banco)

Se está usando MySQL/TiDB, o PlanetScale oferece um banco gerenciado:

1. Acesse [planetscale.com](https://planetscale.com)
2. Crie um novo banco de dados
3. Copie a connection string
4. Use em `DATABASE_URL` na sua plataforma de deploy

---

## Verificar se o Deploy está Funcionando

Após o redeploy, acesse sua URL e verifique:

- [ ] Página inicial carrega com visual etéreo (gradientes pastéis)
- [ ] Navbar aparece com logo "DesignHub"
- [ ] Botão "Ir para Minha Área" funciona
- [ ] Toggle de tema (lua/sol) funciona
- [ ] Console do navegador não mostra erros

Se ainda ver código JavaScript, verifique:

1. **Logs da Vercel**: Acesse **Deployments → Logs** e procure por erros
2. **Build output**: Confirme que `dist/index.js` foi criado
3. **Start command**: Verifique se a Vercel está executando `pnpm start`

---

## Estrutura de Build

O projeto é compilado em duas etapas:

1. **Frontend (Vite)**: Compila React em `dist/client/`
2. **Backend (esbuild)**: Compila Express em `dist/index.js`

O arquivo `dist/index.js` serve:
- A aplicação React como arquivos estáticos
- As APIs tRPC em `/api/trpc`

---

## Troubleshooting

### "Cannot find module 'dotenv'"

Certifique-se de que `pnpm install` foi executado. Adicione `--frozen-lockfile` para garantir dependências exatas:

```bash
pnpm install --frozen-lockfile
```

### "DATABASE_URL is not defined"

Verifique se a variável de ambiente foi adicionada na Vercel. Ela deve estar visível em **Settings → Environment Variables**.

### "Port is already in use"

A Vercel atribui a porta automaticamente via `process.env.PORT`. O projeto já suporta isso:

```ts
const PORT = process.env.PORT || 3000;
```

### Aplicação inicia mas retorna 502 Bad Gateway

Isso geralmente significa que o servidor está crashando. Verifique:

1. Banco de dados está acessível
2. `DATABASE_URL` está correto
3. Todas as variáveis de ambiente estão configuradas

---

## Próximos Passos

Após o deploy estar funcionando:

1. **Criar primeiro admin**: Faça um cadastro e execute no banco:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'seu@email.com';
   ```

2. **Adicionar dados de teste**: Crie cursos, planos e aulas no painel admin

3. **Configurar domínio customizado**: Na Vercel, vá em **Settings → Domains** e adicione seu domínio

---

## Suporte

Para mais informações sobre deploy na Vercel com Node.js, consulte:
- [Vercel Node.js Runtime](https://vercel.com/docs/functions/runtimes/node-js)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
