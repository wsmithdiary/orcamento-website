import Decimal from "decimal.js";
import type { TDocumentDefinitions, Content } from "pdfmake/interfaces";
import type { Item } from "../components/ItemsList/ItemsList.type";
import type { DadosCliente } from "../components/DadosCliente/DadosCliente.types";
import {
    calcularSubtotal,
    calcularTotal,
    CASAS_DECIMAIS,
    MODO_ARREDONDAMENTO,
} from "./calcular";
import { formatarMoeda, formatarQuantidade } from "./formatar";
import { EMPRESA, BDI_PADRAO, VALIDADE_DIAS, CLAUSULAS } from "./constantes";
import { LOGO_PDF } from "./logoPdf";

// ============================================================
// Monta a definicao do PDF como objeto puro.
// Nao gera arquivo, nao toca no DOM, nao chama a biblioteca —
// por isso da para testar com Vitest sem renderizar nada.
// ============================================================

// Cores do documento impresso: tons do azul-marinho da marca.
// Nada de vermelho ou dourado saturado aqui — em jato de tinta borra.
const PRETO = "#121A33";
const CINZA = "#5B6480";
const CINZA_CLARO = "#7C88A6";
const CINZA_TEXTO = "#333B54";
const FUNDO_CABECALHO = "#E9ECF5";
const LINHA_TABELA = "#D3D8E6";

/** Mostrado quando o usuario nao preencheu o campo. Linha em branco parece erro de impressao. */
const TRACO = "—";

// ------------------------------------------------------------
// Calculo do BDI
// ------------------------------------------------------------

/**
 * Aplica a margem sobre o custo de mao de obra.
 * Campo vazio, texto invalido ou negativo caem no padrao de constantes.ts.
 * Devolve tambem o percentual usado, porque ele vai impresso no PDF.
 */
export function calcularComBdi(custo: Decimal, bdiTexto: string) {
    const limpo = bdiTexto.trim().replace(",", ".");
    let percentual = new Decimal(BDI_PADRAO);

    try {
        if (limpo !== "") {
            const informado = new Decimal(limpo);
            if (informado.gte(0)) percentual = informado;
        }
    } catch {
        // Texto que nao vira numero: mantem o padrao em vez de quebrar a geracao.
        percentual = new Decimal(BDI_PADRAO);
    }

    const margem = custo
        .times(percentual)
        .dividedBy(100)
        .toDecimalPlaces(CASAS_DECIMAIS, MODO_ARREDONDAMENTO);

    return { percentual, margem, total: custo.plus(margem) };
}

// ------------------------------------------------------------
// Datas
// ------------------------------------------------------------

/** Nao muta a data recebida: cria uma nova. */
function somarDias(data: Date, dias: number) {
    const nova = new Date(data);
    nova.setDate(nova.getDate() + dias);
    return nova;
}

const formatarData = (data: Date) => data.toLocaleDateString("pt-BR");

// ------------------------------------------------------------
// Pedacos reaproveitados do layout
// ------------------------------------------------------------

/** Faixa preta com titulo branco, usada para separar as secoes. */
function faixa(texto: string, margem: [number, number, number, number]): Content {
    return {
        table: {
            widths: ["*"],
            body: [
                [
                    {
                        text: texto.toUpperCase(),
                        color: "#FFFFFF",
                        bold: true,
                        fontSize: 8,
                        characterSpacing: 0.6,
                        margin: [4, 3, 4, 3],
                    },
                ],
            ],
        },
        layout: {
            hLineWidth: () => 0,
            vLineWidth: () => 0,
            fillColor: () => PRETO,
        },
        margin: margem,
    };
}

/** Coluna de pares rotulo/valor do bloco do contratante. */
function coluna(pares: [string, string][]): Content {
    return {
        width: "*",
        stack: pares.map(([rotulo, valor]) => ({
            margin: [0, 0, 0, 6] as [number, number, number, number],
            stack: [
                { text: rotulo.toUpperCase(), fontSize: 6.5, color: CINZA_CLARO },
                { text: valor, fontSize: 8.5 },
            ],
        })),
    };
}

const cabecalhoTabela = (texto: string, alinhamento: "left" | "right" = "left") => ({
    text: texto,
    bold: true,
    fontSize: 7.5,
    alignment: alinhamento,
});

const celula = (texto: string, alinhamento: "left" | "right" = "left") => ({
    text: texto,
    fontSize: 8,
    alignment: alinhamento,
});

const linhaTotal = (texto: string, alinhamento: "left" | "right" = "left") => ({
    text: texto,
    fontSize: 8.5,
    alignment: alinhamento,
});

/** Bloco de clausula: titulo com sublinhado e corpo em lista ou paragrafo. */
function bloco(titulo: string, corpo: Content): Content {
    return {
        width: "*",
        stack: [
            {
                text: titulo.toUpperCase(),
                bold: true,
                fontSize: 7.5,
                characterSpacing: 0.4,
                margin: [0, 0, 0, 2],
            },
            {
                canvas: [
                    { type: "line", x1: 0, y1: 0, x2: 248, y2: 0, lineWidth: 0.6, lineColor: "#C9C9C9" },
                ],
                margin: [0, 0, 0, 4],
            },
            corpo,
        ],
    };
}

const lista = (itens: string[]): Content => ({
    ul: itens,
    fontSize: 7.5,
    color: CINZA_TEXTO,
    lineHeight: 1.35,
});

const paragrafo = (texto: string): Content => ({
    text: texto,
    fontSize: 7.5,
    color: CINZA_TEXTO,
    lineHeight: 1.35,
    alignment: "justify",
});

/** Linha de assinatura com nome e cargo centralizados abaixo. */
const assinatura = (nome: string, cargo: string): Content => ({
    width: "*",
    stack: [
        { canvas: [{ type: "line", x1: 0, y1: 0, x2: 240, y2: 0, lineWidth: 0.8, lineColor: PRETO }] },
        { text: nome, fontSize: 8, bold: true, alignment: "center", margin: [0, 4, 0, 0] },
        { text: cargo, fontSize: 7, color: CINZA, alignment: "center" },
    ],
});

// ------------------------------------------------------------
// A funcao principal
// ------------------------------------------------------------

/**
 * Monta o documento inteiro.
 * A data de emissao entra por parametro com valor padrao: assim o teste
 * passa uma data fixa e o resultado nao muda a cada execucao.
 */
export function montarDocumento(
    itens: Item[],
    dados: DadosCliente,
    numero: string,
    emissao: Date = new Date(),
): TDocumentDefinitions {
    const custo = calcularTotal(itens);
    const { percentual, margem, total } = calcularComBdi(custo, dados.bdi);
    const validade = somarDias(emissao, VALIDADE_DIAS);

    return {
        pageSize: "A4",
        pageMargins: [40, 40, 40, 42],
        defaultStyle: { fontSize: 8.5, lineHeight: 1.3, color: PRETO },

        // Rodape repetido em toda pagina. A funcao recebe a pagina atual e o total.
        footer: (paginaAtual, totalPaginas) => ({
            margin: [40, 8, 40, 0],
            columns: [
                {
                    text: `Orçamento ${numero} · ${EMPRESA.nome}`,
                    fontSize: 7,
                    color: CINZA_CLARO,
                },
                {
                    text: `Página ${paginaAtual} de ${totalPaginas}`,
                    fontSize: 7,
                    color: CINZA_CLARO,
                    alignment: "right",
                },
            ],
        }),

        content: [
            // ---------- cabecalho: marca a esquerda, numero do documento a direita ----------
            {
                columns: [
                    { width: 42, image: LOGO_PDF, margin: [0, 0, 10, 0] },
                    {
                        width: "*",
                        stack: [
                            { text: EMPRESA.nome, fontSize: 14, bold: true },
                            { text: EMPRESA.slogan, fontSize: 7.5, italics: true, color: CINZA },
                            {
                                text: `CNPJ ${EMPRESA.cnpj} · Insc. Municipal ${EMPRESA.inscricao}`,
                                fontSize: 7,
                                color: CINZA,
                                margin: [0, 3, 0, 0],
                            },
                            {
                                text: `${EMPRESA.endereco} · ${EMPRESA.telefone} · ${EMPRESA.email}`,
                                fontSize: 7,
                                color: CINZA,
                            },
                        ],
                    },
                    {
                        width: "auto",
                        alignment: "right",
                        stack: [
                            { text: `ORÇAMENTO ${numero}`, fontSize: 12, bold: true },
                            {
                                // Validade com data explicita: impede o cliente de cobrar o preco antigo meses depois.
                                text: `Emissão: ${formatarData(emissao)}\nValidade: ${VALIDADE_DIAS} dias (até ${formatarData(validade)})`,
                                fontSize: 7.5,
                                color: CINZA,
                            },
                        ],
                    },
                ],
            },

            // Linha grossa fechando o cabecalho.
            {
                canvas: [{ type: "line", x1: 0, y1: 4, x2: 515, y2: 4, lineWidth: 2, lineColor: PRETO }],
                margin: [0, 4, 0, 10],
            },

            // ---------- dados do contratante e da obra ----------
            faixa("Contratante e obra", [0, 0, 0, 6]),
            {
                columns: [
                    coluna([
                        ["Contratante", dados.contratante || TRACO],
                        ["Endereço da obra", dados.enderecoObra || TRACO],
                        ["Objeto", dados.objeto || TRACO],
                    ]),
                    coluna([
                        ["CPF / CNPJ", dados.documento || TRACO],
                        ["Telefone", dados.telefone || TRACO],
                        ["Prazo estimado de execução", dados.prazoEstimado || TRACO],
                    ]),
                ],
                columnGap: 20,
            },

            // ---------- tabela de servicos ----------
            faixa("Discriminação dos serviços – mão de obra", [0, 12, 0, 6]),
            {
                table: {
                    // headerRows repete o cabecalho quando a tabela quebra para a proxima pagina.
                    headerRows: 1,
                    widths: [16, "*", 26, 46, 58, 64],
                    body: [
                        [
                            cabecalhoTabela("#"),
                            cabecalhoTabela("Descrição do serviço"),
                            cabecalhoTabela("Un."),
                            cabecalhoTabela("Quant.", "right"),
                            cabecalhoTabela("Preço unit.", "right"),
                            cabecalhoTabela("Subtotal", "right"),
                        ],
                        ...itens.map((item, indice) => [
                            celula(String(indice + 1)),
                            celula(item.descricao),
                            celula(item.unidadeDeMedida),
                            celula(formatarQuantidade(item.quantiaTotal), "right"),
                            celula(formatarMoeda(item.precoUnitario), "right"),
                            // Subtotal recalculado aqui: e valor derivado, nao campo do Item.
                            celula(
                                formatarMoeda(calcularSubtotal(item.precoUnitario, item.quantiaTotal)),
                                "right",
                            ),
                        ]),
                    ],
                },
                layout: {
                    // Linhas grossas so em volta do cabecalho e no fim da tabela.
                    hLineWidth: (i, node) =>
                        i === 0 || i === 1 || i === node.table.body.length ? 0.8 : 0.4,
                    hLineColor: (i) => (i <= 1 ? PRETO : LINHA_TABELA),
                    vLineWidth: () => 0,
                    paddingTop: () => 5,
                    paddingBottom: () => 5,
                    fillColor: (i) => (i === 0 ? FUNDO_CABECALHO : null),
                },
            },

            // ---------- totais alinhados a direita ----------
            {
                margin: [0, 10, 0, 0],
                columns: [
                    { width: "*", text: "" },
                    {
                        width: 210,
                        table: {
                            widths: ["*", "auto"],
                            body: [
                                [linhaTotal("Custo de mão de obra"), linhaTotal(formatarMoeda(custo), "right")],
                                [
                                    // Mostrar a margem separada e mais transparente que embutir no preco unitario.
                                    linhaTotal(`BDI / margem (${percentual.toString()}%)`),
                                    linhaTotal(formatarMoeda(margem), "right"),
                                ],
                                [
                                    { text: "TOTAL GERAL", bold: true, fontSize: 11, margin: [0, 4, 0, 0] },
                                    {
                                        text: formatarMoeda(total),
                                        bold: true,
                                        fontSize: 11,
                                        alignment: "right",
                                        margin: [0, 4, 0, 0],
                                    },
                                ],
                            ],
                        },
                        layout: {
                            hLineWidth: (i) => (i === 2 ? 1.2 : 0),
                            hLineColor: () => PRETO,
                            vLineWidth: () => 0,
                            paddingLeft: () => 0,
                            paddingRight: () => 0,
                        },
                    },
                ],
            },

            // ---------- clausulas em duas colunas ----------
            {
                margin: [0, 14, 0, 0],
                columns: [
                    bloco("Escopo incluído", lista(CLAUSULAS.incluido)),
                    bloco("Não incluído", lista(CLAUSULAS.excluido)),
                ],
                columnGap: 18,
            },
            {
                margin: [0, 10, 0, 0],
                columns: [
                    bloco("Condições de pagamento", paragrafo(CLAUSULAS.pagamento)),
                    bloco("Prazos e execução", paragrafo(CLAUSULAS.prazos)),
                ],
                columnGap: 18,
            },
            {
                margin: [0, 10, 0, 0],
                columns: [
                    bloco("Garantia", paragrafo(CLAUSULAS.garantia)),
                    bloco("Observações gerais", paragrafo(CLAUSULAS.observacoes)),
                ],
                columnGap: 18,
            },

            // ---------- assinaturas ----------
            // unbreakable impede que a linha de assinatura fique sozinha na pagina seguinte.
            {
                unbreakable: true,
                margin: [0, 30, 0, 0],
                columns: [
                    assinatura(EMPRESA.nome, "Responsável técnico"),
                    assinatura(dados.contratante || "Contratante", "Aceito em – data ___/___/______"),
                ],
                columnGap: 24,
            },
        ],
    };
}