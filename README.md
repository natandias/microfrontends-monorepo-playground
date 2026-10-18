# 🧩 Microfrontends & Monorepo Playground

Este repositório é um laboratório prático de arquitetura frontend moderna, explorando a integração de **Microfrontends**, **Monorepo com pnpm**, **Module Federation (Vite)** e **Web Components (Stencil)** com **React 19**.

---

## 🏗️ Arquitetura e Estrutura do Projeto

O monorepo é organizado em aplicações independentes e pacotes compartilhados:

```text
microfront-module-federation/
├── applications/
│   ├── orchestrator/          # Host / Shell Microfrontend (Vite + React 19) -> Porta 5173
│   └── people-listing/        # Remote Microfrontend (Vite + React 19)       -> Porta 5000
├── packages/
│   └── ui/                    # Design System / Pacote de Componentes (@repo/ui)
│       ├── src/
│       │   ├── Button.tsx     # Componente React com useState
│       │   ├── components/    # Componentes Stencil (Web Components)
│       │   │   └── app-header/# <app-header> com Shadow DOM
│       │   └── index.ts       # Entrypoint com registro automático e tipagens
│       ├── stencil.config.ts  # Configuração de compilação do Stencil
│       └── package.json       # peerDependencies (React) e devDependencies (Stencil)
├── pnpm-workspace.yaml        # Configuração do Workspace e Catálogo de Versões
└── package.json               # Scripts raiz para execução paralela e builds
```

---

## 🛠️ Tecnologias e Conceitos Explorados

### 1. pnpm Workspaces e o Protocolo `catalog:`

Gerenciar múltiplos pacotes exige consistência de dependências. Em vez de espalhar versões soltas em cada `package.json`, utilizamos recursos nativos do **pnpm**:

* **Catálogo Centralizado (`catalog:`)**:
  No arquivo `pnpm-workspace.yaml`, declaramos uma única vez a versão das ferramentas e bibliotecas compartilhadas (React 19, Vite, TypeScript, etc.):
  ```yaml
  packages:
    - applications/*
    - packages/*

  catalog:
    react: ^19.2.8
    react-dom: ^19.2.8
    '@module-federation/vite': ^1.23.4
    typescript: ~6.0.2
    vite: ^8.3.0
  ```
  Nas aplicações e pacotes, apenas referenciamos o catálogo:
  ```json
  "dependencies": {
    "react": "catalog:",
    "react-dom": "catalog:"
  }
  ```
  * **Vantagem:** Evita divergência de versões entre microfrontends (o que quebraria o singleton do Module Federation) e permite atualizar o React em todo o monorepo alterando apenas uma linha.

* **Protocolo `workspace:*` (Pacotes Internos)**:
  Para que o `people-listing` use o `@repo/ui`, declaramos:
  ```json
  "@repo/ui": "workspace:*"
  ```
  Isso diz ao pnpm para criar symlinks locais diretamente para a pasta `packages/ui`, sem tentar buscar nada no npm público.

* **`peerDependencies` no Pacote de UI**:
  O pacote `@repo/ui` não instala sua própria cópia do React em produção. Ele define o React em `peerDependencies`, delegando a responsabilidade de fornecer a instância do React para a aplicação consumidora. Isso elimina o risco de instâncias duplicadas do React no bundle (o que causaria o clássico erro de *Invalid Hook Call*).

---

### 2. Module Federation (Vite)

O **Module Federation** permite a arquitetura de **Microfrontends em Runtime (Tempo de Execução)**:

* **Como funciona:**
  1. O `people-listing` (Remote) compila de forma independente e expõe seu módulo via `remoteEntry.js` na porta `5000`:
     ```ts
     // applications/people-listing/module-federation.config.ts
     export default createModuleFederationConfig({
       name: 'people-listing',
       filename: 'remoteEntry.js',
       exposes: {
         './PeopleApp': './src/PeopleApp.tsx',
       },
       shared: {
         react: { singleton: true },
         'react-dom': { singleton: true }
       }
     });
     ```
  2. O `orchestrator` (Host) roda na porta `5173` e consome o microfrontend via URL:
     ```ts
     // applications/orchestrator/module-federation.config.ts
     remotes: {
       peopleListMicroFront: {
         type: 'module',
         entry: 'http://localhost:5000/remoteEntry.js'
       }
     }
     ```
* **Deploy Independente:** O time do `people-listing` pode atualizar e subir seu código sem que o `orchestrator` precise ser recompilado ou redeployado.
* **Compartilhamento de Runtime (`singleton`)**: Mesmo sendo duas aplicações separadas rodando em portas distintas, o Module Federation garante que o React seja instanciado uma única vez na memória do navegador.

---

### 3. Stencil (Web Components Nativos)

Para testar a criação de componentes agnósticos de framework, integramos o **Stencil** dentro de `packages/ui`:

* **O que o Stencil faz:** Ele é um compilador que transforma código TypeScript com decorators (`@Component`, `@Prop`, `@State`) em **Custom Elements nativos (W3C)** empacotados com Shadow DOM.
* **Componente `<app-header>`**:
  Criado em `packages/ui/src/components/app-header/app-header.tsx`, possui estilos encapsulados e aceita a propriedade `app-title`:
  ```tsx
  @Component({
    tag: 'app-header',
    styleUrl: 'app-header.css',
    shadow: true,
  })
  export class AppHeader {
    @Prop() appTitle: string = 'People Listing Microfront';
    render() {
      return (
        <header class="app-header">
          <div class="logo">⚡ Stencil Web Component</div>
          <div class="title">{this.appTitle}</div>
        </header>
      );
    }
  }
  ```
* **Compilação e Exportação:** O Stencil compila o componente para `dist/components/`. No ponto de entrada (`packages/ui/src/index.ts`), registramos o componente automaticamente via `customElements.define` quando a biblioteca é importada.

#### ⚠️ Limitação de HMR em Web Components vs. React
* **React Fast Refresh:** Componentes React são funções puras em memória. O Vite consegue substituir a função em tempo real sem recarregar a página e sem perder estado.
* **Web Components (Custom Elements Registry):** Pela especificação nativa da Web, uma tag de Custom Element **só pode ser definida uma única vez por ciclo de vida da página** (`window.customElements`). O navegador não permite fazer `undefine` de uma tag já registrada. Por isso, quando a classe de um Web Component é alterada, é fundamental um **reload na página (F5)** para que o navegador registre a nova definição do componente.

---

### 4. Tipagem TypeScript: Escopo Global vs. Escopo React 19

Para que o React reconheça tags customizadas em minúsculas (como `<app-header />`) sem acusar erro de que a propriedade não existe em `JSX.IntrinsicElements`:

* **A diferença entre React 18 e React 19:**
  * No **React 18**, a tipagem do JSX residia no escopo global (`declare global { namespace JSX { ... } }`).
  * No **React 19**, a tipagem do JSX foi movida para dentro da declaração do próprio módulo do React.
* **A solução centralizada no `@repo/ui`:**
  Em `packages/ui/src/index.ts`, aumentamos o módulo oficial do React:
  ```typescript
  import 'react';

  declare module 'react' {
    namespace JSX {
      interface IntrinsicElements {
        'app-header': React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> & {
            'app-title'?: string;
            appTitle?: string;
          },
          HTMLElement
        >;
      }
    }
  }
  ```
* **Benefício:** Qualquer aplicação (`people-listing`, `orchestrator`, etc.) que fizer `import ... from "@repo/ui"` (ou simplesmente `import "@repo/ui"`) automaticamente herda a tipagem completa do componente no JSX, com autocompletion e validação de props, sem precisar de nenhum arquivo `.d.ts` local redundante.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
* **Node.js** (v20+ ou v24+)
* **pnpm** (instalado globalmente ou via Corepack)

### 1. Instalar as dependências
Na raiz do monorepo:
```bash
pnpm install
```

### 2. Build inicial dos componentes Stencil
Para gerar os Custom Elements na pasta `packages/ui/dist`:
```bash
pnpm --filter @repo/ui build
```

### 3. Rodar o ambiente de desenvolvimento
Execute na raiz:
```bash
pnpm dev
```
O comando iniciará em paralelo:
* **Orchestrator (Host):** `http://localhost:5173`
* **People Listing (Remote):** `http://localhost:5000`
* **UI Package:** Compilador do Stencil em modo watch (`stencil build --watch`)

### 4. Build de Produção
Para verificar a tipagem e compilar todos os pacotes:
```bash
pnpm build
```
