# Arquitetura de Banco de Dados - Design Academy

## Visão Geral

A plataforma de cursos online utiliza um modelo relacional estruturado em torno de cinco entidades principais: **usuários**, **cursos**, **módulos**, **aulas** e **matrículas**. O sistema de autorização é baseado em papéis (roles), permitindo que cada usuário atue como aluno, instrutor ou administrador.

## Modelo de Dados

### Tabela: `users`

Armazena informações de todos os usuários da plataforma.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INT (PK) | Identificador único |
| `openId` | VARCHAR(64) | ID OAuth do Manus (único) |
| `name` | TEXT | Nome completo do usuário |
| `email` | VARCHAR(320) | E-mail único |
| `avatar` | TEXT | URL do avatar (S3) |
| `bio` | TEXT | Biografia do usuário |
| `role` | ENUM | `student`, `instructor`, `admin` |
| `createdAt` | TIMESTAMP | Data de criação |
| `updatedAt` | TIMESTAMP | Data de atualização |
| `lastSignedIn` | TIMESTAMP | Último acesso |

### Tabela: `courses`

Armazena informações sobre os cursos disponíveis na plataforma.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INT (PK) | Identificador único |
| `instructorId` | INT (FK) | Referência ao instrutor (users.id) |
| `title` | VARCHAR(255) | Título do curso |
| `description` | TEXT | Descrição completa |
| `thumbnail` | TEXT | URL da thumbnail (S3) |
| `category` | VARCHAR(100) | Categoria do curso |
| `level` | ENUM | `beginner`, `intermediate`, `advanced` |
| `price` | DECIMAL(10,2) | Preço do curso |
| `isPublished` | BOOLEAN | Status de publicação |
| `rating` | DECIMAL(3,2) | Avaliação média (0-5) |
| `totalStudents` | INT | Número total de alunos matriculados |
| `createdAt` | TIMESTAMP | Data de criação |
| `updatedAt` | TIMESTAMP | Data de atualização |

### Tabela: `modules`

Armazena módulos (unidades) dentro de cada curso.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INT (PK) | Identificador único |
| `courseId` | INT (FK) | Referência ao curso (courses.id) |
| `title` | VARCHAR(255) | Título do módulo |
| `description` | TEXT | Descrição do módulo |
| `order` | INT | Ordem de exibição |
| `createdAt` | TIMESTAMP | Data de criação |
| `updatedAt` | TIMESTAMP | Data de atualização |

### Tabela: `lessons`

Armazena aulas dentro de cada módulo.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INT (PK) | Identificador único |
| `moduleId` | INT (FK) | Referência ao módulo (modules.id) |
| `title` | VARCHAR(255) | Título da aula |
| `description` | TEXT | Descrição da aula |
| `videoUrl` | TEXT | URL do vídeo (S3) |
| `videoDuration` | INT | Duração do vídeo em segundos |
| `content` | TEXT | Conteúdo em texto (Markdown) |
| `attachments` | JSON | URLs de materiais complementares (S3) |
| `order` | INT | Ordem de exibição |
| `createdAt` | TIMESTAMP | Data de criação |
| `updatedAt` | TIMESTAMP | Data de atualização |

### Tabela: `enrollments`

Armazena matrículas de alunos em cursos.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INT (PK) | Identificador único |
| `studentId` | INT (FK) | Referência ao aluno (users.id) |
| `courseId` | INT (FK) | Referência ao curso (courses.id) |
| `progress` | DECIMAL(5,2) | Progresso em percentual (0-100) |
| `certificateIssued` | BOOLEAN | Se certificado foi emitido |
| `certificateUrl` | TEXT | URL do certificado (S3) |
| `enrolledAt` | TIMESTAMP | Data de matrícula |
| `completedAt` | TIMESTAMP | Data de conclusão |

### Tabela: `lesson_progress`

Armazena o progresso do aluno em cada aula.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INT (PK) | Identificador único |
| `enrollmentId` | INT (FK) | Referência à matrícula (enrollments.id) |
| `lessonId` | INT (FK) | Referência à aula (lessons.id) |
| `isCompleted` | BOOLEAN | Se a aula foi concluída |
| `watchedDuration` | INT | Duração assistida em segundos |
| `completedAt` | TIMESTAMP | Data de conclusão |

### Tabela: `reviews`

Armazena avaliações e comentários de alunos sobre aulas.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INT (PK) | Identificador único |
| `lessonId` | INT (FK) | Referência à aula (lessons.id) |
| `studentId` | INT (FK) | Referência ao aluno (users.id) |
| `rating` | INT | Avaliação de 1 a 5 |
| `comment` | TEXT | Comentário do aluno |
| `createdAt` | TIMESTAMP | Data de criação |
| `updatedAt` | TIMESTAMP | Data de atualização |

### Tabela: `instructor_profiles`

Armazena informações adicionais sobre instrutores.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INT (PK) | Identificador único |
| `userId` | INT (FK) | Referência ao usuário (users.id) |
| `expertise` | TEXT | Áreas de especialização |
| `totalStudents` | INT | Total de alunos que já tiveram aulas |
| `totalCourses` | INT | Total de cursos criados |
| `averageRating` | DECIMAL(3,2) | Avaliação média como instrutor |
| `createdAt` | TIMESTAMP | Data de criação |
| `updatedAt` | TIMESTAMP | Data de atualização |

## Relacionamentos

```
users (1) ──→ (N) courses (como instructor)
users (1) ──→ (N) enrollments (como student)
users (1) ──→ (N) reviews (como student)
users (1) ──→ (1) instructor_profiles

courses (1) ──→ (N) modules
courses (1) ──→ (N) enrollments

modules (1) ──→ (N) lessons

lessons (1) ──→ (N) reviews
lessons (1) ──→ (N) lesson_progress

enrollments (1) ──→ (N) lesson_progress
```

## Fluxos de Dados Principais

### Fluxo de Matrícula

1. Aluno clica em "Matricular-se" na landing do curso
2. Sistema cria registro em `enrollments` com `progress = 0`
3. E-mail de matrícula é enviado ao aluno
4. Aluno é redirecionado para o painel de cursos

### Fluxo de Progresso de Aula

1. Aluno acessa uma aula no player
2. Sistema registra `lesson_progress` com `isCompleted = false`
3. Aluno marca aula como concluída
4. Sistema atualiza `lesson_progress.isCompleted = true` e calcula progresso geral
5. E-mail de conclusão de aula é enviado (opcional)

### Fluxo de Certificado

1. Sistema detecta que `enrollments.progress = 100`
2. Certificado é gerado e salvo em S3
3. `enrollments.certificateIssued = true` e `certificateUrl` é preenchida
4. E-mail com certificado é enviado ao aluno

## Índices Recomendados

Para otimizar queries frequentes, os seguintes índices devem ser criados:

- `courses.instructorId` - para listar cursos de um instrutor
- `enrollments.studentId` - para listar cursos de um aluno
- `enrollments.courseId` - para listar alunos de um curso
- `lesson_progress.enrollmentId` - para calcular progresso
- `reviews.lessonId` - para listar comentários de uma aula
- `reviews.studentId` - para listar comentários de um aluno

## Considerações de Segurança

1. **Isolamento de Dados**: Cada aluno só pode ver seus próprios cursos e progresso
2. **Autorização por Papel**: Instrutores só podem editar seus próprios cursos
3. **Validação de Acesso**: Todas as queries devem verificar o papel do usuário
4. **Armazenamento de Mídia**: Todos os arquivos são armazenados em S3 com URLs presignadas quando necessário

## Escalabilidade

O modelo foi projetado para suportar:

- Milhares de cursos
- Centenas de milhares de alunos
- Múltiplos instrutores
- Crescimento contínuo sem necessidade de redesenho estrutural
