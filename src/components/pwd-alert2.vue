<!-- 
    密码框 
-->
<template>
    <div >
        <section class="body" v-show="layer" >
            <div class="small-alert" @click.stop>
                <div>
                    <header class="header">
                        <span>请输入交易密码</span>
                    </header>
                    <section class="content">
                        <input type="password" v-model="pwd" oninput="if(value>6)value=value.slice(0,6)" v-focus autofocus="autofocus">
                    </section>
                    <div class="bot">
                        <p v-if="content">
                            <span>注意：退租矿机将收取手续费</span>
                            <span>(手续费=矿机金额*{{content}})</span>
                        </p>
                        <p v-else></p>
                        <p @click="forget">忘记密码？</p>
                    </div>
                    <footer class="btm-btn-group">
                        <button class="btn btn-origin" @click.stop="pay">确定</button>
                        <!-- <button class="btn btn-cancel" @click.stop="layer = false">取消</button> -->
                    </footer>
                    <p class="close">
                        <i class="iconfont iconclose" @click.stop="layer = false"></i>
                    </p>
                </div>
            </div>
        </section>
        <m-load ref="load"></m-load>
    </div>
</template>
<script>
import {Load} from '@/assets/commonjs/utils.js';
export default {
    props:{
        content:{
            type:String,
            default(){
                return '';
            }
        }
    },
    data () {
        return {
            layer:false,
            pwd:null,
            ccType:1,
            ts:null,
        }
    },
    mounted(){

    },
    methods:{
        open(){
            this.layer = true;
            this.pwd = null;
        },
        close(){
            this.layer = false;
        },
        pay(){
            if(this.pwd){
                this.layer = false;
                    Load.loadStart(this);
                    setTimeout(() => {
                        Load.loadEnd(this);
                        this.$emit('pay',this.pwd);
                    }, 1000);
                
            }else {
                mui.toast('交易密码不能为空！');
                return ;
            }
        },
        savePaytype(type){
            this.ccType = type;
        },
        forget(){
            this.$router.push({name:'SetPwd',query:{type:'trade'}});
        }
    }
}
</script>

<style scoped lang="less">
// @import '~link-less';
@import '~link-less';
.body {
    position: fixed;
    background-color: rgba(0, 0, 0, 0.3);
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 2;
    .small-alert {
        position: absolute;
        width: 80%;
        // height: 500px;
        padding-bottom: 40px;
        border-radius: 10px;
        background-color: white;
        left: 50%;
        top: 20%;
        text-align: center;
        .transform(translateX(-50%));
        >div{
            position: relative;
            .close{
                position: absolute;
                right: 30px;
                top: -20px;
                color: #000;
            }
        }
        .header {
            text-align: left;
            margin: 37px 0 20px 30px;
            span{
                font-size:32px;
                color:rgba(51,51,51,1);
            }
        }
        .content {
            margin: @margin-primary;
            font-size: 28px;
            i {
                color: @btn-primary-color;
                font-size: 32px;
            }
            .no-mar {
                margin-bottom: 0;
            }
            input{
                margin: 0;
            }
        }
        .bot{
            display: flex;
            justify-content: space-between;
            margin-bottom: 34px;
            padding: 0 30px;
            p{
                color: #E20000;
                flex: 10;
                &:last-child{
                    flex: 5;
                    text-align: right;
                }
                span{
                    display: block;
                    font-size: 24px;
                    &:last-child{
                        text-align: right;
                    }
                }
            }
        }
        .radioNav{
            .display-flex();
            justify-content: space-between;
            width: 90%;
            margin:0 5% 5%;
            a {
                text-overflow: unset;
                &::after{
                    right: -6px;
                }
            }
        }
        .btm-btn-group{
            .btn {
                width:540px;
                height:88px;
                background:rgba(5,192,112,1);
                border-radius:8px;
                border:1px solid rgba(1,190,110,1);
            }
            // .btn-confirm {
            //     .btm-btn-primary();
            //     border: none;
            // }
        }
    }
}
</style >

