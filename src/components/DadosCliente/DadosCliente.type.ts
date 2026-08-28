// ============================================================
// Dados que so aparecem no cabecalho do PDF.
// Nao entram no calculo dos itens — por isso ficam separados do Item.
// ============================================================

/** Todos os campos sao string porque vem direto do input; a conversao acontece na hora de usar. */
export type DadosCliente = {
    contratante: string;
    documento: string;
    telefone: string;
    enderecoObra: string;
    objeto: string;
    prazoEstimado: string;
    bdi: string;
};

/** Estado inicial. O BDI nasce vazio de proposito: vazio significa "usa o padrao". */
export const DADOS_CLIENTE_VAZIO: DadosCliente = {
    contratante: "",
    documento: "",
    telefone: "",
    enderecoObra: "",
    objeto: "",
    prazoEstimado: "",
    bdi: "",
};