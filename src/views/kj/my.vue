<template>
  <div class="page">
    <m-header title="我的矿机" >
      <span style="color:#000" @click="$router.push({name:'Money'})">我的收益</span>
    </m-header>
    <section class="body" style="background:#F7F7F7 !important">
      <div class="top">
        <p>矿机押金总金额：{{totalmoney}} MGK</p>
        <p>合计收益：{{netincome}} MGK</p>
        <ul class="selected">
          <li v-for="v in top_list" :key="v.value" @click="changeSe(v.value)" :class="{'se':type==v.value}">{{v.title}}</li>
        </ul>
      </div>
      
      <ul class="list" :style="'height:'+(screenHeight-100)+'px;overflow:auto;'" v-lazy-load="lazyLoad">
        <li v-for="v in list" :key="v.id">
          <div class="img_box">
            <img :src="api+v.image" alt="">
            <p>{{v.name}}</p>
          </div>
          <div class="center">
            <p>类型：{{v.ordertype}}</p>
            <p>价格：{{v.price}} MGK</p>
            <p>已获收益：{{v.credit2}}</p>
            <p>到期时间：</p>
            <p class="time">{{v.deadline}}</p>
          </div>
          <button @click.stop="openPay(v.id)" v-if="v.ordertype=='活期矿机'&&v.status=='收益中'">退租</button>
          <p class="status">{{v.status}}</p>
        </li>
      </ul>
    </section>
    <footer2 :footer_list="footer_list"></footer2>
    <m-pwd ref="pwd" @pay="pay" :content="content"></m-pwd>
    <m-load ref="load"></m-load>
  </div>
</template>
<script>
import { Mine } from "@/server/server.js";
import { Util, Load, Secret } from "@/assets/commonjs/utils.js";
import { mapGetters, mapMutations } from "vuex";
import mPwd from '@/components/pwd-alert2.vue';
import footer2 from '@/components/footer2.vue';
export default {
  components:{
      footer2,
      mPwd
  },
  data() {
    return {
      src: require("@/assets/images/gzlz/banner.png"),
      type:0,
      top_list:[
        {
          title:'全部',
          value:'0',
        },
        {
          title:'收益中',
          value:'1',
        },
        {
          title:'收益完成',
          value:'2',
        },
        {
          title:'退租',
          value:'-1',
        },
      ],
      se:0,
      list:[],
      footer_list:[
        {
          title:'首页',
          icon:'iconfont iconshouye',
          route:'PanGold',
        },
        {
          title:'矿机商城',
          icon:'iconfont iconicon-test',
          route:'KJ',
        },
        {
          title:'我的矿机',
          icon:'iconfont icongongsimingcheng',
          route:'Kmy',
        },
      ],
      content:null,
      netincome:null,
      totalmoney:null,
      
      screenHeight:null,
      page:1,
      noMore:false,
    };
  },
  mounted() {
    this.initData();
    this.mymill();
    this.cancel_tips_new();
  },
  computed: {
    ...mapGetters(["uid", "api", "bannerSrc", "coinTxt", "proData", "bgm"])
  },
  methods: {
    initData() {
      sessionStorage.setItem('btmNav2',2);
      this.screenHeight = window.screen.height || window.screen.availHeight;
    },
    lazyLoad(){
        this.page = this.page+1;
        console.log('page',this.page)
        if(!this.noMore){
          this.mymill();
        }
    },
    // 提示
    cancel_tips_new(){
      Mine.cancel_tips_new().then(res=>{
        if(res.code==1){
          this.content = res.data;
        }else{
          mui.toast(res.msg)
        }
      })
    },
    openPay(id){
      this.id = id;
      this.$refs['pwd'].open()
    },
    pay(payword){
      this.cancel(payword)
    },
    changeSe(v){
      if(this.type==v) return;
      this.type = v;
      this.page = 1;
      this.list = [];
      this.noMore = false;
      this.mymill();
    },
    // 退租
    cancel(paypwd){
      Mine.cancel({id:this.id,paypwd}).then(res=>{
        mui.toast(res.msg)
        if(res.code==1){
          this.mymill();
        }
      })
    },
    // 矿机列表
    mymill(){
      Mine.mymill({type:this.type,page:this.page}).then(res=>{
        if(res.code==1){
          // this.list = res.data.data;
              
          this.netincome = res.data.netincome;
          this.totalmoney = res.data.totalmoney;
          this.list = this.list.concat(res.data.data||[]);
          if(!res.data.data||res.data.data.length<10)
          this.noMore = true;
          
        }else{
          mui.toast(res.msg)
        }
      })
    },
  },
  beforeRouteLeave(to, from, next) {
    next();
  }
};
</script>
<style lang="less" scoped>
@import "~link-less";
.page{
  /deep/ .header{
    .nav{
      // color: #fff;
      background-color: #fff;
      .center{
        color: #333;
        font-weight: 500;
        font-size: 36px;
      }
      .left{
        color: #333;
      }
    }
  }
  .body{
    background-color: #F7F7F7;
    .top{
      width:690px;
      height:193px;
      background:linear-gradient(90deg,rgba(47,229,148,1) 0%,rgba(3,191,111,1) 100%);
      border-radius:10px;
      padding: 34px 40px;
      position: relative;
      margin: 30px;
      p{
        font-size: 28px;
      }
      .selected{
        position: absolute;
        left: 40px;
        top: 150px;
        width: 630px;
        background-color: #fff;
        border-radius:10px;
        display: flex;
        justify-content: space-between;
        border: 1px solid rgba(1,190,110,.6);
        li{
          font-size:28px;
          color:rgba(51,51,51,1);
          text-align: center;
          height: 98px;
          line-height: 98px;
          flex: 1;
        }
        .se{
          color:rgba(1,190,110,1);
        }
      }
    }
    .list{
      width: 690px;
      margin: 84px 30px 120px;
      li{
        width:690px;
        height:250px;
        background:rgba(255,255,255,1);
        border-radius:10px;
        border:1px solid rgba(1,190,110,1);
        display: flex;
        justify-content: space-between;
        padding: 0 30px 0 45px;
        margin-bottom: 20px;
        position: relative;
        .status{
          position: absolute;
          right: 40px;
          top: 20px;
          color: #E20000;
        }
        >.img_box{
          img{
            margin-top: 30px;
            width: 110px;
            height: 160px;
            // background-color: #ccc;
          }
          p{
            font-size:24px;
            color:rgba(1,190,110,1);
            text-align: center;
          }
        }
        >.center{
          margin-top: 24px;
          flex: 1;
          margin-left: 58px;
          p{
            font-size:24px;
            color: #333;
          }
          .time{
            color: #01BE6D;
          }
        }
        >button{
          margin-top: 91px;
          width:160px;
          height:68px;
          background:rgba(1,190,110,1);
          border-radius:8px;
        }
      }
    }
  }
}
</style>

