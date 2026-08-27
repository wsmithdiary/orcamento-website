<div align="center">

# 🏗️ Gerador de Orçamentos

Monte orçamentos de mão de obra linha a linha e exporte o PDF pronto. React, TypeScript e Vite — tudo no navegador, sem back-end.

### [☄ Ver o que já está no ar →](https://empreiteira-website.vercel.app)

![React](https://img.shields.io/badge/React-19-9fd8ff?style=for-the-badge&logo=react&logoColor=080d1a&labelColor=080d1a)
![TypeScript](https://img.shields.io/badge/TypeScript-6ea8ff?style=for-the-badge&logo=typescript&logoColor=080d1a&labelColor=080d1a)
![Vite](https://img.shields.io/badge/Vite-7d4bd8?style=for-the-badge&logo=vite&logoColor=9fd8ff&labelColor=080d1a)
![Vitest](https://img.shields.io/badge/Vitest-9fd8ff?style=for-the-badge&logo=vitest&logoColor=080d1a&labelColor=080d1a)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-6ea8ff?style=for-the-badge&logo=tailwindcss&logoColor=080d1a&labelColor=080d1a)
![Vercel](https://img.shields.io/badge/Vercel-0b1226?style=for-the-badge&logo=vercel&logoColor=9fd8ff&labelColor=080d1a)

</div>

<div align="center">✦ · ✧ · ✦</div>

## ☄ Quinze segundos

> **O problema.** Uma empreiteira de pequeno porte monta orçamento à mão, item a item, com a conta na calculadora. Depois digita tudo de novo em outro programa só para virar PDF. Dois trabalhos para uma coisa só.
>
> **O que isto faz.** O usuário lança os serviços linha a linha — descrição, unidade, preço unitário, quantidade —, a aplicação calcula os totais e entrega o documento final. As unidades seguem a nomenclatura da tabela **SINAPI** (m², m³, vb, h), que é a que o setor já usa.
>
> **Como está construído.** **React** com **TypeScript** sobre **Vite**. A regra de negócio vive em `core/` e não importa uma linha de React — é testada no **Vitest** sem renderizar nada. Depois que a página carrega, não existe mais nenhuma chamada de rede.
>
> **A meta.** No tempo de um orçamento manual, montar dois. E o PDF sair pronto no fim, sem etapa extra. → **[Testar agora](https://empreiteira-website.vercel.app)**

> [!NOTE]
> A versão publicada sobe a cada mudança na `main` e mostra o estado real do projeto, não uma demonstração preparada. O que já funciona e o que ainda está sendo escrito estão no [registro de status](#️-status), no fim da página.

Cada decisão daqui para baixo vem com o motivo escrito ao lado. As que foram descartadas também — e essas dizem mais.

<div align="center">✦ · ✧ · ✦</div>

## 🎯 Por que existe

Este projeto não nasceu de um tutorial. Nasceu de ver alguém fazer a mesma conta na calculadora pela terceira vez no mesmo orçamento, e depois redigitar o resultado inteiro em outro programa para conseguir um PDF apresentável.

O trabalho é sempre o mesmo: uma lista de serviços, cada um com unidade, preço unitário e quantidade; a multiplicação de cada linha; a soma de tudo; e um documento no fim. É exatamente o tipo de tarefa que o computador faz sem errar e a pessoa faz errando de vez em quando, sempre com pressa.

> [!NOTE]
> O sucesso deste projeto não se mede em estrelas no repositório. Mede-se em uma pessoa terminando o orçamento antes e confiando no número.

<div align="center">✦ · ✧ · ✦</div>

## ⚙️ Como funciona

```mermaid
flowchart LR
    A["✍️ usuário digita"] --> B["🛡️ validação"]
    B --> C["📋 item na lista"]
    C --> D["✖️ subtotal"]
    D --> E["Σ total"]
    E --> F["📄 PDF"]
    classDef core fill:#9fd8ff,stroke:#6ea8ff,stroke-width:2px,color:#080d1a
    classDef ui fill:#0e0b1f,stroke:#7d4bd8,stroke-width:2px,color:#9fd8ff
    class B,D,E,F core
    class A,C ui
```

<div align="center"><sub>✦ nas caixas claras, tudo que vive em <code>core/</code> e roda sem interface</sub></div>

> [!IMPORTANT]
> Nada disso passa por um servidor. O orçamento nasce e morre em uma aba: não há banco, não há sessão, não há dado da empresa hospedado em lugar nenhum. É essa a razão pela qual a aplicação pode ser estática — e a razão pela qual boa parte das decisões abaixo foi possível.

<div align="center">✦ · ✧ · ✦</div>

## 🧰 Cinturão de ferramentas

**Interface** — Componentes em **React** escritos em **TypeScript**, estilizados com **Tailwind CSS**.

**Build** — **Vite** compila e serve; o resultado é um punhado de arquivos estáticos.

**Testes** — **Vitest** com **Testing Library** e **jsdom**, com o núcleo testado sem DOM.

**PDF** — Gerado no navegador do usuário, sem back-end.

**Deploy** — **Vercel**, a cada push na `main`.

<div align="center">✦ · ✧ · ✦</div>

## 🪐 Arquitetura

```
src/
  core/         → 🧮 regra de negócio em TypeScript puro (não importa React)
    tipos.ts
    validacao.ts
    calculo.ts        🚧 em andamento
    documento.ts      📋 a fazer
  components/   → 🎨 camada de interface
    Campo.tsx
    CampoSelect.tsx
    Formulario.tsx
  tests/
```

A fronteira é `core/`: tudo que é cálculo e validação vive ali, como funções puras que recebem dados e devolvem dados. A interface só monta o estado, chama essas funções e desenha o resultado.

Na prática isso significa que a maior parte da lógica é testada sem renderizar nada — os testes de `core/` rodam sem DOM e sem `act()`, e sobra pouca coisa para os testes de integração cobrirem.

> [!TIP]
> `documento.ts` fica do lado de dentro dessa fronteira: montar a definição do PDF é lógica pura — entra uma lista de itens, sai um objeto que descreve o documento. Só a última linha, que manda a biblioteca gerar o arquivo, é efeito colateral. **Descrever e renderizar são coisas diferentes.**

<div align="center">✦ · ✧ · ✦</div>

## ✧ Decisões

- 🚫 **Sem back-end** — o cálculo e o PDF rodam inteiros no cliente, então a aplicação é estática e não depende de servidor.
- ⚡ **Vite em vez de Next.js** — não há SSR, rota nem SEO envolvidos; o framework não traria ganho e complicaria a geração do PDF no cliente.
- 🧮 **Lógica de cálculo separada da interface** — o núcleo é testável e não conhece React.
- 🇧🇷 **Campos numéricos como `type="text"` + `inputMode="decimal"`** — o `type="number"` do HTML não aceita vírgula como separador decimal, que é o que o usuário brasileiro digita. O campo aceita texto e a conversão de `"1,50"` para `1.5` acontece na validação, num só lugar.
- 🧼 **Validação como função pura** — `validarFormulario(campos)` devolve um objeto de erros por campo. Quem decide o que fazer com o erro é o componente, não a função.
- 🔗 **Total como valor derivado, não como estado** — o total é função dos itens. Guardá-lo em `useState` criaria uma segunda fonte de verdade para o mesmo número, e todo bug de "o total não bateu" nasce de duas fontes de verdade que se desencontram. Ele é calculado na renderização.
- ☁️ **Hospedagem estática na Vercel** — o resultado do build é um punhado de arquivos. Uma CDN entrega isso sem que exista um processo para manter no ar, e o HTTPS vem junto — do qual o próximo item depende. Está em [empreiteira-website.vercel.app](https://empreiteira-website.vercel.app).
- 📲 **PWA como forma de entrega** — o orçamento é montado onde a obra está, nem sempre com sinal. Como a aplicação já não faz nenhuma chamada de rede depois de carregada, falta só garantir que os arquivos estejam no aparelho: é exatamente isso, e nada além disso, que o service worker faz aqui.

<div align="center">✦ · ✧ · ✦</div>

## 🕳️ O buraco da memória

Em *1984*, o que deixava de ser conveniente ia para o buraco da memória e passava a nunca ter existido. Aqui é o contrário: o que foi descartado fica escrito, com o motivo. Um roadmap acumula item que parou de fazer sentido quando o escopo mudou. Estes saíram:

```diff
- Empacotamento em Docker
- Servir na rede local pelo IP da máquina
- Fallback de rota SPA no nginx
```

- 🐳 **Empacotamento em Docker.** Entrou quando a arquitetura ainda previa back-end e PostgreSQL. Sem back-end, sobrou uma imagem cuja única função seria servir arquivos estáticos — trabalho que a CDN já faz. E o Dockerfile de desenvolvimento resolveria "padronizar o ambiente da equipe" num projeto de uma pessoa só. **Docker** volta quando voltar o back-end do SINAPI.
- 📡 **Servir na rede local pelo IP da máquina.** Rede local só responde dentro da rede local, que é justamente onde o usuário não está quando precisa da ferramenta. Além disso, HTTP por IP não é contexto seguro: derruba `crypto.randomUUID()` e impede registrar service worker — ou seja, é incompatível com o item de PWA acima.
- 🔀 **Fallback de rota SPA no nginx.** Consequência dos dois anteriores. Uma aplicação de uma tela só, servida por CDN, não tem rota para dar fallback.

Os três eram implementações que sobreviveram por inércia a um requisito que tinha deixado de existir. Retirar código que funciona custa mais do que escrevê-lo — e é o que impede o projeto de virar um museu das próprias decisões antigas.

<div align="center">✦ · ✧ · ✦</div>

## ♿ Acessibilidade

Não é enfeite: é o que faz o formulário ser testável por papel e por nome, do jeito que o usuário o enxerga.

- 🏷️ `useId()` com `htmlFor`/`id` explícitos associam label e campo — nada de label implícito, que não é reconhecido no jsdom.
- 📢 Mensagens de erro são renderizadas com `role="alert"` e ligadas ao campo por `aria-describedby`, então o leitor de tela anuncia o erro junto do campo que o causou.

<div align="center">✦ · ✧ · ✦</div>

## ✦ Testes

Orwell escreveu que a liberdade é a liberdade de dizer que dois mais dois são quatro. Um orçamento serve para a mesma coisa: dizer o número certo mesmo quando dava menos trabalho arredondar.

O ciclo é **TDD** puro — escrever o teste, vê-lo falhar, corrigir, ver passar. Um teste que nunca falhou não provou nada, então cada teste novo é validado quebrando o código de propósito antes de consertar.

```bash
npm test
```

Cobertura atual: validação (`core/`) e integração do formulário — submit inválido bloqueado, erros exibidos e limpos no caminho de sucesso.

> [!WARNING]
> Duas coisas ficam fora do alcance do Vitest com jsdom: a geração do arquivo PDF, que é uma linha de efeito colateral com o núcleo testado atrás dela, e o service worker, que não existe no jsdom e vai precisar de um navegador de verdade.

<div align="center">✦ · ✧ · ✦</div>

## ▶️ Rodando local

```bash
npm install
npm run dev
```

<div align="center">✦ · ✧ · ✦</div>

## 🛰️ Status

Em desenvolvimento, publicado desde o primeiro dia em que teve o que mostrar. O registro abaixo é atualizado conforme cada item fecha — e a [versão no ar](https://empreiteira-website.vercel.app) reflete sempre o topo da `main`.

**✅ Pronto**

- [x] Campos acessíveis com label associado e exibição de erro
- [x] Validação pura de formulário (campo vazio, vírgula decimal, `NaN`, valores ≤ 0)
- [x] Formulário adicionando itens à lista, com submit inválido bloqueado
- [x] Deploy da versão pública — [empreiteira-website.vercel.app](https://empreiteira-website.vercel.app)

**🚧 Em andamento**

- [ ] Testes de subtotal por item e de total acumulado
- [ ] Cálculo de subtotal e total, com o total exibido como valor derivado
- [ ] Formatação de moeda em pt-BR

**📋 A seguir**

- [ ] Exportação em PDF
- [ ] Instalação como PWA (manifest + service worker)

<div align="center">✦ · ✧ · ✦</div>

## 📡 Transmissão

Escrito por Gabriel — [@wsmithdiary](https://github.com/wsmithdiary). Crítica de arquitetura é bem-vinda; é para isso que as decisões estão escritas.

**dev.gabriel2000@gmail.com**

<div align="center">

✦ · ✧ · ✦

<sub>Dois mais dois são quatro.</sub>

</div>
