import * as vscode from 'vscode'
import type { LangData } from './types'

function getFilePath() {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri
  if (!workspaceFolder) {
    // vscode.window.showErrorMessage('未找到BocPay国际化文件')
    console.warn('未找到BocPay国际化文件')
    return null
  }

  const langFilePath = vscode.Uri.joinPath(workspaceFolder, 'lang', 'mergedKeys.json')
  return langFilePath
}

/**
 * 读取国际化文件的内容
 * @returns
 */
export async function getLangData(): Promise<{ data: LangData, text: string, langFile: vscode.TextDocument } | null> {
  const langFilePath = getFilePath()

  if (!langFilePath) {
    return null
  }

  const langFile = await vscode.workspace.openTextDocument(langFilePath)

  if (!langFile) {
    // vscode.window.showErrorMessage('未找到BocPay国际化文件')
    console.warn('未找到BocPay国际化文件')
    return null
  }
  const text = langFile.getText()
  try {
    return {
      data: JSON.parse(text),
      text,
      langFile,
    }
  }
  catch (error) {
    // eslint-disable-next-line no-console
    console.log('error', error)
    vscode.window.showErrorMessage('解析国际化文件出错')
  }

  return null
}
