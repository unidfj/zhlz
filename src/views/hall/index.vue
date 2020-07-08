<template>
    <div class="page">
        <m-header title="大厅"></m-header>
        <section class="body">
            
            <ul>
                <li v-for="(v,i) in list" :key="i" @click="goTo(v.route)">
                    <!-- <img :src="v.src" alt=""> -->
                    <img :src="v.src" alt="">
                </li>
            </ul>

        </section>
    <m-Footer></m-Footer>
    </div>
</template>
<script>
import {Base} from '@/server/server.js';
import {mapGetters} from 'vuex';
import {Util} from '@/assets/commonjs/utils.js'
export default {
    name:"invite",
    data(){
        return {
            list:[
                {
                    title:'交易大厅',
                    src:require('@/assets/images/gzlz/01.png'),
                    route:'Sell'
                },
                {
                    title:'矿机商城',
                    src:require('@/assets/images/gzlz/02.png'),
                    route:'KJ'
                },
                {
                    title:'交易大厅',
                    src:require('@/assets/images/gzlz/03.png'),
                    route:''
                },
            ],
            list2:[],
        }
    },
    mounted(){
        this.initData();
        this.getZhImg();
    },
    computed:{
        ...mapGetters(['uid','userInfo','api',])
    },
    methods:{
        initData(){
            
        },
        goTo(route){
            console.log('route',route)
            if(!route){
                mui.toast('暂未开放')
                return
            }
            sessionStorage.setItem('btmNav2',1)
            this.$router.push({name:route})
        },
        getZhImg(){
            Base.getZhImg().then(res=>{
                if(res.code==1){
                    // this.list2 = res.data.body;
                    if(res.data.body){
                        (res.data.body).forEach((v,i)=>{
                            this.list[i].src = v;
                        })
                    }
                    console.log('list',this.list)
                }else{
                    mui.toast(res.msg)
                }
            })
        },
    }
}
</script>
<style lang="less" scoped>
@import '~link-less';
.body {
    background-color: @bg-color;
    >ul{
        width: 690px;
        margin: 74px 30px;
        li{
            margin-bottom: 30px;
            height: auto;
            width: 100%;
            img{
                width: 100%;
            }
        }
    }
}
</style>
