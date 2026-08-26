# Fire

Landing page imersiva para o Movimento Fire, criada para apresentar a identidade da campanha e transformar a experiência de navegação em um ponto de entrada para novos participantes.

Este projeto também funciona como peça de portfólio: combina direção visual, animação, uma experiência 3D e um fluxo completo de captação com painel administrativo.

## Visão geral

- Hero em tela cheia com identidade visual e transições de entrada.
- Experiência 3D com Three.js carregada sob demanda.
- Formulário de participação com validação de nome, telefone e resposta de perfil.
- Captação segmentada por origem, incluindo campanhas de conferência.
- Painel administrativo protegido por autenticação do Supabase.
- Listagem, filtros, edição, exclusão e cadastro manual de submissões.
- API de submissões compartilhada entre o ambiente local e a implantação na Vercel.
- Layout responsivo para desktop e dispositivos móveis.

## Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- Motion
- Three.js
- Supabase Auth e Postgres
- Vercel Functions
- Oxlint

## Rotas e entradas

| Entrada | Comportamento |
| --- | --- |
| `/` | Experiência principal da landing page. |
| `/participar` | Exibe o formulário antes de liberar a experiência. |
| `/?conferencia=sobretodaacarne` | Formulário atribuído à campanha da conferência. |
| `/admin` | Login e painel de gerenciamento das submissões. |

## Requisitos

- Node.js 20 ou superior
- npm
- Um projeto configurado no Supabase

## Instalação

```bash
npm install
```

Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua-chave-publicavel
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua-chave-de-servico
```

As variáveis com prefixo `VITE_` são usadas pelo navegador. `SUPABASE_SERVICE_ROLE_KEY` é uma credencial privada e deve existir somente no ambiente do servidor ou da Vercel. Nunca a publique no frontend ou no repositório.

## Banco de dados

Execute a migration `supabase/migrations/20260826000000_create_submissions.sql` no projeto Supabase. Ela cria a tabela de submissões, índices, trigger de atualização e as regras de Row Level Security.

Depois, crie no Supabase Auth o usuário que terá acesso ao painel em `/admin`. O painel usa login por e-mail e senha e mantém a sessão automaticamente.

## Desenvolvimento

```bash
npm run dev
```

O plugin `server/vite-submissions-plugin.ts` registra localmente a rota `/api/submissions`, permitindo testar o formulário e o painel sem um servidor adicional.

## Scripts

| Comando | Finalidade |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento. |
| `npm run build` | Executa o typecheck e gera a build de produção. |
| `npm run lint` | Verifica o código com Oxlint. |
| `npm run preview` | Serve localmente a build gerada. |

## Arquitetura resumida

`src/App.tsx` controla as entradas da experiência e o carregamento sob demanda das áreas mais pesadas. O formulário usa `src/lib/submissions.ts` para enviar dados à API. Em desenvolvimento, a API é adaptada pelo plugin do Vite; na Vercel, `api/submissions.ts` é usada como função serverless.

As operações administrativas dependem da sessão autenticada no Supabase. O acesso aos dados da tabela é feito no servidor com a chave de serviço, enquanto o navegador recebe apenas os dados necessários para a interface.

## Deploy

O projeto está preparado para a Vercel:

1. Importe o repositório na Vercel.
2. Configure as variáveis de ambiente de produção listadas acima.
3. Execute a migration no Supabase antes de testar os formulários.
4. Faça o deploy usando o comando de build padrão: `npm run build`.

O arquivo `vercel.json` encaminha as rotas da aplicação para o `index.html`, preservando o funcionamento das entradas `/participar` e `/admin`.

## Estrutura principal

```text
src/
  components/       Experiência visual, formulário e seções da LP
  features/         Fluxos do painel de submissões
  lib/              Integrações e utilitários
  types/            Tipos compartilhados
api/                Função serverless de submissões
server/             Integração da API com o Vite local
supabase/           Migrations do banco de dados
```

## Créditos

Projeto desenvolvido como uma experiência de campanha para o Movimento Fire, com foco em identidade visual, performance percebida, responsividade e captação de contatos.
