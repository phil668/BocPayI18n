export interface LangData {
  [key: string]: string[] | LangData
}

export type QueryLangResult = {
  tc: string
  sc: string
  en: string
}[]
