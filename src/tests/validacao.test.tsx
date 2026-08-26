import { describe, expect, test } from "vitest";
import validarFormulario from "../core/validacao";
import type { CamposFormulario } from "../core/tipos";

const camposValidos: CamposFormulario = {
    descricao: 'Assentamento de piso',
    unidadeDeMedida: 'M2',
    precoUnitario: '34.54',
    quantiaTotal: '100'
}

describe('Testa a função "validarFormulario"', () => {
    test('Não retorna erro quando todos os campos são válidos', () => {
        const erros = validarFormulario(camposValidos);
        expect(Object.keys(erros)).toHaveLength(0);
    });

    test('Acusa preço vazio', () => {
        const erros = validarFormulario({ ...camposValidos, precoUnitario: '' });
        expect(erros.precoUnitario).toBeDefined();
    });

    test('Acusa descrição vazia no campo certo', () => {
        const erros = validarFormulario({ ...camposValidos, descricao: '   ' });
        expect(erros.descricao).toBeDefined();
        expect(erros.precoUnitario).toBeUndefined();
    })

    test('Aceita preço com vírgula decimal', () => {
        const erros = validarFormulario({ ...camposValidos, precoUnitario: '10,50' });
        expect(erros.precoUnitario).toBeUndefined();
    })

    test('Acusa preço não numérico', () => {
        const erros = validarFormulario({ ...camposValidos, precoUnitario: 'abc' });
        expect(erros.precoUnitario).toBeDefined();
    })

    test('Acusa preço zerado', () => {
        const erros = validarFormulario({ ...camposValidos, precoUnitario: '0' });
        expect(erros.precoUnitario).toBeDefined();
    })
})