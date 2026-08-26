import type { CamposFormulario } from "./tipos";
import type { ErrosFormulario } from "./tipos";

export default function validarFormulario(campos: CamposFormulario): ErrosFormulario {
    const erros: ErrosFormulario = {}

    if (campos.descricao.trim() === '') {
        erros.descricao = 'A descrição do serviço é obrigatória';
    }

    if (campos.unidadeDeMedida.trim() === '') {
        erros.unidadeDeMedida = 'É preciso selecionar a unidade de medida'
    }


    if (campos.precoUnitario.trim() === '') {
        erros.precoUnitario = 'Preço unitário é obrigatório';
    } else {
        const preco = Number(campos.precoUnitario.replace(',', '.'));
        if (Number.isNaN(preco)) {
            erros.precoUnitario = 'Preço unitário deve conter apenas números';
        } else if (preco <= 0) {
            erros.precoUnitario = 'Preço deve ser maior que zero';
        }
    }

    if (campos.quantiaTotal.trim() === '') {
        erros.quantiaTotal = 'A quantia total é obrigatória';
    } else {
        const quantia = Number(campos.quantiaTotal.replace(',', '.'));
        if (Number.isNaN(quantia)) {
            erros.quantiaTotal = 'A quanta total tem de ser um número'
        } else if (quantia <= 0) {
            erros.quantiaTotal = 'A quantidade total tem de ser maior que zero'
        }
    }

    return erros;
}