import { useState } from "react";
import Campo from "./Campo";
import CampoSelect from "./CampoSelect";
import { type ErrosFormulario, type CamposFormulario, type Item } from "../core/tipos";
import validarFormulario from "../core/validacao";

const selectOpcoes = [
    { valor: "", rotulo: "Selecione..." },
    { valor: "m (metro linear)", rotulo: "m (metro linear)" },
    { valor: "m² (metro quadrado", rotulo: "m² (metro quadrado)" },
    { valor: "m³ (metro cúbico)", rotulo: "m³ (metro cúbico)" },
];

export default function Formulario() {
    const [items, setItem] = useState<Item[]>([]);
    const [errors, setNewError] = useState<ErrosFormulario>({});

    const [descricao, setDescricao] = useState('');
    const [unidadeDeMedida, setUnidadeDeMedida] = useState('');
    const [precoUnitario, setPrecoUnitario] = useState('');
    const [quantiaTotal, setQuantiaTotal] = useState('');


    function adicionarServico() {
        const campos: CamposFormulario = {
            descricao,
            unidadeDeMedida,
            precoUnitario,
            quantiaTotal
        };

        const validacao: ErrosFormulario = validarFormulario(campos);

        if (Object.keys(validacao).length > 0) {
            setNewError(validacao);
            return
        }

        const novoItem: Item = {
            id: Date.now().toString(),
            descricao,
            unidadeDeMedida,
            precoUnitario,
            quantiaTotal
        }

        setItem([...items, novoItem]);

        setDescricao('');
        setUnidadeDeMedida('');
        setPrecoUnitario('');
        setQuantiaTotal('');
        setNewError({})
    }
    return (
        <>
            <form
                className='flex flex-col w-2/3 gap-2'
            >
                <Campo
                    erro={errors.descricao}
                    label="DESCRIÇÃO DO SERVIÇO:"
                    onChange={setDescricao}
                    value={descricao}
                    required
                />
                <CampoSelect
                    erro={errors.unidadeDeMedida}
                    label="UNIDADE DE MEDIDA:"
                    value={unidadeDeMedida}
                    onChange={setUnidadeDeMedida}
                    opcoes={selectOpcoes}
                    required
                />
                <Campo
                    erro={errors.precoUnitario}
                    label="PREÇO POR UNIDADE:"
                    step="0.01"
                    min="0"
                    value={precoUnitario}
                    onChange={setPrecoUnitario}
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]+([.,][0-9]+)?"
                    required
                />
                <Campo
                    erro={errors.quantiaTotal}
                    label="MEDIDA TOTAL:"
                    title="Digite apenas números decimais (ex: 10.5 ou 10,5)"
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]+([.,][0-9]+)?"
                    onChange={setQuantiaTotal}
                    value={quantiaTotal}
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
                {items.map((s) => (
                    <li
                        key={s.id}

                    >
                        <span
                            className="flex justify-between font-medium text-gray-100 p-2"
                        >
                            <span>
                                {s.descricao.toUpperCase()}
                            </span>
                            <span className="font-normal text-amber-300">
                                {`${s.quantiaTotal} ${s.unidadeDeMedida}`}{' '}× R$ {s.precoUnitario}
                            </span>
                        </span>
                        <div className="flex shrink-0 gap-2">
                            {/* editar/remover: reaproveitar bg-amber-600 hover:bg-amber-700 text-gray-900 border border-amber-400, mesmo padrão dos outros botões */}
                        </div>
                    </li>
                ))}
            </ul>
        </>
    );
}