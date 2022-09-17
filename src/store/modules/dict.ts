import { Module } from 'vuex';
import {DictState, RootStateTypes} from "/@/store/interface";
import {DictData} from "/@/types/dict";

const dictModule: Module<DictState, RootStateTypes> = {
    namespaced: true,
    state: {
        isSetDict: false,
        dictMap: {}
    },
    mutations: {
        GET_DICT_DATAS(state,data:Record<string, any>) {
            state.dictMap = data
        },
        GET_DICT_SET_STATUS(state,data:boolean){
            state.isSetDict = data
        },
    },
    actions: {
        setDictMap({ commit },res) {
            // 获取所有字典数据
            const dictDataMap = {}
            if (res.code === 0 && res.data.list) {
                let list = res.data.list
                list.forEach((dictData:DictData) => {
                    // @ts-ignore
                    const enumValueObj = dictDataMap[dictData.dictType]
                    if (!enumValueObj) {
                        // @ts-ignore
                        dictDataMap[dictData.dictType] = []
                    }
                    // 处理 dictValue 层级
                    // @ts-ignore
                    dictDataMap[dictData.dictType].push(dictData)

                })
            }
            commit('GET_DICT_DATAS',dictDataMap)
        },
        setIsSetDict({ commit },data: boolean) {
            commit('GET_DICT_SET_STATUS',data)
        }
    }
}

export default dictModule
