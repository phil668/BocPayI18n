import * as vscode from 'vscode'
import { getLangData } from './load-lang-file'

function findTextInDocument(document: vscode.TextDocument, text: string): { line: number, character: number } | undefined {
  const lines = document.getText().split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const index = line.indexOf(text)
    if (index !== -1) {
      return { line: i, character: index }
    }
  }
  return undefined
}

export async function findAndHighlight(str: string) {
  const document = vscode.window.activeTextEditor?.document
  if (!document) {
    return
  }
  const langDataRes = await getLangData()
  if (!langDataRes) {
    return
  }
  const { langFile } = langDataRes

  const textPosition = findTextInDocument(langFile, str)
  if (textPosition) {
    // 跳转到指定位置并高亮
    const range = new vscode.Range(textPosition.line, textPosition.character, textPosition.line, textPosition.character + str.length)
    vscode.window.showTextDocument(langFile).then((editor) => {
      editor.selection = new vscode.Selection(range.start, range.end)
      editor.revealRange(range, vscode.TextEditorRevealType.InCenter)
    })
  }
  else {
    vscode.window.showErrorMessage('未找到文本')
  }
}
