import {DictData} from "/@/types/dict";
import { store } from '/@/store';

export enum DICT_TYPE {
  VERIFY_VERSION_STORE_TYPE = "verify_version_store_type",
  COMMON_STATUS = "common_status",
  SYS_YES_NO = "sys_yes_no",
}

export function getDictDatas(dictType:string) {
  return store.state.dict.dictMap[dictType] || []
}

export const getDictOptions = (dictType: string) => {
  const dictOptions: DictData[] = []
  const list = store.state.dict.dictMap[dictType]
  if (!list || list.length <= 0) {
    return dictOptions
  }
  list.forEach((dict: DictData) => {
    if (dict.dictType + '' === dictType) {
      dictOptions.push(dict)
    }
  })
  return dictOptions
}

export const getIntDictOptions = (dictType: string) => {
  const dictOptions: DictData[] = []
  store.state.dict.dictMap[dictType].forEach((dict: DictData) => {
    if (dict.dictType + '' === dictType) {
      dictOptions.push({
        ...dict,
        dictValue: parseInt(dict.dictValue + '')
      })
    }
  })
  return dictOptions
}

