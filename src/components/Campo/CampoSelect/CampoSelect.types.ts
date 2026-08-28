// tipagem das propriedades individuais da opção
export type Opcao = {
    valor: string,
    rotulo: string
};

// tipagem das props recebidas pelo CampoSelect
export type Props = Omit<React.ComponentProps<"select">, "onChange"> & {
    erro?: string,
    label: string,
    value: string,
    opcoes: Opcao[],
    onChange: (valor: string) => void,
};