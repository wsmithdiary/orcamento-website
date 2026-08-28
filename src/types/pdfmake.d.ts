/** O vfs_fonts e arquivo gerado e nao vem tipado no @types/pdfmake. */
declare module "pdfmake/build/vfs_fonts" {
    const conteudo: { vfs: Record<string, string> };
    export default conteudo;
}