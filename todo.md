# DesignHub — Plataforma de Cursos de Design

## Schema & Backend
- [x] Estender schema Drizzle: tabelas courses, lessons, enrollments, subscriptions, payments, user_profiles
- [x] Gerar migração SQL e aplicar via webdev_execute_sql
- [x] Criar helpers de DB em server/db.ts para todas as entidades
- [x] Router tRPC: auth (cadastro customizado com nome/email/telefone, login, logout, me)
- [x] Router tRPC: courses (CRUD, listagem por nível, detalhes)
- [x] Router tRPC: lessons (CRUD, listagem por curso, acesso protegido)
- [x] Router tRPC: users (listagem admin, atualização de role, perfil)
- [x] Router tRPC: subscriptions (criar, cancelar, status)
- [x] Router tRPC: payments (registrar pagamento cartão crédito/débito, histórico)
- [x] Middleware adminProcedure para rotas exclusivas do professor
- [x] Middleware enrolledProcedure para verificar assinatura ativa

## Frontend — Design System
- [x] Configurar CSS global com gradientes pastéis (lavanda, rosa blush, menta pálida)
- [x] Tipografia serifada (Playfair Display) para títulos e sans-serif (Inter) para corpo
- [x] Variáveis de cor para modo claro e escuro
- [x] Componentes decorativos: colchetes finos nos cantos, linhas verticais sutis
- [x] ThemeProvider com alternância claro/escuro

## Frontend — Landing Page & Auth
- [x] Landing page com hero etéreo, gradiente pastel, tipografia elegante
- [x] Seção de features/benefícios da plataforma
- [x] Seção de cursos em destaque (preview)
- [x] Seção de planos de assinatura
- [x] Modal/página de cadastro: nome, e-mail, telefone, senha
- [x] Modal/página de login: e-mail e senha
- [x] Fluxo de recuperação de senha (UI)

## Frontend — Área do Aluno
- [x] Dashboard do aluno com cursos matriculados e progresso
- [x] Catálogo de cursos filtrado por nível (iniciante, intermediário, avançado)
- [x] Página de detalhes do curso com lista de aulas
- [x] Player de conteúdo (vídeo/texto) com controle de progresso
- [x] Página de perfil do aluno (editar nome, telefone, foto)
- [x] Página de assinatura: planos, status atual, histórico de pagamentos
- [x] Formulário de pagamento por cartão (crédito/débito)
- [x] Bloqueio de conteúdo para alunos sem assinatura ativa

## Frontend — Painel Administrativo (Professor)
- [x] Dashboard admin com métricas (total alunos, cursos, receita)
- [x] Gerenciamento de cursos (listar, criar, editar, excluir)
- [x] Gerenciamento de aulas por curso (listar, criar, editar, excluir, reordenar)
- [x] Gerenciamento de usuários (listar, alterar role, desativar)
- [x] Gerenciamento de pagamentos (listar, filtrar, exportar)
- [x] Configurações de planos de assinatura

## Testes
- [x] Testes Vitest: auth, cursos, usuários, assinaturas, dashboard (14 testes passando)

## Deploy & Exportação
- [x] Configurar vercel.json para deploy
- [x] Criar README com instruções de configuração Supabase + Vercel
- [x] Gerar arquivo ZIP do projeto para download
