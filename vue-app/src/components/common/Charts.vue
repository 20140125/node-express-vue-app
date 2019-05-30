<template>
    <div :id="id" style="width: 100%;height: 600px"></div>
</template>

<script>
    import echarts from 'echarts'
    export default {
        name: "Charts",
        props:{
            id:String,
            seriesData:Array,
            legendData:Array,
            legendSelected:Object,
            xAxisData:Array,
            chartsTitle:String
        },
        data(){
            return {
                charts:{},
            }
        },
        methods:{
            //表格初始化
            initCharts:function (id) {
                this.charts = echarts.init(document.getElementById(id));
                this.charts.showLoading();
                this.charts.hideLoading();
                this.charts.setOption({
                    title: {
                        text: this.chartsTitle
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data:this.legendData,
                        selected:this.legendSelected
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: this.xAxisData
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series:this.seriesData,
                })
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.initCharts(this.id)
            })
        }
    }
</script>

<style scoped>

</style>