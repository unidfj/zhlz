<template>
  <div class="page">
    <m-header title="我的收益" :canback="Boolean(1)"></m-header>
    <section class="body" style="background:#F7F7F7 !important">
      <ul class="list">
        <li>
          <p>矿机名称</p>
          <p>收益</p>
          <p>结算日期</p>
        </li>
        <li v-for="v in list" :key="v.id">
          <p>{{v.name}}</p>
          <p>{{v.netincome}}</p>
          <p>{{v.time}}</p>
        </li>
      </ul>
    </section>
    <m-load ref="load"></m-load>
  </div>
</template>
<script>
import { Mine } from "@/server/server.js";
import { Util, Load, Secret } from "@/assets/commonjs/utils.js";
import { mapGetters, mapMutations } from "vuex";
export default {
  data() {
    return {
      page:1,
      list:[],
      src: require("@/assets/images/gzlz/banner.png"),
    };
  },
  mounted() {
    this.initData();
    this.netincome();
  },
  computed: {
    ...mapGetters(["uid", "api", "bannerSrc", "coinTxt", "proData", "bgm"])
  },
  methods: {
    initData() {
      
    },
    // 矿机列表
    netincome(){
      Mine.netincome({page:this.page}).then(res=>{
        if(res.code==1){
          this.list = res.data;
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
        color: #000;
      }
    }
  }
  .body{
    .list{
      width:690px;
      background:rgba(255,255,255,1);
      border-radius:10px;
      border:1px solid rgba(1,190,110,1);
      padding: 20px 30px 10px;
      margin: 30px;
      li{
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        &:first-child{
          font-size:28px;
          font-weight:550;
          color:rgba(51,51,51,1);
        }
        p{
          text-align: center;
          font-size:24px;
          color:rgba(102,102,102,1);
          flex: 1;
          &:first-child{
            text-align: left;
          }
          &:last-child{
            text-align: right;
          }
        }
      }
    }
  }
}
</style>

