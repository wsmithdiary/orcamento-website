# Gerador de Orçamentos

Aplicação web para montar orçamentos de mão de obra e exportar em PDF.
O usuário adiciona os serviços linha a linha (descrição, unidade, preço
unitário, quantidade), a aplicação calcula os totais e gera o documento final.

As unidades seguem a nomenclatura da tabela SINAPI (m², m³, vb, h).

## Por que existe

Uma empreiteira de pequeno porte monta seus orçamentos à mão, item a item,
com as contas na calculadora. Depois, o documento ainda precisa ser digitado
e exportado à parte para virar PDF — dois trabalhos separados para uma coisa só.

A meta é que, no tempo de um orçamento manual, seja possível montar dois. E que
o PDF saia pronto no fim, sem etapa extra.

## Como funciona

O caminho de um orçamento é curto e não sai do navegador:

```
usuário digita → validação → item na lista → subtotal → total → PDF
                  (core/)                     (core/)   (core/)  (core/)
```

Nada disso passa por um servidor. O orçamento nasce e morre em uma aba: não há
banco, não há sessão, não há dado da empresa hospedado em lugar nenhum. Essa é a
razão pela qual a aplicação pode ser estática — e a razão pela qual boa parte
das decisões abaixo foi possível.

## Stack

- React + TypeScript
- Vite
- Vitest + Testing Library + jsdom
- Geração de PDF no navegador (sem back-end)

## Arquitetura

```
src/
  core/         → regra de negócio em TypeScript puro (não importa React)
    tipos.ts
    validacao.ts
    calculo.ts        (em andamento)
    documento.ts      (a fazer)
  components/   → camada de interface
    Campo.tsx
    CampoSelect.tsx
    Formulario.tsx
  tests/
```

A fronteira é `core/`: tudo que é cálculo e validação vive ali, como funções
puras que recebem dados e devolvem dados. A interface só monta o estado, chama
essas funções e desenha o resultado. Na prática isso significa que a maior parte
da lógica é testada sem renderizar nada — os testes de `core/` rodam sem DOM e
sem `act()`, e sobra pouca coisa para os testes de integração cobrirem.

`documento.ts` fica do lado de dentro dessa fronteira: montar a definição do PDF
é lógica pura — entra uma lista de itens, sai um objeto que descreve o
documento. Só a última linha, que manda a biblioteca gerar o arquivo, é efeito
colateral. Descrever e renderizar são coisas diferentes.

## Decisões

- **Sem back-end** — o cálculo e o PDF rodam inteiros no cliente, então a
  aplicação é estática e não depende de servidor.
- **Vite em vez de Next** — não há SSR, rotas ou SEO envolvidos; o framework
  não traria ganho e complicaria a geração do PDF no cliente.
- **Lógica de cálculo separada da interface** — o núcleo é testável e não
  conhece React.
- **Campos numéricos como `type="text"` + `inputMode="decimal"`** — o
  `type="number"` do HTML não aceita vírgula como separador decimal, que é o
  que o usuário brasileiro digita. O campo aceita texto e a conversão de
  `"1,50"` para `1.5` acontece na validação, num só lugar.
- **Validação como função pura** — `validarFormulario(campos)` devolve um
  objeto de erros por campo. Quem decide o que fazer com o erro é o
  componente, não a função.
- **Total como valor derivado, não como estado** — o total é função dos itens.
  Guardá-lo em `useState` criaria uma segunda fonte de verdade para o mesmo
  número, e todo bug de "o total não bateu" nasce de duas fontes de verdade que
  se desencontram. Ele é calculado na renderização.
- **Hospedagem estática (Vercel)** — o resultado do build é um punhado de
  arquivos. Uma CDN entrega isso sem que exista um processo para manter no ar,
  e o HTTPS vem junto — do qual o próximo item depende.
- **PWA como forma de entrega** — o orçamento é montado onde a obra está, nem
  sempre com sinal. Como a aplicação já não faz nenhuma chamada de rede depois
  de carregada, falta só garantir que os arquivos estejam no aparelho: é
  exatamente isso, e nada além disso, que o service worker faz aqui.

## O que foi descartado, e por quê

Um roadmap acumula itens que pararam de fazer sentido quando o escopo mudou.
Estes saíram:

- **Empacotamento em Docker.** Entrou quando a arquitetura ainda previa
  back-end e PostgreSQL. Sem back-end, sobrou uma imagem cuja única função
  seria servir arquivos estáticos — trabalho que a CDN já faz. E o Dockerfile
  de desenvolvimento resolveria "padronizar o ambiente da equipe" num projeto
  de uma pessoa só. Docker volta quando voltar o back-end do SINAPI.
- **Servir na rede local pelo IP da máquina.** Rede local só responde dentro da
  rede local, que é justamente onde o usuário não está quando precisa da
  ferramenta. Além disso, HTTP por IP não é contexto seguro: derruba
  `crypto.randomUUID()` e impede registrar service worker — ou seja, é
  incompatível com o item de PWA acima.
- **Fallback de rota SPA no nginx.** Consequência dos dois anteriores. Uma
  aplicação de uma tela só, servida por CDN, não tem rota para dar fallback.

Os três eram implementações que sobreviveram por inércia a um requisito que
tinha deixado de existir.

## Acessibilidade

Não é enfeite: é o que faz o formulário ser testável por papel e por nome,
do jeito que o usuário o enxerga.

- `useId()` + `htmlFor`/`id` explícitos associam label e campo — nada de label
  implícito, que não é reconhecido no jsdom.
- Mensagens de erro são renderizadas com `role="alert"` e ligadas ao campo por
  `aria-describedby`, então o leitor de tela anuncia o erro junto do campo que
  o causou.

## Testes

O ciclo é escrever o teste, vê-lo falhar, corrigir, ver passar. Um teste que
nunca falhou não provou nada, então cada teste novo é validado quebrando o
código de propósito antes de consertar.

```bash
npm test
```

Cobertura atual: validação (`core/`) e integração do formulário — submit
inválido bloqueado, erros exibidos e limpos no caminho de sucesso.

Duas coisas ficam fora do alcance do Vitest com jsdom: a geração do arquivo PDF,
que é uma linha de efeito colateral com o núcleo testado atrás dela, e o service
worker, que não existe no jsdom e vai precisar de um navegador de verdade.

## Rodando local

```bash
npm install
npm run dev
```

## Status

Em desenvolvimento.

Pronto:

- [x] Campos acessíveis com label associado e exibição de erro
- [x] Validação pura de formulário (campo vazio, vírgula decimal, `NaN`, valores ≤ 0)
- [x] Formulário adicionando itens à lista, com submit inválido bloqueado

Em andamento:

- [ ] Testes de subtotal por item e de total acumulado
- [ ] Cálculo de subtotal e total, com o total exibido como valor derivado
- [ ] Formatação de moeda em pt-BR

A seguir:

- [ ] Exportação em PDF
- [ ] Deploy da versão pública
- [ ] Instalação como PWA (manifest + service worker)