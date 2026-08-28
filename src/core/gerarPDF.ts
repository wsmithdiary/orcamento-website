import type { Item } from "../components/ItemsList/ItemsList.type";
import { montarDocumento } from "./documento";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import type { DadosCliente } from "../components/DadosCliente/DadosCliente.type";


// ============================================================
// O unico arquivo que fala com a biblioteca e baixa arquivo.
// Toda a logica de montagem esta em documento.ts com algoritmo puro.
// ============================================================

// vfs e o sistema de arquivos virtual do pdfmake: e de onde ele le a fonte embutida (Roboto).

/** Numero no formato ANO/XXXX. Vem do relogio - nao e sequencial de verdade. */
function gerarNumero(data: Date) {
    const marca = data.getTime().toString().slice(-4);
    return `${data.getFullYear()}/${marca}`;
}

/** Monta a definição e dispara o download no navegador. */
export function gerarPdf(itens: Item[], dados: DadosCliente) {
    const emissao = new Date();
    const numero = gerarNumero(emissao);

    const definicao = montarDocumento(itens, dados, numero, emissao);

    // A barra do número não pode ir para o nome do arquivo: e separador de caminho.
    const nomeArquivo = `orcamento-${numero.replace("/", "-")}.pdf`;

    // A fonte embutida (vfs) entra como quarto argumento. Atribuir em pdfMake.vfs
    // funcionaria em execução, mas a tipagem oficial não declara essa propriedade.
    pdfMake.createPdf(definicao, pdfFonts.vfs).download(nomeArquivo);
}