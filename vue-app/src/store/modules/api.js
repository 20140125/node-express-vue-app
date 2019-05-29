const state={
    apiVisible:false,
    interfaceName:'',
    apiModel:{},
};
const getters={
    apiVisible:state=>state.apiVisible,
    interfaceName:state=>state.interfaceName,
    apiModel:state=>state.apiModel
};
const mutations={
    /**
     * todo：api接口显示
     * @param state
     * @param apiVisible
     */
    setApiVisible(state,apiVisible){
        state.apiVisible = apiVisible;
    },
    /**
     * todo：保存当前的接口名称
     * @param state
     * @param interfaceName
     */
    setInterfaceName(state,interfaceName){
        state.interfaceName = interfaceName;
    },
    /**
     * todo：保存当前的apiModel
     * @param state
     * @param apiModel
     */
    setApiModel(state,apiModel){
        state.apiModel = apiModel
    }
};
const actions={
    /**
     * todo：api接口显示
     * @param state
     * @param commit
     * @param obj
     */
    addApiVisible({state,commit},obj) {
        commit('setApiVisible', obj.apiVisible);
        commit('setInterfaceName',obj.interfaceName)
    },
    /**
     * todo：保存当前的apiModel
     * @param state
     * @param commit
     * @param apiModel
     */
    addApiModel({state,commit},apiModel) {
        commit('setApiModel', apiModel);
    },
};
export default {
    state,
    getters,
    mutations,
    actions
}