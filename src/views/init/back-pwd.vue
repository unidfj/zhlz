<template>
    <div class="page">
        <m-header title="找回密码" :canback="Boolean(1)"></m-header>
        <section class="body">
            <form class="tj-form">
                <div class="form-item">
                    <label for="name">手机号</label>
                    <input type="number" placeholder="请输入手机号" v-model="formData.mobile"  oninput="if(value.length>11)value=value.slice(0,11)">
                    <!-- <input type="number" placeholder="请输入手机号" v-model="formData.mobile" @blur="IsMobilePhoneNumber($event)" oninput="if(value.length>11)value=value.slice(0,11)">
                    <span class="error" v-show="!rule.isMobile.validate"><i class="iconfont iconerror1">{{rule.isMobile.msg}}</i></span> -->
                </div>
                <div class="form-item">
                    <label for="name">密码</label>
                    <input type="password" placeholder="8-12位（不能全是数字或字母）" v-model="formData.newpassword" @blur="IsIntegerAndEnglishCharacter($event)">
                    <span class="error" v-show="!rule.isPwd.validate"><i class="iconfont iconerror1">{{rule.isPwd.msg}}</i></span>
                </div>
                <div class="form-item">
                    <label for="name">确认密码</label>
                    <input type="password" placeholder="8-12位（不能全是数字或字母）" v-model="password"  @blur="confirmL($event)">
                      <span class="error" v-show="!rule.conFirmL.validate"><i class="iconfont iconerror1">{{rule.conFirmL.msg}}</i></span>
                </div>
                <div class="form-item">
                    <label for="name">手机验证码</label>
                    <div class="item-flex code">
                        <input type="number" placeholder="请输入验证码" v-model="formData.captcha" oninput="if(value.length>4)value=value.slice(0,4)">
                        <button type="button" class="btn btn-blue" :disabled="seconds>0" @click="getCode">{{seconds==0?"点击获取":"已发送("+seconds+"s)"}}</button>
                    </div>
                </div>
                <button type="button" class="btn-submit btn-blue" @click="confirm">提交</button>
            </form>
        </section>
        <m-load ref="load"></m-load>
    </div>
</template>
<script>
import {Init,Base} from '@/server/server.js';
import {Util,Load} from '@/assets/commonjs/utils.js';
export default {
    components:{
    },
    data () {
        return {
            seconds:0,
            formData:{
                mobile:null,
                newpassword:null,
                captcha:null
            },            
            password:null,
            rule:{
              isMobile:{
                validate:true,
                msg:'请输入正确的手机号'
              },
              isPwd:{
                validate:true,
                msg:'密码应为8-12位字母+数字'
              },
              conFirmL:{
                validate:true,
                msg:'两次输入密码不一致！'
              },
            } 
        }
    },
    mounted(){
      let mp3 = document.getElementById('mp3')
      mp3.pause();
    },
    methods:{
        /**
         * 手机验证码
         */
        getCode(){
            if(!this.formData.mobile){
                mui.toast('请输入正确的手机号！');
                return ;
            }
            this.seconds = 60;
            let get =  setInterval(()=>{
                this.$nextTick(()=>{
                    this.seconds = this.seconds-1;
                    if(this.seconds<=0){
                        clearInterval(get);
                    }
                })
            },1000);
            // 发送验证码
            Base.sendCode({mobile:this.formData.mobile}).then((res)=>{
                mui.toast(res.msg);
            })
        },
        /**
         * 提交修改
         */
        confirm(){
            let _This = this;
            let msg = Util.isValidate(_This.formData,_This.rule);
            if(msg){
              mui.toast(msg);
              return ;
            }
                Load.loadStart(this);
                Init.backpwd(_This.formData).then((res)=>{
                    mui.toast(res.msg);
                    if(res.code == 1){
                        setTimeout(() => {
                            Load.loadEnd(this);
                            this.$router.go(-1);
                        }, 1000);
                    }else {
                        setTimeout(() => {
                            Load.loadEnd(this);
                            return ;
                        }, 1000);
                    }
                })
        },
        confirmL(event){
          if(event.target.value !=this.formData.newpassword){
            this.rule.conFirmL.validate = false;
          }else {
            this.rule.conFirmL.validate = true;
          }
        },
        IsMobilePhoneNumber(event) {
          let regex = /^((\+)?86|((\+)?86)?)0?1[3458]\d{9}$/;
          if (event.target.value.match(regex)) {
            this.rule.isMobile.validate = true;
          } else {
            this.rule.isMobile.validate = false;            
          }
        },
        IsIntegerAndEnglishCharacter(input) {
          var regex = /[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/;
          if (event.target.value.match(regex)) {
            this.rule.isPwd.validate = true;
          } else {
            this.rule.isPwd.validate = false;
          }
        },
        isValidate(){
          if(!Util.formValidate(this.rule)|| !Util.filterData(this.formData)){
              return false;
            }else{
              return true;
            }
        }       
    }
}
</script>

<style scoped lang="less">
@import '~link-less';
.body {
    background-color: @bg-color;
}
</style >


