import { defineExtension, useCommand, useDisposable } from 'reactive-vscode'
import * as vscode from 'vscode'
import type { LangData } from './types'
import { findLangDataByKey } from './utils'
import { findAndHighlight } from './find-highlight'
import { getLangData } from './load-lang-file'
import { includeFiles } from './config'

const { activate, deactivate } = defineExtension(async () => {
  let langObj = await getLangData()
  if (!langObj) {
    return
  }

  let curSelection: vscode.Selection | null = null

  vscode.window.onDidChangeTextEditorSelection((e) => {
    if (!e.selections.length) {
      return
    }
    curSelection = e.selections[0]
  })

  const hoverProvider: vscode.HoverProvider = {
    provideHover(document, position) {
      if (!curSelection || !langObj) {
        return
      }
      if (!(position.line <= curSelection.end.line && position.line >= curSelection.start.line) || !(position.character <= curSelection.end.character && position.character >= curSelection.start.character)) {
        return
      }
      const selectionText = document.getText(new vscode.Range(curSelection.start, curSelection.end))
      if (document.getText(curSelection) === selectionText) {
        const result = findLangDataByKey(selectionText, langObj.data)
        if (!result) {
          return
        }
        return new vscode.Hover(
          new vscode.MarkdownString(
            result.map((item, index) => {
              return `
${result.length > 1 ? `${index + 1}. \n` : ''}
* **繁体**：${item.tc}
* **简体**：${item.sc}
* **英文**：${item.en}
            `
            }).join('\n'),
          ),
        )
      }
      return null
    },
  }

  useDisposable(vscode.languages.registerHoverProvider(includeFiles, hoverProvider))

  useDisposable(vscode.workspace.onDidChangeTextDocument(async (e) => {
    const uri = e.document.uri
    if (uri.path === langObj?.langFile.uri.path) {
      const newLangObj = await getLangData()
      if (newLangObj) {
        langObj = newLangObj
      }
    }
  }))

  useCommand('BocPayI18n.hoverAndJump', () => {
    if (!curSelection) {
      return
    }
    const curText = vscode.window.activeTextEditor?.document.getText(new vscode.Range(curSelection.start, curSelection.end))
    if (!curText) {
      return
    }
    findAndHighlight(curText)
  })
})

export { activate, deactivate }
