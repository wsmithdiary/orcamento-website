import './Formulario.css';
import { useState } from "react";
import Campo from "./Campo";
import CampoSelect from "./CampoSelect";

type Servico = {
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
        { valor: "M", rotulo: "m (metro linear)" },
        { valor: "M2", rotulo: "m² (metro quadrado)" },
        { valor: "M3", rotulo: "m³ (metro cúbico)" },
    ];

    function adicionarServico() {
        const novoServico: Servico = {
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
        <>
            <form
                className='form'
            >
                <Campo
                    label="Serviço"
                    onChange={setServico}
                    value={servico}
                />
                <CampoSelect
                    label="Unidade de medida"
                    value={unidade}
                    onChange={setUnidade}
                    opcoes={selectOpcoes}
                />
                <Campo
                    label="Preço unitário"
                    step="0.01"
                    min="0"
                    value={valorPorUnidade}
                    onChange={setValorPorUnidade}
                    type="number"
                />
                <Campo
                    label="Quantidade"
                    onChange={setQuantiaTotal}
                    value={quantiaTotal}
                    type="number"
                    step="0.01"
                    min="0"
                />
                <button
                    type="button"
                    onClick={adicionarServico}
                >
                    Adicionar
                </button>
            </form>
        </>
    );
}