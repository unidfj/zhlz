<template>
    <div class="page">
        <m-header title="绑定备用手机号" :canback="Boolean(1)"></m-header>
        <section class="body">
            <form class="tj-form">
                <div class="form-item">
                    <label for="name">备用手机号</label>
                    <!-- <input type="number" placeholder="请输入备用手机号" v-model="mobile" v-if="!show">
                    <input type="number" placeholder="请输入备用手机号" v-model="mobile" readonly v-else> -->
                    <input type="number" placeholder="请输入备用手机号" v-model="mobile">
                </div>
                <button type="button" class="btn-submit btn-blue" @click="setmb" >绑定</button>
                <!-- <button type="button" class="btn-submit btn-blue" @click="setmb" v-if="!show">绑定</button> -->
            </form>
        </section>
        <m-load ref="load"></m-load>
    </div>
</template>
<script>
import {Owner,Base,Init} from '@/server/server.js';
import {mapGetters} from 'vuex';
import {Util,Load} from '@/assets/commonjs/utils.js';
import {Secret} from '@/assets/commonjs/utils.js';

export default {
    name:"AddCard",
    data(){
        return {
            mobile:null,
            show:false,
        }
    },
    mounted(){
        this.initData();
        this.getUser();
    },
    computed:{
        ...mapGetters(['uid','userInfo','temp','api'])
    },
    methods:{
        initData(){
            // this.formData.id = this.uid;
        },
        setmb(){
            Owner.setmb({mobile:this.mobile}).then(res=>{
                mui.toast(res.msg)
                if(res.code==1){
                    setTimeout(()=>{
                        this.$router.go(-1)
                    },500)
                }
            })
        },
        IsBand(event) {
          let regex =  /^([1-9]{1})(\d{14}|\d{18})$/;
          if (event.target.value.match(regex)) {
            this.rule.isBank.validate = true;
          } else {
            this.rule.isBank.validate = false;            
          }
        },
        isValidate(){
          if(!Util.formValidate(this.rule)|| !Util.filterData(this.formData)){
              return false;
            }else{
              return true;
            }
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
                    if(info.mobile2){
                        this.mobile = info.mobile2;
                        this.show = true;
                    }
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
        // padding: @padding-primary;
        label{
            color: #000 !important;
        }
    }
</style>
