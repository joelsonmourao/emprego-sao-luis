import { getImportStorageInfo } from "./import-storage";

/**
 * Com volume local, o arquivo fica no container web. Se a validação/execução
 * for só para o worker sem o mesmo volume montado, o lote falha com
 * "Arquivo não encontrado". Nesse caso processamos no próprio web.
 * Com S3/R2 o objeto é compartilhado — a fila Redis/worker é preferível.
 */
export function shouldProcessImportOnWeb(): boolean {
  return getImportStorageInfo().mode !== "s3";
}
