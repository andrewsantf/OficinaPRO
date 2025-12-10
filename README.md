# OficinaPRO

**Sistema de Gestão Inteligente para Oficinas Mecânicas**

OficinaPRO é uma plataforma SaaS completa para gestão de oficinas mecânicas, auto centers e estética automotiva. Controle clientes, veículos, ordens de serviço e finanças em um único lugar.

---

##  Funcionalidades

- **Ordens de Serviço** - Crie, gerencie e acompanhe O.S. do início ao fim
- **Gestão de Clientes** - Cadastro completo com histórico de serviços
- **Controle de Veículos** - Integração com tabela FIPE para consulta de valores
- **Financeiro** - Fluxo de caixa, despesas e lucro líquido
- **Equipe e Comissões** - Gerencie mecânicos e calcule comissões automaticamente
- **WhatsApp** - Envie orçamentos diretamente para o cliente
- **Checklist Digital** - Vistoria de entrada do veículo pelo celular
- **CRM** - Lembretes automáticos de retorno do cliente

---

## Começando

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta no [Supabase](https://supabase.com) (banco de dados)
- Conta no [Stripe](https://stripe.com) (pagamentos - opcional)

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/andrewsantf/OficinaPRO.git
cd OficinaPRO
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` com suas credenciais do Supabase e Stripe.

4. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

5. Acesse [http://localhost:3000](http://localhost:3000) no navegador.

---

## Tecnologias

- **Frontend**: Next.js 16, React 19, TypeScript
- **Estilização**: Tailwind CSS 4
- **Componentes UI**: Radix UI, Lucide Icons
- **Backend**: Supabase (PostgreSQL + Auth)
- **Pagamentos**: Stripe
- **Deploy**: Vercel

---

## Estrutura do Projeto

```
OficinaPRO/
├── app/                    # Páginas e rotas (App Router)
│   ├── (auth)/            # Páginas autenticadas
│   ├── api/               # API Routes
│   └── ...                # Páginas públicas
├── components/
│   ├── feature/           # Componentes de funcionalidades
│   ├── layout/            # Header, Footer, etc
│   └── ui/                # Componentes base (Button, Input, etc)
├── lib/                   # Utilitários e configurações
└── services/              # Integrações externas (FIPE, etc)
```

---

## Páginas Públicas

| Página | Descrição |
|--------|-----------|
| `/` | Landing page |
| `/pricing` | Planos e preços |
| `/about` | Sobre nós |
| `/contact` | Contato |
| `/blog` | Blog |
| `/terms` | Termos de uso |
| `/privacy` | Política de privacidade |
| `/lgpd` | LGPD |

---

## Ambiente de Produção

Para fazer o deploy em produção:

```bash
npm run build
npm start
```

Recomendamos o deploy na [Vercel](https://vercel.com) para melhor integração com Next.js.

---

## Contato

- **Email**: contato@oficinapro.com.br
- **WhatsApp**: (61) 98427-5639
- **Localização**: Brasília, DF - Brasil

---

## Licença

Este projeto é proprietário. Todos os direitos reservados © 2025 OficinaPro Tecnologia Ltda.
