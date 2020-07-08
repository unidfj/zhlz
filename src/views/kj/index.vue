<template>
  <div class="page">
    <m-header title="矿机商城"></m-header>
    <section class="body" style="background:#F7F7F7 !important">
      <ul class="top">
        <li v-for="(v,i) in top_list" :key="i" :class="{'se':se==i}" @click="changeSe(i)">{{v.title}}</li>
      </ul>

      <ul class="list" :style="'height:'+(screenHeight-100)+'px;overflow:auto;'" v-lazy-load="lazyLoad">
        <li v-for="(v,i) in list" :key="i" @click="$router.push({name:'Kdetail',query:{id:v.id}})">
          <div class="img_box">
            <img :src="api+v.image" alt="">
            <p>{{v.name}}</p>
          </div>
          <div class="center">
            <p>类型：{{v.type}}</p>
            <p>价格：{{v.price}} MGK</p>
            <p>周期：{{v.day}}天</p>
            <p>日收益：{{v.rate}}%</p>
            <!-- <p>台数：{{v.num}}</p> -->
          </div>
          <button @click.stop="openPay(v.id)">立即租用</button>
        </li>
      </ul>
    </section>
    <m-pwd ref="pwd" @pay="pay"></m-pwd>
    <footer2 :footer_list="footer_list"></footer2>
    <m-load ref="load"></m-load>
  </div>
</template>
<script>
import { Mine } from "@/server/server.js";
import { Util, Load, Secret } from "@/assets/commonjs/utils.js";
import { mapGetters, mapMutations } from "vuex";
import footer2 from '@/components/footer2.vue';
import mPwd from '@/components/pwd-alert2.vue';
export default {
  components:{
      footer2,
      mPwd
  },
  data() {
    return {
      top_list:[
        {
          title:'全部',
          type:'',
        },
        {
          title:'活期矿机',
          type:'',
        },
        {
          title:'定期矿机',
          type:'',
        },
      ],
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
      se:0,
      list:[],
      id:null,
      src: require("@/assets/images/gzlz/banner.png"),
      screenHeight:null,
      page:1,
      noMore:false,
    };
  },
  mounted() {
    this.initData();
    this.show();
  },
  computed: {
    ...mapGetters(["uid", "api", "bannerSrc", "coinTxt", "proData", "bgm"])
  },
  methods: {
    initData() {
      sessionStorage.setItem('btmNav2',1);
      this.screenHeight = window.screen.height || window.screen.availHeight;
    },
    changeSe(i){
      if(this.se==i) return;
      this.se = i;
      this.page = 1;
      this.list = [];
      this.noMore = false;
      this.show()
    },
    openPay(id){
      this.id = id;
      this.$refs['pwd'].open()
    },
    pay(payword){
      this.buy(payword)
    },
    
    // 购买矿机
    buy(payword){
      Mine.buy({payword,id:this.id}).then(res=>{
        mui.toast(res.msg)
        if(res.code==1){
          // this.list = res.data;
        }
      })
    },
    // 矿机列表
    show(){
      Mine.show({type:this.se,page:this.page}).then(res=>{
        if(res.code==1){
          // this.list = res.data;
          
          this.list = this.list.concat(res.data||[]);
          if(!res.data||res.data.length<10)
          this.noMore = true;
        }else{
          mui.toast(res.msg)
        }
      })
    },
    lazyLoad(){
        this.page = this.page+1;
        if(!this.noMore){
          this.changeSe();
        }
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
    }
  }
  .body{
    background-color: #F7F7F7;
    >.top{
      width: 100%;
      height: 122px;
      padding: 24px;
      background-color: #fff;
      margin-bottom: 30px;
      li{
        width:218px;
        height:74px;
        background:rgba(245,245,245,1);
        border-radius:40px;
        color: #000;
        display: inline-block;
        text-align: center;
        line-height: 74px;
        &:nth-child(2){
          margin: 0 24px;
        }
      }
      .se{
        background-color: #01BE6E;
        color: #fff;
      }
    }
    >.list{
      width: 690px;
      margin: 0 30px 120px;
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
          p{
            font-size:24px;
            color: #333;
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

