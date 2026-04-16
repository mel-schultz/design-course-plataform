# Design Courses Platform

Uma plataforma completa de cursos de design online com autenticação em dois níveis, painel administrativo, integração de pagamento com Stripe e envio automático de e-mails.

## Características

### Autenticação e Acesso
- Autenticação OAuth com Manus
- Dois níveis de acesso: Professor (Admin) e Aluno (User)
- Proteção de rotas baseada em roles

### Para Alunos
- Cadastro com nome, email e telefone
- Visualização de cursos disponíveis (Iniciante, Intermediário, Avançado)
- Checkout seguro com integração Stripe
- Dashboard com cursos inscritos e progresso
- Visualização de conteúdo de cursos
- Histórico de pagamentos
- Alternância entre temas claro e escuro

### Para Professores (Admin)
- Dashboard com estatísticas (total de alunos, receita, cursos)
- Gerenciamento completo de cursos (criar, editar, deletar)
- Gerenciamento de conteúdo de cursos (aulas, vídeos, PDFs)
- Visualização de alunos e filtros
- Gerenciamento de assinaturas e pagamentos
- Alternância entre temas claro e escuro

### Design
- Estilo Tipográfico Internacional: layout limpo e assimétrico
- Fundo branco pristino com acentos em vermelho (#FF0000)
- Tipografia sans-serif preta e nítida
- Grid rigoroso e dinâmico
- Linhas divisórias finas em preto
- Espaço negativo generoso
- Tema claro e escuro totalmente funcional

## Tecnologias

- **Frontend**: React 19, Tailwind CSS 4, TypeScript
- **Backend**: Express 4, tRPC 11, Node.js
- **Database**: Supabase (PostgreSQL), Drizzle ORM
- **Autenticação**: Manus OAuth
- **Pagamentos**: Stripe
- **E-mails**: Resend
- **Deploy**: Vercel

## Instalação Local

### Pré-requisitos
- Node.js 18+
- npm ou pnpm

### Passos

1. Clone o repositório:
```bash
git clone <seu-repositorio>
cd design-courses-platform
```

2. Instale as dependências:
```bash
pnpm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
# Edite .env.local com suas credenciais
```

4. Execute as migrações do banco de dados:
```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

5. Inicie o servidor de desenvolvimento:
```bash
pnpm dev
```

6. Acesse a aplicação:
```
http://localhost:3000
```

## Estrutura do Projeto

```
design-courses-platform/
├── client/
│   ├── src/
│   │   ├── pages/           # Páginas da aplicação
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── contexts/        # Contextos React
│   │   ├── hooks/           # Custom hooks
│   │   ├── lib/             # Utilitários
│   │   ├── App.tsx          # Roteamento principal
│   │   └── index.css        # Estilos globais
│   └── public/              # Arquivos estáticos
├── server/
│   ├── routers/             # Rotas tRPC
│   ├── db-helpers.ts        # Helpers do banco de dados
│   ├── email.ts             # Helpers de e-mail
│   ├── routers.ts           # Router principal
│   └── _core/               # Core do servidor
├── drizzle/
│   ├── schema.ts            # Schema do banco de dados
│   └── migrations/          # Arquivos de migração
├── shared/                  # Código compartilhado
├── DEPLOY.md                # Instruções de deploy
└── README.md                # Este arquivo
```

## Fluxos Principais

### Cadastro de Aluno
1. Aluno acessa a landing page
2. Clica em "Inscreva-se"
3. Preenche formulário com nome, email e telefone
4. Faz login com OAuth
5. Acessa o dashboard

### Compra de Curso
1. Aluno visualiza cursos disponíveis
2. Seleciona um curso
3. Clica em "Inscrever-se"
4. Preenche dados de pagamento no Stripe
5. Recebe confirmação por email
6. Professor recebe notificação de novo aluno
7. Aluno ganha acesso ao conteúdo do curso

### Gerenciamento de Cursos (Professor)
1. Professor acessa o painel administrativo
2. Clica em "Novo Curso"
3. Preenche informações do curso
4. Adiciona conteúdo (aulas, vídeos, etc.)
5. Publica o curso
6. Monitora alunos e pagamentos

## Variáveis de Ambiente

Veja `.env.example` para a lista completa de variáveis necessárias.

## Testes

Execute os testes com:
```bash
pnpm test
```

## Deploy

Veja `DEPLOY.md` para instruções detalhadas de deploy na Vercel com Supabase.

## Segurança

- Senhas armazenadas com hash
- Proteção CSRF
- Validação de entrada
- Sanitização de dados
- HTTPS em produção
- Chaves de API seguras

## Contribuição

1. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
2. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
3. Push para a branch (`git push origin feature/AmazingFeature`)
4. Abra um Pull Request

## Licença

Este projeto está licenciado sob a Licença MIT.

## Suporte

Para dúvidas ou problemas, abra uma issue no repositório ou consulte a documentação oficial dos serviços utilizados.

## Roadmap

- [ ] Sistema de certificados
- [ ] Fórum de discussão entre alunos
- [ ] Gamificação (badges, pontos)
- [ ] Integração com redes sociais
- [ ] App mobile
- [ ] Análise avançada de progresso
- [ ] Recomendações personalizadas

## Changelog

### v1.0.0 (2026-04-16)
- Lançamento inicial
- Autenticação em dois níveis
- Painel administrativo completo
- Integração com Stripe
- Envio automático de e-mails
- Tema claro e escuro
- Design tipográfico internacional
