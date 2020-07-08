<template>
  <div class="page">
    <m-header title="矿机详情" :canback="Boolean(1)"></m-header>
    <section class="body" style="background:#F7F7F7 !important">
      <div class="top">
          <div class="img_box">
            <img :src="api+data.image" alt="">
            <p>{{data.name}}</p>
          </div>
          <div class="center">
            <p>类型：{{data.type}}</p>
            <p>价格：{{data.price}} MGK</p>
            <p>周期：{{data.day}}天</p>
            <p>日收益：{{data.rate}}%</p>
            <p>台数：{{data.num}}</p>
          </div>
      </div>
      <div class="center">
        <p class="top">矿机介绍</p>
        <p class="content">{{data.desc}}</p>
      </div>
      <button @click.stop="$refs['pwd'].open()" class="bot">立即租用</button>
    </section>
    <m-pwd ref="pwd" @pay="pay"></m-pwd>
    <m-load ref="load"></m-load>
  </div>
</template>
<script>
import { Mine } from "@/server/server.js";
import { Util, Load, Secret } from "@/assets/commonjs/utils.js";
import { mapGetters, mapMutations } from "vuex";
import mPwd from '@/components/pwd-alert2.vue';
export default {
  components:{
      mPwd
  },
  data() {
    return {
      src: require("@/assets/images/gzlz/banner.png"),
      data:{
        createtime:null,
        day:null,
        desc:null,
        id:null,
        is_show:null,
        name:null,
        num:null,
        price:null,
        rate:null,
        status:null,
        type:null,
        updatetime:null,
      }
    };
  },
  mounted() {
    this.initData();
    this.single();
  },
  computed: {
    ...mapGetters(["uid", "api", "bannerSrc", "coinTxt", "proData", "bgm"])
  },
  methods: {
    initData() {
      this.id = this.$route.query.id;
    },
    pay(payword){
      this.buy(payword)
    },
    
    // 购买矿机
    buy(payword){
      Mine.buy({payword,id:this.id}).then(res=>{
        mui.toast(res.msg)
        if(res.code==1){
          setTimeout(()=>{
            this.$router.go(-1)
          },500)
        }
      })
    },
    // 矿机列表
    single(){
      Mine.single({id:this.id}).then(res=>{
        if(res.code==1){
          this.data = res.data;
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
    >.top{
        width:690px;
        height:250px;
        background:rgba(255,255,255,1);
        border-radius:10px;
        border:1px solid rgba(1,190,110,1);
        display: flex;
        justify-content: space-between;
        padding: 0 30px 0 45px;
        margin: 30px 30px 20px;
        >.img_box{
          img{
            margin-top: 30px;
            width: 110px;
            height: 160px;
            background-color: #ccc;
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
          margin-left: 110px;
          p{
            font-size:24px;
            color: #333;
          }
        }
    }
    >.center{
      width:690px;
      background:rgba(255,255,255,1);
      border-radius:10px;
      border:1px solid rgba(1,190,110,1);
      padding: 30px 40px;
      margin: 0 30px;
      >.top{
        font-size:36px;
        font-weight:500;
        color:rgba(1,190,110,1);
        text-align: center;
        margin-bottom: 30px;
      }
      .content{
        font-size:28px;
        color:rgba(34,34,34,1);
        text-align: left;
      }
    }
    .bot{
      width:690px;
      height:88px;
      background:rgba(5,192,112,1);
      border-radius:8px;
      border:1px solid rgba(1,190,110,1);
      margin: 50px 30px 30px;
    }
  }
}
</style>

