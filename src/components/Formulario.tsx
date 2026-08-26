import { useState } from "react";
import Campo from "./Campo";
import CampoSelect from "./CampoSelect";

type Servico = {
    id: string,
    descricao: string,
    unidade: string,
    precoUnitario: number,
    quantidade: number
}

export default function Formulario() {
    const [servicos, setServicos] = useState<Servico[]>([]);
    const [servico, setServico] = useState('');
    const [unidade, setUnidade] = useState('');
    const [valorPorUnidade, setValorPorUnidade] = useState('');
    const [quantiaTotal, setQuantiaTotal] = useState('');

    const selectOpcoes = [
        { valor: "", rotulo: "Selecione..." },
        { valor: "M", rotulo: "m (metro linear)" },
        { valor: "M2", rotulo: "m² (metro quadrado)" },
        { valor: "M3", rotulo: "m³ (metro cúbico)" },
    ];

    function adicionarServico() {
        const novoServico: Servico = {
            id: crypto.randomUUID(),
            descricao: servico,
            unidade,
            precoUnitario: Number(valorPorUnidade),
            quantidade: Number(quantiaTotal),
        }

        setServicos([...servicos, novoServico]);
        setServico('');
        setUnidade('');
        setValorPorUnidade('');
        setQuantiaTotal('');
    }
    return (
        <div
            className="flex flex-col items-center w-full h-full gap-12 font-bold"
        >
            <form
                className='flex flex-col w-2/3 gap-2'
            >
                <Campo
                    label="DESCRIÇÃO DO SERVIÇO:"
                    onChange={setServico}
                    value={servico}
                />
                <CampoSelect
                    label="UNIDADE DE MEDIDA:"
                    value={unidade}
                    onChange={setUnidade}
                    opcoes={selectOpcoes}
                />
                <Campo
                    label="PREÇO POR UNIDADE:"
                    step="0.01"
                    min="0"
                    value={valorPorUnidade}
                    onChange={setValorPorUnidade}
                    type="number"
                />
                <Campo
                    label="MEDIDA TOTAL:"
                    onChange={setQuantiaTotal}
                    value={quantiaTotal}
                    type="number"
                    step="0.01"
                    min="0"
                />
                <button
                    className="border border-amber-200 bg-amber-600 p-1"
                    type="button"
                    onClick={adicionarServico}
                >
                    Adicionar
                </button>
            </form>
            <div>
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-amber-400">
                    Itens
                </h2>
                <ul className="flex flex-col divide-y divide-gray-700 rounded-lg border border-amber-400 bg-gray-800">
                    {servicos.map((s) => (
                        <li
                            key={s.id}
                            className="flex items-center justify-between gap-4 p-3"
                        >
                            <span className="font-medium text-gray-100">
                                {s.descricao.toUpperCase()}{' '}
                                <span className="font-normal text-amber-300">
                                    — {s.quantidade.toFixed(2)} {s.unidade} × R$ {s.precoUnitario.toFixed(2)}
                                </span>
                            </span>
                            <div className="flex shrink-0 gap-2">
                                {/* editar/remover: reaproveitar bg-amber-600 hover:bg-amber-700 text-gray-900 border border-amber-400, mesmo padrão dos outros botões */}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}