<template>
    <div class="page">
        <m-header title="支付方式" :canback="Boolean(1)"></m-header>
        <section class="body">
            <ul class="card-list">
                <li class="item" @click="bind('ali')">
                    <p class="content"><span>支付宝</span> <span>{{payData&&payData.alipayact?'已绑定':'去绑定'}} <i class="iconfont iconright"></i></span></p>
                </li>
                <li class="item" @click="bind('wechat')">
                    <p class="content"><span>微信</span> <span>{{payData&&payData.wechatact?'已绑定':'去绑定'}}  <i class="iconfont iconright"></i></span></p>
                </li>
                <li class="item bank-item" v-if="payData &&payData.bank">
                    <p>
                        <span class="bank-name">{{payData.bank}}</span><br>
                        <span class="branck">{{payData.bankname}}</span>
                    </p>
                    <p class="num">**** **** ****{{payData.bankact.substr(-4,4)}}</p>
                </li>
                <li class="item" @click="addCard" v-show="payData && !payData.bank">
                    <p class="add"><i class="iconfont iconadd"></i>添加银行卡</p>
                </li>
                
                <li class="item" @click="$router.push({name:'Mobile'})">
                    <p class="content"><span>备用手机号</span> <span>{{mobile2?'已绑定':'去绑定'}}  <i class="iconfont iconright"></i></span></p>
                </li>
            </ul>
        </section>
    </div>
</template>
<script>
import {Owner,Init} from '@/server/server.js';
import {mapGetters} from 'vuex';
import {Secret} from '@/assets/commonjs/utils.js';

export default {
    name:"PayInfo",
    data(){
        return {
            payData:null,
            mobile2:null,
        }
    },
    mounted(){
        this.initData();
        this.getPayInfo(this.uid);
        this.getUser(this.uid)
    },
    computed:{
        ...mapGetters(['uid','stemp'])
    },
    methods:{
        initData(){
            this.$store.commit('saveSTemp',null);
        },
        addCard(){
            this.$router.push({name:'AddCard'})
        },
        /**
         * 去绑定
         */
        bind(type){
            this.$router.push({name:'Bind',params:{type}})
        },
        /**
         * 支付信息
         */
        getPayInfo(id){
            Owner.getPayInfo({id}).then(res=>{
                if(res.code == 1){
                    this.payData = JSON.parse(Secret.decrypt(res.data))[0];
                    localStorage.setItem('stemp',Secret.encrypt(JSON.stringify(this.payData)));
                    console.log(this.payData)
                }else {
                    mui.toast(res.msg);
                    return ;
                }
            })
        },
        
        /**
         * 获取用户信息
         */
        getUser(id){
            Init.getUser({id}).then(res=>{
                if(res.code ==1){
                    // this.info = res.data[0];
                    let info = JSON.parse(Secret.decrypt(res.data))[0];
                    console.log(this.info)
                    this.mobile2 = info.mobile2;
                }else {
                    mui.toast(res.msg);
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
@import '~link-less';
    .body {
        background-color: @bg-color;
        padding: @padding-primary;
        .card-list {
            .item {
                height: 150px;line-height: 150px;
                padding: 0 42px;margin: 30px 0;
                background-color: #2b6ec2;
                font-size: 32px;
                border-radius: 10px;
                .content {
                    .display-flex();
                    width: 100%;
                    justify-content: space-between;
                }
                &:first-child {
                    background-color: #4ac1f4;
                }
                &:last-child {
                    background-color: @easy-black;
                }
                &:nth-child(2),&:nth-child(4){
                    background-color: #4eba4c;
                }
                .add {
                    text-align: center;
                    font-size: 32px;
                }
            }
            .bank-item {
                .display-flex();
                justify-content: space-between;align-items: center;
                line-height: normal;
                .branck {
                    font-size: 24px;
                    color:#DDDDDD;
                }
                
            }
        }
    }
</style>
