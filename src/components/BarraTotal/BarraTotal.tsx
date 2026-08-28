import type Decimal from "decimal.js";
import { formatarMoeda } from "../../core/formatar";
import { IconePdf } from "../Icones/Icones";

type BarraTotalProps = {
    total: Decimal;
    /** Percentual efetivamente aplicado, para o usuario conferir antes de gerar. */
    bdi: Decimal;
    /** Falso quando nao ha item: gerar PDF vazio nao faz sentido. */
    podeExportar: boolean;
    onExportar: () => void;
};

// ============================================================
// Fica colada no rodape da janela, sobre a lista.
// O total precisa estar visivel enquanto o usuario adiciona itens.
// Exige pb-24 no <main>, senao a barra tampa o ultimo cartao.
// ============================================================
export default function BarraTotal({ total, bdi, podeExportar, onExportar }: BarraTotalProps) {
    return (
        <div className="fixed inset-x-0 bottom-0 z-10 flex items-center justify-between gap-3 border-t border-marca-200 bg-marca-50 px-4 py-3">
            <div>
                <p className="text-xs text-marca-900">Total com BDI {bdi.toString()}%</p>
                <p className="text-xl font-medium tabular-nums text-marca-900">
                    {formatarMoeda(total)}
                </p>
            </div>

            <button
                type="button"
                onClick={onExportar}
                disabled={!podeExportar}
                className="flex items-center gap-2 rounded-md bg-marca-700 px-4 py-2.5 text-sm font-medium text-base-50 hover:bg-marca-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
                <IconePdf />
                PDF
            </button>
        </div>
    );
}