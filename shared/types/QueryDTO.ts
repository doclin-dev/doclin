export interface QueryDTO {
  [key: string]: undefined | string | string[] | QueryDTO | QueryDTO[];
}
