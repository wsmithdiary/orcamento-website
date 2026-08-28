// ======================================================================
// Dados fixos da empresa e padroes do orcamento.
// Unico arquivo a editar quando mudar telefone, CNPJ ou clausula.
// ======================================================================

/** Identificacao que aparece no cabecalho do PDF. */
export const EMPRESA = {
    nome: "Alicerce Empreiteira",
    slogan: "A fundação do seu futuro começa aqui",
    cnpj: "77.777.777/7771-77",
    inscricao: "000000",
    endereco: "Rua Exemplo, 000 - São Paulo/SP",
    telefone: "(19)70000-0000",
    email: "contato@alicerce.com.br"
};

/** Margem sobre o custo de mao de obra, em porcento. Campo vazio no formulario usa este valor. */
export const BDI_PADRAO = 22;

/** Quantos dias a proposta vale a partir da emissao. */
export const VALIDADE_DIAS = 15;

// ----------------------------------------------------------------------
// Clauslas do orcamento.
// Cada bloco existe para evitar uma discussao especifica com o cliente.
// ----------------------------------------------------------------------
export const CLAUSULAS = {
    /** Evita a cobranca de servicos que o cliente supos estarem no preco. */
    incluido: [
        "Mão de obra especializada e ajudantes.",
        "Ferramentas e equipamentos de uso da equipe.",
        "EPI da equipe e cumprimento da NR-18 e NR-35",
        "Limpeza grossa ao término de cada etapa.",
        "Encargos trabalhistas e previdenciários da equipe.",
    ],

    /** O oposto: deixa explicito o que fica por conta do contratante. */
    excluido: [
        "Materiais de construção e acabamento.",
        "Projetos, ART/RRT e taxas junto à prefeitua.",
        "Contêiner de entulho e sua remoção.",
        "Água e energia da obra, por conta do contratante",
        "Serviços não descritos na tabela acima.",
    ],

    pagamento:
        "30% na assinatura, 40% na conclusão da etapa intermediária e 30% na entrega, mediante vistoria. Pagamento por PIX ou transferência até 3 dias úteis após cada medição. Atraso superior a 15 dias suspende os serviços até regularização.",
    prazos:
        "Início em até 5 dias útei após o aceite e a liberação do local. O prazo não considera chuvas, falta de material do contratante ou embargos. Jornada de segunda a sexta, das 8h às 17h.",

    /** O prazo de 5 anos ja vale por lei; escrever aqui so deixa claro para as duas partes. */
    garantia:
        "5 anos para a solidez e seguraça dos serviços executados, conforme o art. 618 do Código Civil. 90 dias para vícios aparentes de acabamento. A garantia não cobre danos por mau uso, intervenção de terceiros ou falha de material fornecido pelo contratante.",

    /** A clausula de aditivo cobre o caso da medida em obra divergir do levantamento. */
    observacoes:
        "Quantidades levantadas em vistoria; divergências medidas em obra geram aditivo por escrito antes da execução. Este documento é proposta comercial e não vale como contrato. Após a validade, os preços serão revistos pela tabela vigente."
};