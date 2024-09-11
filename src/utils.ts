import type { LangData, QueryLangResult } from './types'

export function findLangDataByKey(key: string, data: LangData) {
  const result: QueryLangResult = []
  const DEFAULT_TEXT = '未找到当前语言词条'
  if (data[key] !== undefined && Array.isArray(data[key])) {
    result.push({
      tc: data[key]?.[0] ?? DEFAULT_TEXT,
      sc: data[key]?.[1] ?? DEFAULT_TEXT,
      en: data[key]?.[2] ?? DEFAULT_TEXT,
    })
    return result
  }

  function traverse(data: LangData) {
    for (const k in data) {
      const item = data[k]
      if (item && Array.isArray(item) && k === key) {
        result.push({
          tc: item?.[0] ?? DEFAULT_TEXT,
          sc: item?.[1] ?? DEFAULT_TEXT,
          en: item?.[2] ?? DEFAULT_TEXT,
        })
      }
      else if (typeof item === 'object' && !Array.isArray(item)) {
        traverse(item)
      }
    }
  }

  traverse(data)

  return result
}
