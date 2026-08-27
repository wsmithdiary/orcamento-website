import { useState } from "react";
import Campo from "./Campo";
import CampoSelect from "./CampoSelect";
import type { ErrosFormulario, Item } from "../core/tipos";
import validarFormulario from "../core/validacao";
import calcularSubtotal, { calcularTotal } from "../core/calcular";
import { formatarMoeda, formatarQuantidade } from "../core/formatar";

const selectOpcoes = [
    { valor: "", rotulo: "Selecione..." },
    { valor: "m", rotulo: "m (metro linear)" },
    { valor: "m²", rotulo: "m² (metro quadrado)" },
    { valor: "m³", rotulo: "m³ (metro cúbico)" },
];

const AJUDA_NUMERO = "Use vírgula para as casas decimais. Para milhar, escreva sem ponto: 1000";

export default function Formulario() {
    const [itens, setItens] = useState<Item[]>([]);
    const [erros, setErros] = useState<ErrosFormulario>({});

    const [descricao, setDescricao] = useState('');
    const [unidadeDeMedida, setUnidadeDeMedida] = useState('');
    const [precoUnitario, setPrecoUnitario] = useState('');
    const [quantiaTotal, setQuantiaTotal] = useState('');

    const total = calcularTotal(itens);

    function adicionarServico() {
        const resultado = validarFormulario({
            descricao,
            unidadeDeMedida,
            precoUnitario,
            quantiaTotal,
        });

        if (!resultado.ok) {
            setErros(resultado.erros);
            return;
        }

        const { campos } = resultado;

        const novoItem: Item = {
            id: Date.now().toString(),
            descricao: campos.descricao,
            unidadeDeMedida: campos.unidadeDeMedida,
            precoUnitario: campos.precoUnitario,
            quantiaTotal: campos.quantiaTotal,
            subtotal: calcularSubtotal(campos.precoUnitario, campos.quantiaTotal),
        };

        setItens([...itens, novoItem]);
        setDescricao('');
        setUnidadeDeMedida('');
        setPrecoUnitario('');
        setQuantiaTotal('');
        setErros({});
    }

    return (
        <>
            <form
                className='flex flex-col w-2/3 gap-2'
            >
                <Campo
                    label="DESCRIÇÃO DO SERVIÇO:"
                    erro={erros.descricao}
                    onChange={setDescricao}
                    value={descricao}
                    required
                />
                <CampoSelect
                    erro={erros.unidadeDeMedida}
                    label="UNIDADE DE MEDIDA:"
                    value={unidadeDeMedida}
                    onChange={setUnidadeDeMedida}
                    opcoes={selectOpcoes}
                    required
                />
                <Campo
                    erro={erros.precoUnitario}
                    label="PREÇO POR UNIDADE:"
                    title={AJUDA_NUMERO}
                    placeholder="0,00"
                    value={precoUnitario}
                    onChange={setPrecoUnitario}
                    type="text"
                    inputMode="decimal"
                    required
                />
                <Campo
                    erro={erros.quantiaTotal}
                    label="MEDIDA TOTAL:"
                    title={AJUDA_NUMERO}
                    placeholder="0,00"
                    value={quantiaTotal}
                    onChange={setQuantiaTotal}
                    type="text"
                    inputMode="decimal"
                    required
                />
                <button
                    className="border border-amber-200 bg-amber-600 p-1"
                    type="button"
                    onClick={adicionarServico}
                >
                    ADICIONAR
                </button>
            </form>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-amber-400">
                Itens
            </h2>
            <ul className="min-w-3/4 flex flex-col divide-y divide-gray-700 rounded-lg bg-gray-800">
                {itens.map((item) => (
                    <li
                        key={item.id}
                    >
                        <span
                            className="flex justify-between font-medium text-gray-100 p-2"
                        >
                            <span>
                                {item.descricao.toUpperCase()}
                            </span>
                            <span className="font-normal text-amber-300">
                                {formatarQuantidade(item.quantiaTotal)} {item.unidadeDeMedida}
                                {' '}× {formatarMoeda(item.precoUnitario)}
                                {' '}= {formatarMoeda(item.subtotal)}
                            </span>
                        </span>
                        <div className="flex shrink-0 gap-2">
                            {/* editar/remover: reaproveitar bg-amber-600 hover:bg-amber-700 text-gray-900 border border-amber-400, mesmo padrão dos outros botões */}
                        </div>
                    </li>
                ))}
            </ul>
            <h2>TOTAL: {formatarMoeda(total)}</h2>
        </>
    );
}