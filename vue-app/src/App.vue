<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: 'App'
    }
</script>

<style>
    #app {
        font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }
    .CodeMirror {
        border: 1px solid #eee;
        height: auto;
    }
    .CodeMirror-scroll {
        height: auto;
        min-height: 700px;
        max-height: 1000px;
        overflow-y: hidden;
        overflow-x: auto;
    }
    .menu__item {
        display: block;
        text-align: center;
        margin-top: 10px;
        margin-right: 33px;
    }
    .menu {
        padding-bottom: 10px;
        width: 80px;
        position: absolute;
        border-radius: 5px;
        border: 1px solid #393D49;
        color: #606266;
        background-color: #393D49;
    }
    #menu li:hover {
        background-color: #ffffff;
        color: #606266;
        cursor: pointer;
    }
    a:link{
        text-decoration: none;
    }
</style>
