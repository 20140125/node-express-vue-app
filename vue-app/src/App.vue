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
    a:link{
        text-decoration: none;
    }
</style>
