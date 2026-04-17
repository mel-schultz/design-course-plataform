# Design Academy - TODO

## Arquitetura e Banco de Dados
- [x] Definir esquema completo de tabelas (users, courses, modules, lessons, enrollments, etc)
- [x] Configurar Drizzle ORM com todas as relações
- [x] Criar migrações SQL

## Autenticação e Autorização
- [x] Implementar sistema de roles (student, instructor, admin)
- [x] Criar rotas protegidas por papel
- [x] Implementar middleware de autenticação
- [x] Sistema de perfil de usuário (avatar, bio, nome)

## Páginas Públicas
- [x] Página inicial (Home) com hero section e destaques
- [x] Catálogo de cursos com filtros (categoria, nível, preço)
- [x] Landing individual de curso (descrição, currículo, instrutor, depoimentos)
- [x] Página de cadastro/login (via Manus OAuth)

## Painel do Aluno
- [x] Dashboard com "Meus Cursos"
- [x] Visualização de progresso por aula
- [x] Player de aulas com navegação entre módulos
- [x] Sistema de marcação de aula como concluída
- [x] Emissão de certificado de conclusão
- [ ] Sistema de avaliações e comentários por aula (parcial)

## Painel do Instrutor
- [x] Criação e edição de cursos
- [ ] Gestão de módulos e aulas (parcial)
- [ ] Upload de vídeos para S3 (infraestrutura pronta)
- [ ] Upload de PDFs e materiais complementares (infraestrutura pronta)
- [ ] Edição de conteúdo em texto
- [x] Visualização de estatísticas dos cursos

## Painel Administrativo
- [x] Gestão de usuários (listar, editar, deletar)
- [x] Controle de cursos publicados
- [x] Métricas gerais (número de alunos, receita, cursos ativos)
- [x] Dashboard com gráficos

## Sistema de E-mails
- [ ] Configurar serviço de e-mail (SendGrid ou similar)
- [ ] E-mail de matrícula em curso
- [ ] E-mail de conclusão de aula
- [ ] E-mail de certificado de conclusão

## Armazenamento S3
- [x] Configurar integração com S3
- [x] Upload de vídeos de aulas (infraestrutura)
- [x] Upload de thumbnails de cursos (infraestrutura)
- [x] Upload de materiais complementares (infraestrutura)

## Design e Identidade Visual
- [x] Implementar estilo tipográfico internacional
- [x] Criar paleta de cores (branco, vermelho, preto)
- [x] Definir tipografia (sans-serif)
- [x] Criar componentes de UI consistentes
- [x] Implementar grid system rigoroso

## Testes e Otimizações
- [ ] Testes unitários (Vitest)
- [ ] Testes de integração
- [ ] Otimização de performance
- [ ] Verificação de acessibilidade

## Deploy e Documentação
- [x] Configurar variáveis de ambiente para Vercel
- [ ] Deploy na Vercel
- [x] Documentação da API
- [x] Documentação de uso da plataforma
