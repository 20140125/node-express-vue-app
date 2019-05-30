const state= {
    tabs: [{label:'欢迎页',name:'/admin/index'}],
    currTabs: {label:null,name:null},
    activeAuthName:'/admin/index',
    contentVisible:true,
};
const getters={
    tabs:state=>state.tabs,
    currTabs:state=>state.currTabs,
    activeAuthName:state=>state.activeAuthName,
    contentVisible:state=>state.contentVisible
};
const mutations={
    /**
     * todo：设置tabs
     * @param state
     * @param tabs
     */
    setTabs(state,tabs){
        state.tabs.push(tabs);
    },
    /**
     * todo：设置当前tabs Obj
     * @param state
     * @param currTabs
     */
    setCurrTabs(state,currTabs){
        state.currTabs = currTabs
    },
    /**
     * todo：设置当前tabs
     * @param state
     * @param activeAuthName
     */
    setActiveAuthName(state,activeAuthName){
        state.activeAuthName = activeAuthName;
        state.contentVisible = true;
    },
    /**
     * todo：移除tabs
     * @param state
     * @param tabs
     */
    delTabs(state,tabs){
        state.tabs = tabs;
    }
};
const actions={
    /**
     * todo：添加tabs
     * @param state
     * @param commit
     * @param tabs
     */
    addTabs({state,commit},tabs) {
        if(JSON.stringify(state.tabs).indexOf(JSON.stringify(tabs))===-1) {
            commit('setTabs', tabs);
        }
    },
    /**
     * todo：设置当前tabs
     * @param state
     * @param commit
     * @param currTabs
     */
    addCurrTabs({state,commit},currTabs){
        commit('setCurrTabs', currTabs);
        commit('setActiveAuthName',currTabs.label)
    },
    /**
     * todo：删除tabs
     * @param state
     * @param commit
     * @param tabName
     */
    deleteTabs({state,commit},tabName) {
        let index = 0;
        for (let i in state.tabs){
            if (tabName === state.tabs[i].name){
                index  = i;
            }
        }
        state.tabs.splice(index,1);
        commit('delTabs',state.tabs);
    },
};
export default {
    state,
    getters,
    mutations,
    actions
}