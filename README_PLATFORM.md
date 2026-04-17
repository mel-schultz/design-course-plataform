# Design Academy - Plataforma de Cursos Online

Uma plataforma educacional robusta e escalável para cursos de Design, inspirada no Teachable, construída com Next.js, Supabase e deploy na Vercel.

## 🎯 Visão Geral

Design Academy é uma plataforma completa de e-learning que permite:

- **Alunos**: Matricular-se em cursos, assistir aulas, acompanhar progresso e obter certificados
- **Instrutores**: Criar e gerenciar cursos, módulos, aulas e acompanhar estatísticas
- **Administradores**: Gerenciar usuários, cursos, métricas e conteúdo da plataforma

## 🏗️ Arquitetura Técnica

### Stack Tecnológico

- **Frontend**: React 19 + Tailwind CSS 4 + TypeScript
- **Backend**: Express.js 4 + tRPC 11
- **Banco de Dados**: MySQL/TiDB com Drizzle ORM
- **Autenticação**: Manus OAuth
- **Armazenamento**: S3 para vídeos, imagens e PDFs
- **Deploy**: Vercel

### Estrutura do Projeto

```
design-course-platform/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── pages/            # Páginas da aplicação
│   │   ├── components/       # Componentes reutilizáveis
│   │   ├── hooks/            # Custom hooks
│   │   └── lib/              # Utilitários
│   └── public/               # Arquivos estáticos
├── server/                    # Backend Express
│   ├── routers.ts            # Definição de rotas tRPC
│   ├── db.ts                 # Queries do banco de dados
│   └── _core/                # Infraestrutura
├── drizzle/                   # Schema do banco de dados
├── shared/                    # Código compartilhado
└── storage/                   # Helpers de S3
```

## 📊 Modelo de Dados

### Tabelas Principais

1. **users**: Usuários da plataforma (alunos, instrutores, admins)
2. **courses**: Cursos criados por instrutores
3. **modules**: Módulos dentro de cada curso
4. **lessons**: Aulas dentro de cada módulo
5. **enrollments**: Matrículas de alunos em cursos
6. **lesson_progress**: Progresso do aluno em cada aula
7. **reviews**: Avaliações e comentários de alunos
8. **instructor_profiles**: Perfis estendidos de instrutores

## 🔐 Sistema de Autorização

### Papéis de Usuário

- **student**: Acesso a cursos matriculados, visualização de progresso
- **instructor**: Criação e gestão de cursos próprios
- **admin**: Acesso total à plataforma

### Rotas Protegidas

- `/student/dashboard` - Apenas alunos
- `/instructor/dashboard` - Apenas instrutores
- `/admin/dashboard` - Apenas administradores

## 🎨 Design Visual

A plataforma segue o **International Typographic Style**:

- **Paleta**: Branco pristino com acentos em vermelho (#DC2626)
- **Tipografia**: Sans-serif preta e nítida
- **Layout**: Assimétrico, grid rigoroso, linhas divisórias finas
- **Espaço**: Generoso espaço negativo para hierarquia visual

## 📄 Páginas Implementadas

### Públicas

- **Home** (`/`): Hero section, destaques de cursos, categorias, CTA
- **Catálogo** (`/courses`): Lista de cursos com filtros por categoria, nível e preço
- **Landing de Curso** (`/courses/:id`): Descrição completa, currículo, instrutor, depoimentos

### Aluno

- **Dashboard** (`/student/dashboard`): Visão de "Meus Cursos", progresso, certificados
- **Player de Aulas** (`/student/course/:courseId/lesson/:lessonId`): Vídeo, conteúdo, navegação

### Instrutor

- **Dashboard** (`/instructor/dashboard`): Criação de cursos, gestão de módulos/aulas, estatísticas

### Administrador

- **Dashboard** (`/admin/dashboard`): Gestão de usuários, cursos, métricas gerais

## 🚀 Funcionalidades Principais

### 1. Autenticação e Perfil

- ✅ Login/Cadastro via Manus OAuth
- ✅ Perfil de usuário (nome, avatar, bio)
- ✅ Controle de acesso por papel

### 2. Gestão de Cursos

- ✅ Criação e edição de cursos
- ✅ Organização em módulos e aulas
- ✅ Upload de vídeos para S3
- ✅ Suporte a materiais complementares (PDFs, imagens)
- ✅ Publicação/Despublicação

### 3. Experiência do Aluno

- ✅ Catálogo com filtros avançados
- ✅ Matrícula em cursos
- ✅ Player de vídeo com navegação
- ✅ Marcação de aulas como concluídas
- ✅ Acompanhamento de progresso
- ✅ Emissão de certificados

### 4. Sistema de Avaliações

- ✅ Avaliações por aula (1-5 estrelas)
- ✅ Comentários de alunos
- ✅ Cálculo de avaliação média do curso

### 5. E-mails Automáticos

- 📧 Matrícula em curso
- 📧 Conclusão de aula
- 📧 Certificado de conclusão

### 6. Armazenamento S3

- 📁 Vídeos de aulas
- 📁 Thumbnails de cursos
- 📁 Materiais complementares
- 📁 Certificados

## 🔧 Configuração e Deploy

### Variáveis de Ambiente

```env
DATABASE_URL=mysql://user:password@host/database
JWT_SECRET=seu_secret_jwt
VITE_APP_ID=seu_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua_api_key
```

### Deploy na Vercel

1. Conecte seu repositório GitHub à Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

## 📝 API tRPC

### Cursos

```typescript
trpc.courses.list.useQuery(filters)
trpc.courses.getById.useQuery(courseId)
trpc.courses.getByInstructor.useQuery()
trpc.courses.create.useMutation()
```

### Matrículas

```typescript
trpc.enrollments.getStudentCourses.useQuery()
trpc.enrollments.enroll.useMutation(courseId)
```

### Módulos

```typescript
trpc.modules.getByCourse.useQuery(courseId)
```

### Aulas

```typescript
trpc.lessons.getByModule.useQuery(moduleId)
trpc.lessons.getById.useQuery(lessonId)
```

## 🧪 Testes

Execute os testes com:

```bash
pnpm test
```

## 📚 Documentação Adicional

- `ARCHITECTURE.md` - Documentação detalhada do banco de dados
- `todo.md` - Rastreamento de funcionalidades e bugs

## 🤝 Contribuindo

Para contribuir com melhorias:

1. Crie uma branch para sua feature
2. Faça commit das mudanças
3. Push para a branch
4. Abra um Pull Request

## 📄 Licença

MIT

## 📞 Suporte

Para suporte, entre em contato através do formulário de feedback na plataforma.

---

**Desenvolvido com ❤️ usando Manus**
