# Design Courses Platform - TODO

## Fase 1: Configuração Base
- [x] Inicializar projeto com scaffold web-db-user
- [x] Criar arquivo todo.md e estrutura de pastas
- [x] Configurar variáveis de ambiente para Supabase, Stripe e Resend
- [x] Configurar tema claro/escuro com estilo tipográfico internacional
- [x] Configurar layout base com rotas e proteção de acesso

## Fase 2: Banco de Dados (Supabase)
- [x] Criar tabela de cursos (id, titulo, descricao, nivel, conteudo, preco, criado_em)
- [x] Criar tabela de alunos (id, nome, email, telefone, data_cadastro)
- [x] Criar tabela de assinaturas (id, aluno_id, curso_id, data_inicio, data_fim, status)
- [x] Criar tabela de pagamentos (id, aluno_id, valor, metodo, status, data_pagamento)
- [x] Criar tabela de conteudo_curso (id, curso_id, titulo, descricao, tipo, url_midia)
- [ ] Configurar políticas de segurança RLS (Row Level Security)
- [x] Gerar migrações SQL com Drizzle Kit

## Fase 3: Integração de Pagamento e E-mails
- [x] Configurar Stripe (chaves de API)
- [x] Configurar Resend para envio de e-mails automáticos
- [x] Criar templates de e-mail para confirmação de matrícula (aluno)
- [x] Criar templates de e-mail para notificação de novo aluno (professor)
- [x] Criar templates de e-mail para confirmação de pagamento

## Fase 4: Estrutura Base Frontend
- [x] Configurar tema claro/escuro com CSS variables (International Typographic Style)
- [x] Criar contexto de autenticação com dois níveis (professor/aluno)
- [x] Criar layout base com navegação responsiva
- [x] Criar componentes de header, footer e sidebar
- [x] Configurar rotas públicas e protegidas

## Fase 5: Painel do Professor (Admin)
- [x] Dashboard principal com estatísticas (total de alunos, receita, cursos)
- [x] Gerenciamento de cursos (CRUD)
- [x] Gerenciamento de conteúdo de cursos (adicionar/editar/deletar aulas)
- [x] Gerenciamento de alunos (visualizar, filtrar, exportar)
- [x] Gerenciamento de assinaturas e pagamentos
- [ ] Relatórios e analytics
- [ ] Configurações do professor (perfil, notificações)

## Fase 6: Área do Aluno
- [x] Página de cadastro (nome, email, telefone)
- [x] Página de login
- [x] Página de checkout com integração Stripe
- [x] Dashboard do aluno com cursos inscritos
- [x] Página de visualização de curso (conteúdo por nível)
- [ ] Página de perfil do aluno
- [ ] Histórico de pagamentos

## Fase 7: Landing Page e Autenticação
- [x] Landing page com apresentação dos cursos
- [x] Página de login (professor/aluno)
- [x] Página de registro (aluno)
- [ ] Página de recuperação de senha
- [ ] Página de termos de serviço
- [ ] Página de política de privacidade

## Fase 8: E-mails Automáticos
- [ ] Enviar e-mail de confirmação para novo aluno
- [ ] Enviar e-mail de notificação para professor (novo aluno)
- [ ] Enviar e-mail de confirmação de pagamento para aluno
- [ ] Enviar e-mail de notificação de pagamento para professor
- [ ] Implementar fila de e-mails (retry automático)

## Fase 9: Testes e Ajustes
- [ ] Testes unitários com Vitest
- [ ] Testes de integração (fluxo de cadastro, pagamento, e-mail)
- [ ] Testes de responsividade
- [ ] Otimização de performance
- [ ] Verificação de acessibilidade

## Fase 10: Deploy e Entrega
- [ ] Configurar arquivo .env.example
- [ ] Criar arquivo de instruções de deploy (DEPLOY.md)
- [ ] Configurar GitHub Actions para CI/CD
- [ ] Testar deploy em staging
- [ ] Gerar arquivo ZIP do projeto
- [ ] Criar documentação de uso
