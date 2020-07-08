<template>
    <div id="app" @touchstart="mp">
        
        <transition name="slide-fade">
            <keep-alive>
                <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
        </transition>
        <transition name="slide-fade">
            <router-view v-if="!$route.meta.keepAlive"></router-view>
         </transition>
         <div class="layer" v-if="notice">
                <div class="inner-layer">
                    <header class="title">{{notice.title}}</header>
                    <section class="content" v-html="notice.contents"></section>
                    <footer class="mybtn" @click="readMsg">确定</footer>
                </div>
         </div>
        <audio :src="mp3"  ref="mp3"  class="mp3" id="mp3"  loop controls></audio>
        <!-- <embed :src="mp3"  ref="mp3"  class="mp3" id="mp3" :autoplay="false" loop controls  hidden="true"> -->
    </div>
</template>
<script>
import VConsole from 'vconsole';
import {HB} from '@/assets/commonjs/utils.js';
import {Base} from '@/server/server.js';
import {mapMutations,mapGetters} from 'vuex';
export default {
    name: 'app',
    data () {
        return{
            miningSrc:require('@/assets/images/bg.png'),
            userName:" ",
            mp3:require('@/assets/images/05.mp3'),
            // mp3:require('../static/01.mp3'),
            notice:null,
            autoplay:null,
            cs:true,
        }
    },
    // created(){
    //     if(localStorage.getItem('cookie')) this.getMsg();
    //     setInterval(() => {
    //         if(localStorage.getItem('cookie')) this.getMsg();
    //     }, 180000);
    // },
    mounted:function(){
        // let vConsole = new VConsole();
        // this.mp();
        // this.new();
        this.getData();
        setTimeout(() => {
            HB.autoUpdate();
        }, 3000);
    },
    computed: {
        ...mapGetters(['bgm'])
    },
    methods:{
        new(){
            
            let path = this.$route.path;
            if(path=='/login'||path=='/backpwd'||path=='/download'||path.indexOf('/register')!=-1) return;
            if(localStorage.getItem('bgm')==0) return;
            let ad = document.createElement('audio');
            ad.src = this.mp3;
            ad.ref = 'mp3';
            ad.id = 'mp3';
            ad.hidden = true;
            // ad.autoplay = localStorage.getItem('bgm')!=0?true:false;
            ad.autoplay = true;
            document.getElementById('app').appendChild(ad);
            this.mp();
            // console.log('bgm:',localStorage.getItem('bgm'))
        },
        mp(){
            let mp3 = document.getElementById('mp3')
            
            console.log('route',this.$route.path)
            let path = this.$route.path;
            if(path=='/login'||path=='/backpwd'||path=='/download'||path.indexOf('/register')!=-1) return;
            if(localStorage.getItem('bgm')!=0){
                // console.log('paused',!mp3.paused)
                // if(!mp3.paused) return;
                mp3.play();
                // mp3.autoplay = true; 
                // mp3[localStorage.getItem('bgm')==0?'pause':'play']()
            }
        },
        ...mapMutations(['saveProData']),
        async getData(){
            await Base.getData().then(res=>{
                if(res.code ==1){
                    this.saveProData(res.data);
                    localStorage.setItem('proData',JSON.stringify(res.data));
                }else
                mui.toast(res.msg||'加载项目信息失败！')
            })
        },
        getMsg(){
            Base.getMsg().then(res=>{
                if(res.code == 1){
                    if(res.data)
                    this.notice = res.data;
                   
                }else return;
            })
        },
        readMsg(){
            if(this.notice)
            Base.readMsg({notice_id:this.notice.id}).then(res=>{
                if(res.code ==1) {
                    this.getMsg();
                }else mui.toast(res.msg)
                
                
            })
        }
    }
}
</script>
<style lang="less">
    @import "./assets/style/common.less";
    .layer {
        position: fixed;
        height: 100%;width: 100%;
        background: rgba(1,1,1,.5);
        z-index: 1;top: 0;left: 0;
        .inner-layer {
            position: fixed;top: 50%;left: 50%;
            width: 80%;border-radius: 30px;
            .transform(translate(-50%,-50%));
            min-height: 300px;background-color: white;
            .display-flex();flex-direction: column;justify-content: space-between;
            .title {
                text-align: center;font-size: 32px;
                height: 80px;line-height: 80px;
                border-bottom: 1px solid rgba(1,1,1,.2)
            }
            .content {
                flex: 1;padding: 10px 16px;
                /deep/p {
                    color: black;
                }
            }
            .mybtn {
                text-align: center;width: 100%;background-color: @btn-primary-color;
                font-size: 32px;color: white;
                height: 80px;line-height: 80px;
                border-bottom-left-radius: 30px;border-bottom-right-radius: 30px;
            }
        }
    }
    #mp3{
        position: fixed;
        top: -200px;
        // left: 30px;
        // z-index: 999;
        opacity: 0;
    }
</style>
<style lang="less">
    /* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(5px);
  opacity: 0;
}
</style>
