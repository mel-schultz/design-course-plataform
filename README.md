# DesignHub — Plataforma de Cursos de Design

Uma plataforma sofisticada de cursos de design com visual etéreo em gradientes pastéis, construída com React 19 + Express + tRPC + Drizzle ORM.

---

## Funcionalidades

- **Autenticação própria** com cadastro via nome, e-mail, telefone e senha
- **Dois níveis de acesso**: Professor (admin) e Aluno
- **Painel administrativo** completo: cursos, aulas, usuários, pagamentos e planos
- **Catálogo de cursos** com filtros por nível (Iniciante, Intermediário, Avançado)
- **Sistema de assinatura** com pagamento por cartão de crédito e débito
- **Modo escuro/claro** disponível para todos os usuários
- **Design etéreo** com gradientes pastéis (lavanda, rosa blush, menta pálida)

---

## Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 19, Vite, Tailwind CSS 4, shadcn/ui |
| Backend | Express 4, tRPC 11 |
| ORM | Drizzle ORM |
| Banco de dados | MySQL (TiDB / PlanetScale / Supabase) |
| Autenticação | JWT customizado com bcryptjs |
| Tipagem | TypeScript end-to-end |

---

## Configuração Local

### 1. Instalar dependências

```bash
pnpm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL=mysql://user:password@host:port/database
JWT_SECRET=seu_segredo_jwt_aqui_minimo_32_chars
NODE_ENV=development
```

### 3. Executar migrações

```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

### 4. Iniciar o servidor de desenvolvimento

```bash
pnpm dev
```

A aplicação estará disponível em `http://localhost:3000`.

---

## Configuração com Supabase

O Supabase oferece um banco de dados PostgreSQL gerenciado. Para usar com este projeto:

### 1. Criar projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Clique em **New Project** e configure nome e senha do banco
3. Aguarde o provisionamento (cerca de 2 minutos)

### 2. Obter a connection string

1. No painel do Supabase, vá em **Settings → Database**
2. Em **Connection string**, selecione **URI**
3. Copie a string no formato:
   ```
   postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
   ```

### 3. Adaptar o Drizzle para PostgreSQL

O projeto usa MySQL por padrão. Para migrar para PostgreSQL (Supabase):

1. Instale o driver PostgreSQL:
   ```bash
   pnpm add pg drizzle-orm
   pnpm add -D @types/pg
   ```

2. Atualize `drizzle/schema.ts` — substitua os imports:
   ```ts
   // De (MySQL):
   import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean } from "drizzle-orm/mysql-core";
   
   // Para (PostgreSQL):
   import { integer, pgEnum, pgTable, text, timestamp, varchar, decimal, boolean } from "drizzle-orm/pg-core";
   ```

3. Atualize `server/db.ts`:
   ```ts
   import { drizzle } from "drizzle-orm/node-postgres";
   import { Pool } from "pg";
   
   const pool = new Pool({ connectionString: process.env.DATABASE_URL });
   export const db = drizzle(pool);
   ```

4. Atualize `drizzle.config.ts`:
   ```ts
   export default {
     dialect: "postgresql",
     schema: "./drizzle/schema.ts",
     out: "./drizzle",
     dbCredentials: { url: process.env.DATABASE_URL! },
   };
   ```

5. Regenere as migrações:
   ```bash
   pnpm drizzle-kit generate
   pnpm drizzle-kit migrate
   ```

---

## Deploy na Vercel

### 1. Preparar o repositório

```bash
git init
git add .
git commit -m "Initial commit: DesignHub platform"
git remote add origin https://github.com/seu-usuario/designhub.git
git push -u origin main
```

### 2. Importar no Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em **Add New → Project**
3. Importe o repositório do GitHub
4. Configure as variáveis de ambiente:

| Variável | Valor |
|----------|-------|
| `DATABASE_URL` | Connection string do Supabase/PlanetScale |
| `JWT_SECRET` | String aleatória segura (mínimo 32 caracteres) |
| `NODE_ENV` | `production` |

5. Clique em **Deploy**

### 3. Configurar o primeiro administrador

Após o deploy, o primeiro usuário a se cadastrar pode ser promovido a admin diretamente no banco de dados:

```sql
UPDATE users SET role = 'admin' WHERE email = 'seu@email.com';
```

No Supabase, execute este SQL em **SQL Editor**.

---

## Estrutura do Projeto

```
design-courses-platform/
├── client/
│   └── src/
│       ├── pages/
│       │   ├── Home.tsx              # Landing page
│       │   ├── AuthPage.tsx          # Login e cadastro
│       │   ├── CourseCatalog.tsx     # Catálogo de cursos
│       │   ├── CourseDetail.tsx      # Detalhes do curso
│       │   ├── LessonPlayer.tsx      # Player de aulas
│       │   ├── StudentDashboard.tsx  # Área do aluno
│       │   ├── StudentProfile.tsx    # Perfil do aluno
│       │   ├── SubscriptionPage.tsx  # Assinatura e pagamento
│       │   └── admin/
│       │       ├── AdminDashboard.tsx   # Painel admin
│       │       ├── AdminCourses.tsx     # Gerenciar cursos
│       │       ├── AdminCourseEdit.tsx  # Criar/editar curso
│       │       ├── AdminUsers.tsx       # Gerenciar usuários
│       │       ├── AdminPayments.tsx    # Histórico de pagamentos
│       │       └── AdminPlans.tsx       # Planos de assinatura
│       ├── components/
│       │   ├── Navbar.tsx            # Navegação principal
│       │   └── AdminLayout.tsx       # Layout do painel admin
│       └── index.css                 # Design system (gradientes, tipografia)
├── server/
│   ├── routers.ts                    # Todos os routers tRPC
│   └── db.ts                         # Helpers de banco de dados
├── drizzle/
│   └── schema.ts                     # Schema do banco de dados
├── vercel.json                       # Configuração de deploy
└── README.md                         # Este arquivo
```

---

## Roles e Permissões

| Funcionalidade | Aluno | Professor (Admin) |
|----------------|-------|-------------------|
| Ver catálogo de cursos | ✅ | ✅ |
| Acessar aulas (com assinatura) | ✅ | ✅ |
| Gerenciar perfil | ✅ | ✅ |
| Assinar plano | ✅ | ✅ |
| Criar/editar cursos | ❌ | ✅ |
| Gerenciar usuários | ❌ | ✅ |
| Ver todos os pagamentos | ❌ | ✅ |
| Configurar planos | ❌ | ✅ |
| Ver métricas do painel | ❌ | ✅ |

---

## Notas Importantes

- **Pagamentos**: O sistema de pagamento é uma simulação. Para produção, integre com [Stripe](https://stripe.com/br), [PagSeguro](https://pagseguro.uol.com.br) ou [Mercado Pago](https://www.mercadopago.com.br).
- **Senhas**: São armazenadas com hash bcrypt (salt rounds: 12).
- **JWT**: Os tokens de sessão são armazenados em cookies HttpOnly seguros.
- **Modo escuro**: Persiste no `localStorage` do navegador.

---

## Licença

MIT © DesignHub
