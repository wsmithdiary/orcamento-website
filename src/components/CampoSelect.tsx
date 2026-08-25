import type React from "react"
import { useId } from "react"

type Opcao = {
    valor: string,
    rotulo: string
}

type Props = Omit<React.ComponentProps<"select">, "onChange"> & {
    label: string,
    value: string,
    onChange: (valor: string) => void,
    opcoes: Opcao[]
}

export default function CampoSelect({ value, label, onChange, opcoes, ...resto }: Props) {
    const id = useId();
    return (
        <label htmlFor={id}>
            {label}
            <select
                {...resto}
                value={value}
                id={id}
                onChange={(e) => onChange(e.target.value)}
            >
                {
                    opcoes.map((opcao) => (
                        <option
                            key={opcao.valor}
                            value={opcao.valor}
                        >
                            {opcao.rotulo}
                        </option>
                    ))
                }
            </select>
        </label>
    )
}