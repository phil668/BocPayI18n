import { describe, expect, it } from 'vitest'
import { findLangDataByKey } from '../src/utils'

describe('should', () => {
  it('exported', () => {
    const data = {
      編輯: ['編輯', '编辑', 'Edit'],
      儲存圖片: ['儲存圖片', '""', '""'],
      登出: ['登出', '注销', 'Logout'],
      activate: {
        'activate.成功確認信用卡': ['成功確認信用卡', '确认成功', 'Successful Activation'],
      },
    }
    const res = findLangDataByKey('activate.成功確認信用卡', data)
    expect(res?.length).toBe(1)
    expect(res?.[0].en).toEqual('Successful Activation')

    const res2 = findLangDataByKey('編輯', data)
    expect(res2?.length).toBe(1)
    expect(res2?.[0].en).toEqual('Edit')
  })
})
