# Gerador de Orçamentos

Aplicação web para montar orçamentos de mão de obra e exportar em PDF.
O usuário adiciona os serviços linha a linha (descrição, unidade, preço,
quantidade), aplica a margem sobre o custo e gera o documento final.

As unidades seguem a nomenclatura da tabela SINAPI (m², m³, vb, h).

## Por que existe

Uma empreiteira de pequeno porte monta seus orçamentos à mão, item a item,
com as contas feitas na calculadora. Depois, o documento ainda precisa ser
digitado e exportado à parte para virar PDF — dois trabalhos separados para
uma coisa só.

A meta aqui é que, no tempo de um orçamento manual, seja possível montar
dois. E que o PDF saia pronto no fim, sem etapa extra.

## Stack

- React + TypeScript
- Vite
- Geração de PDF no navegador (sem back-end)

## Decisões

- **Sem back-end** — o cálculo e o PDF rodam inteiros no cliente, então
  a aplicação é estática e não depende de servidor.
- **Vite em vez de Next** — não há SSR, rotas ou SEO envolvidos; o
  framework não traria ganho e complicaria a geração do PDF no cliente.
- **Lógica de cálculo separada da interface** — o núcleo é testável e
  não conhece React.

## Rodando local

```bash
npm install
npm run dev
```

## Status

Em desenvolvimento.