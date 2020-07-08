<template>
    <div class="page">
        <m-header title="登录"></m-header>

        <section class="body">
            <div class="img-box">
                <img class="logo" :src="proData&&api+proData.login_logo" alt="">
                <!-- <img class="logo" :src="defaultBanner" alt=""> -->
            </div>
             <form class="tj-form">
                <div class="form-item">
                    <label for="name">手机号</label>
                    <input type="text" placeholder="请输入手机号" v-model="formData.account"  oninput="if(value.length>11)value=value.slice(0,11)">
                </div>
                <div class="form-item">
                    <label for="name">密码</label>
                    <input type="password" placeholder="8-12位（不能全是数字或字母）" v-model="formData.password">
                </div>
                <div class="form-item">
                    <label for="name">图形验证码</label>
                    <div class="item-flex code">
                        <input type="text" placeholder="请输入图中的验证码" v-model="formData.captcha" maxlength="4">
                        <img class="btn img-code" :src="api+'/api/Captcha/get?identifier='+randomCode" alt="" @click="getRandom()">
                    </div>
                </div>
                <button type="button" class="btn-submit btn-blue" @click="login">登录</button>
            </form>
            <!-- <p class="other"><a @click="toScan">扫一扫注册</a> <a @click="backPwd">找回密码</a></p> -->
            <!-- <p class="other"><a @click="actionSheet">{{isApp?'扫一扫注册':''}}</a> <a @click="backPwd">找回密码</a></p> -->
            <div class="other">
                <p @click="getPwd" class="gp">
                    <span :class="{'se':show}"></span> 
                    <span>记住密码</span>
                </p> 
                <a @click="backPwd">找回密码</a>
            </div>
            <button type="button" class="btn-submit btn-download" @click="goToDownload">下载 App</button>
        </section>
        <m-load ref="load"></m-load>
    </div>
</template>
<script>
import {Init,Base} from '@/server/server.js';
import {Util,Load,HB,Secret} from '@/assets/commonjs/utils.js';
import {mapGetters,mapMutations} from 'vuex';
export default {
    data () {
        return {
            formData:{
                account:null,
                password:null,
                identifier:null,
                captcha:null,
            },
            imgCode:null,
            randomCode:null,
            barcode:null,
            scan:null,
            defaultBanner:require('@/assets/images/gzlz/banner.png'),
            isApp:false,
            show:false,
        }
    },
    created() {
        this.initData();
    },
    mounted(){
        let that = this;
        this.getRandom();
        this.getData();
        this.viewBack();
    },
    computed:{
        ...mapGetters(['api','proData'])
    },
    methods:{
        ...mapMutations(['saveProData','saveUserID','saveUserInfo']),
        initData(){
            this.show = localStorage.getItem('show')?true:false;
            
            let mp3 = document.getElementById('mp3')
            mp3.pause();
            
            if(this.show){
                this.formData.password = localStorage.getItem('pwd') != 'null'?localStorage.getItem('pwd'):'';
                this.formData.account = localStorage.getItem('account') != 'null'?localStorage.getItem('account'):'';
            }else{
                this.formData.password = null;
                this.formData.account = null;
            }
             mui.init({
                swipeBack:true //启用右滑关闭功能
            });
            setTimeout(() => {
                try{
                    if(plus){
                        this.isApp = true;
                    }
                }catch(e){}
            }, 200);
        },
        // 记住密码
        getPwd(){
            this.show = !this.show;
            console.log(this.show)
        },
        /**
         * 监听返回 扫码框关闭与返回
         */
        viewBack(){
            setTimeout(() => {
                try{
                    if(plus){
                        plus.key.addEventListener('backbutton',function(){
                            // barcode 为扫码的组件实例化对象
                            if(that.barcode){
                                that.barcode.close()
                                that.barcode = null;
                            } 
                            else that.$router.go(-1);
                        },false);
                    }
                }catch(e){}
            }, 1000);
        },
        /**
         * 找回密码
         */
        backPwd(){
            this.$router.push({name:'BackPwd'})
        },
        /**
         * 登录
         */
        login(){
            if(!this.formData.captcha){
                mui.toast('请输入图形验证码！')
                return;
            }
            let params = this.formData;
            let msg = Util.isValidate(params);
            if(msg){
              mui.toast(msg);
              return ;
            }
            Load.loadStart(this);
            Init.login(params).then((res)=>{
                mui.toast(res.msg,{duration: 550});
                if(res.code == 1){
                    let InfoData = JSON.parse(Secret.decrypt(res.data));
                    
                    // localStorage.setItem('user_id',res.data.id);
                    this.saveUserInfo(InfoData);
                    this.saveUserID(InfoData.id);
                    localStorage.setItem('userInfo',res.data);
                    localStorage.setItem('cookie',InfoData.token);
                    if(this.show){
                        localStorage.setItem('pwd',this.formData.password);
                        localStorage.setItem('account',this.formData.account);
                        localStorage.setItem('show',this.show);
                    }else{
                        localStorage.setItem('pwd',null);
                        localStorage.setItem('account',null);
                    }
                    setTimeout(() => {
                        Load.loadEnd(this);
                        this.$router.replace({name:'index'})
                    }, 500);
                }else {
                    setTimeout(() => {
                        Load.loadEnd(this);
                        return ;
                    }, 500);
                }
            })
        },
        /**
         * 扫码选项  相机 相册
         */
        actionSheet(){
            let _this = this;
            try{
                plus.nativeUI.actionSheet({
                    // title:"Plus is ready!",
                    cancel:"取消",
                    buttons:[
                        {
                            title:"相机"
                        },{
                            title:"相册"
                            }
                    ]},
                    function(e){
                        console.log("User pressed: "+e.index);
                        if(e.index == 1){
                            _this.toScan();
                        }else if(e.index == 2){
                            _this.selectGallery();
                        }
                    });

            }catch(e){}
        },
        /**
         * 随机标识key
         */
        getRandom(){
            let random1 = parseInt(Math.random(0,1)*100000000);
            let random2 = parseInt(Math.random(0,1)*100000000);
            let str = 'abcdd';
            // return  random1+'abcdd'+random2;
            this.randomCode = random1+'abcdd'+random2+'-'+new Date().getTime();
            this.formData.identifier = this.randomCode;
        },
        /**
         * 相册扫码
         */
        selectGallery(){
            let _This = this;
                HB.picForGallery(_This,res=>{
                    Load.loadStart(_This);
                    plus.downloader.createDownload( _This.api+res, {filename:"_doc/images/"}, function(d,status){  
                        if ( status == 200 ) {   
                                plus.barcode.scan( d.filename, function(type,result) {
                                    Load.loadEnd(_This);
                                    plus.nativeUI.confirm("确定跳转?", function(e){
                                        if(e.index == 0){
                                            plus.runtime.openURL(JSON.parse(result));
                                        }
                                    });
                            }, function(e){
                                console.log("Scan failed: "+JSON.stringify(e));
                            } );
                        } else {  
                            console.log("下载图片文件失败！");  
                        }  
                        plus.nativeUI.closeWaiting();  
                    }).start(); 
                })
        },
        /**
         * 相机扫码
         */
        toScan(){
            let _This = this;
            if(!this.barcode){
                this.barcode = plus.barcode.create('barcode', [plus.barcode.QR], {
                    top:'100px',
                    left:'0px',
                    width: '100%',
                    height: '500px',
                    position: 'static'
                });
                this.barcode.onmarked = _This.onmarked;
                plus.webview.currentWebview().append(this.barcode);
            }
            this.barcode.start();
            // this.scan = new plus.barcode.Barcode('bcid');
            // this.scan.onmarked = this.onmarked();
            // this.scan.start();
        },
        /**
         * 扫码回调
         */
        onmarked(type, result) {
            var text = '未知: ';
            switch(type){
                case plus.barcode.QR:
                text = 'QR: ';
                break;
                case plus.barcode.EAN13:
                text = 'EAN13: ';
                break;
                case plus.barcode.EAN8:
                text = 'EAN8: ';
                break;
            }
            if(result){
                // alert( text+result );
                this.barcode.close();
                try{
                    if(plus){
                        mui.confirm('确定跳转',actions=>{
                            if(actions.index == 0)
                            plus.runtime.openURL(result);
                            
                        })
                    }
                }catch(e){
                    mui.confirm('确定跳转',actions=>{
                        if(actions.index == 1)
                        plus.runtime.openURL(result);
                    })
                }
            }
        },
        /**
         * 下载
         */
        goToDownload() {
          this.$router.push({name:'Download'})
        },
        /**
         * 项目基础信息
         */
        async getData(){
            await Base.getData().then(res=>{
                if(res.code ==1){
                    this.saveProData(res.data);
                    localStorage.setItem('proData',JSON.stringify(res.data));
                }else
                mui.toast(res.msg||'加载项目信息失败！')
            })
        }
    },
}
</script>

<style scoped lang="less">
@import '~link-less';
.body {
    background-color: @bg-color;
    .img-box {
        .display-flex();
        justify-content: center;align-items: center;
        .logo {
            margin:60px 0;
            height: 180px;
        }
    }
    .tj-form {
        .btn-white {
            background-color: whitesmoke;
            color: #333;
            font-size: 40px;letter-spacing: 5PX;font-family: fantasy; //monospace fantasy
        }
        .form-item{
            input{
                background-color: #2cb4ff !important;
                color: #fff !important;
                &::-webkit-input-placeholder {
                    color: #fff !important;
                }
                &:-moz-placeholder {
                    color: #fff !important;
                }
                &:-ms-input-placeholder {
                    color: #fff !important;
                }
            }
        }
    }
    .other {
        // .display-flex();
        display: flex;
        justify-content: space-between;
        margin: 0 @margin-primary  @margin-primary ;
        color: white;
        font-size: 24px;
        p {
            // padding: 10px 20px;
            flex: 1;
            &:first-child{
                text-align: left;
                display: flex;
                justify-content: space-between;
                height: 40px;
                line-height: 40px;
                span{
                    &:first-child{
                        display: block;
                        width: 30px;
                        height: 30px;
                        background-color: #fff;
                        border-radius: 50%;
                        margin-top: 5px;
                    }
                    &:last-child{
                        flex: 1;
                        margin-left: 20px;
                    }
                }
                .se{
                    background-color: red !important;
                }
            }
            &:last-child{
                text-align: right;
            }
        }
    }
    .btn-download {
      display: block;margin: 0 auto 4vw;
      width: 92%;height: 44PX;
      background: #78bc43;
    }
}
</style >

