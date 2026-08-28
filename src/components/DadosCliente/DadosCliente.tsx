import { useId, useState } from "react";
import Campo from "../Campo/Campo";
import type { DadosCliente } from "./DadosCliente.type";

type Props = {
    dados: DadosCliente;
    onChange: (dados: DadosCliente) => void;
};

// ============================================================
// Secao sanfonada no topo da tela.
// Fechada por padrao: estes dados sao preenchidos uma vez por orcamento,
// enquanto os itens sao adicionados dezenas de vezes.
// ============================================================

/**
 * Formulario dos dados que vao para o cabecalho do PDF.
 *
 * @param dados - Estado atual, vindo do App.
 * @param onChange - Recebe o objeto inteiro ja atualizado, nao apenas o campo alterado.
 */
export default function DadosDoCliente({ dados, onChange }: Props) {
    const [aberto, setAberto] = useState(false);

    // Liga o botao ao painel para o leitor de tela saber o que expande.
    const idPainel = useId();

    /** Devolve um onChange para um campo especifico, sem repetir o spread em cada input. */
    function alterar(campo: keyof DadosCliente) {
        return (valor: string) => onChange({ ...dados, [campo]: valor });
    }

    return (
        <section className="border-b border-tinta-100 bg-base-50">
            {/* Cabecalho clicavel. Fechado, resume o conteudo pelo nome do contratante. */}
            <button
                type="button"
                onClick={() => setAberto((estava) => !estava)}
                aria-expanded={aberto}
                aria-controls={idPainel}
                className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
                <span>
                    <span className="block text-xs uppercase tracking-wide text-tinta-300">
                        Dados do orçamento
                    </span>
                    <span
                        className={
                            dados.contratante
                                ? "block text-sm font-medium text-tinta-900"
                                : "block text-sm text-tinta-300"
                        }
                    >
                        {dados.contratante || "Não informado"}
                    </span>
                </span>

                {/* Seta decorativa: o texto do botao ja diz o que ele faz. */}
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className={`shrink-0 text-marca-700 ${aberto ? "rotate-180" : ""}`}
                >
                    <path d="M6 9l6 6 6-6" />
                </svg>
            </button>

            {/* O painel sai do DOM quando fechado. Campo escondido por CSS continua alcancavel por Tab. */}
            {aberto && (
                <div id={idPainel} className="border-t border-base-200 px-4 pb-4 pt-3">
                    <Campo
                        label="Contratante"
                        value={dados.contratante}
                        onChange={alterar("contratante")}
                    />

                    <div className="grid grid-cols-2 gap-3">
                        <Campo
                            label="CPF ou CNPJ"
                            value={dados.documento}
                            onChange={alterar("documento")}
                        />
                        <Campo
                            label="Telefone"
                            value={dados.telefone}
                            onChange={alterar("telefone")}
                            inputMode="tel"
                        />
                    </div>

                    <Campo
                        label="Endereço da obra"
                        value={dados.enderecoObra}
                        onChange={alterar("enderecoObra")}
                    />

                    <Campo
                        label="Objeto"
                        placeholder="Reforma residencial – 2 pavimentos"
                        value={dados.objeto}
                        onChange={alterar("objeto")}
                    />

                    <div className="grid grid-cols-2 gap-3">
                        <Campo
                            label="Prazo estimado"
                            placeholder="18 dias úteis"
                            value={dados.prazoEstimado}
                            onChange={alterar("prazoEstimado")}
                        />
                        <div>
                            <Campo
                                label="BDI (%)"
                                placeholder="22"
                                value={dados.bdi}
                                onChange={alterar("bdi")}
                                inputMode="decimal"
                            />
                            <p className="text-xs text-tinta-300">Vazio usa 22%</p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}