import { useId } from "react";
import type { Props } from "./CampoSelect.types";

export default function CampoSelect({ value, label, onChange, opcoes, erro, ...resto }: Props) {
    // gera id único
    const id = useId();

    // componente
    return (
        <label
            htmlFor={id}
            className="flex flex-col text-tinta-500 gap-2 text-xs"
        >
            {label}
            <select
                {...resto}
                className={`border ${erro ? "border-perigo-600" : "border-tinta-100"} rounded-md bg-base-100 px-1.5 py-1.5`}
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                aria-invalid={Boolean(erro)}
                aria-describedby={erro ? `${id}-erro` : undefined}
            >
                {
                    opcoes.map(
                        (opcao) => (
                            <option
                                key={opcao.valor}
                                value={opcao.valor}
                            >
                                {opcao.rotulo}
                            </option>
                        )
                    )
                }
            </select>
            {
                erro && (
                    <span
                        id={`${id}-erro`}
                        role="alert"
                        className="text-perigo-600 text-xs"
                    >
                        {erro}
                    </span>
                )
            }
        </label>
    )
}