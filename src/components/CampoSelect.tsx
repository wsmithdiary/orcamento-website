import type React from "react";
import { useId } from "react";

type Opcao = {
    valor: string,
    rotulo: string
}

type Props = Omit<React.ComponentProps<"select">, "onChange"> & {
    label: string,
    value: string,
    erro?: string,
    onChange: (valor: string) => void,
    opcoes: Opcao[]
}

export default function CampoSelect({ value, label, onChange, opcoes, erro, ...resto }: Props) {
    const id = useId();
    return (
        <label
            htmlFor={id}
            className="flex flex-col"
        >
            {label}
            <select
                {...resto}
                className="p-1"
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
                        className="text-perigo-600 text-sm"
                    >
                        {erro}
                    </span>
                )
            }
        </label>
    )
}