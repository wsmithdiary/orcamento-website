export type ErrosFormulario = Partial<Record<keyof CamposFormulario, string>>;

export type CamposFormulario = {
    descricao: string,
    unidadeDeMedida: string,
    precoUnitario: string,
    quantiaTotal: string
};

export type Item = {
    id: string,
    descricao: string,
    unidadeDeMedida: string,
    precoUnitario: string,
    quantiaTotal: string
};
