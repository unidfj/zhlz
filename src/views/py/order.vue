<template>
  <div class="page">
    <m-header title="交易订单" :canback="Boolean(1)"></m-header>
    <section class="body" style="background:#F7F7F7 !important" :style="'height:'+(screenHeight-100)+'px;overflow:auto;'" v-lazy-load="lazyLoad">
      <ul class="selected">
        <li :class="{'se':type=='Buy'}" @click="changeType('Buy')">我的买单</li>
        <li :class="{'se':type=='Sell'}" @click="changeType('Sell')">我的卖单</li>
      </ul>
      <ul class="top">
        <li v-for="v in top_list" :key="v.id" @click="getlist(v.status,false)" :class="{'se':status==v.status}">{{v.title}}</li>
      </ul>
      <ul class="list">
        <li v-for="(v,i) in list" :key="i" @click="goTo(v)">
          <div class="left">
            <!-- <p>{{type=='Sell'?'买':'卖'}}家：{{String(v.mobile).substring(0,3)}}****{{String(v.mobile).substring(7,11)}}</p> -->
            <p>区块编号：{{v.ordersn}}</p>
            <p>
              <span>单价：￥{{v.price}}</span>
              <span>数量：{{v.cnum}}</span>
            </p>
            <!-- <p>总额：￥{{v.total_money}}</p> -->
            <p>总金额：{{Number(v.num*v.price).toFixed(4)}}</p>
            <p>创建时间：{{formatDate(v.createtime)}}</p>
          </div>
          <button class="right">详情</button>
          <p :class="{'status':true,'c_r':v.status!=3&&v.status!=0,'c_g':v.status==3||v.status==0}">{{getStatus(v.status)}}</p>
          
        </li>
      </ul>
    </section>
    <m-load ref="load"></m-load>
  </div>
</template>
<script>
import { Trade,Init } from "@/server/server.js";
import { Util, Load, Secret } from "@/assets/commonjs/utils.js";
import { mapGetters, mapMutations } from "vuex";
export default {
  data() {
    return {
      type:null,
      top_list:[
        {
          title:'全部',
          status:'all',
        },
        {
          title:'已创建',
          status:'0',
        },
        {
          title:'待付款',
          status:'1',
        },
        {
          title:'待确认',
          status:'2',
        },
        {
          title:'已完成',
          status:'3',
        },
        {
          title:'申诉',
          status:'4',
        },
      ],
      list:[],
      status:'all',

      screenHeight:null,
      page:1,
      noMore:false,
    };
  },
  mounted() {
    this.initData();
    this.getlist();
    let a = {b:1,c:2}
  },
  computed: {
    ...mapGetters(["uid", "api", "bannerSrc", "coinTxt", "proData", "bgm"])
  },
  methods: {
    initData() {
      this.type = this.$route.query.type;
      this.screenHeight = window.screen.height || window.screen.availHeight;
      // this.top_list[2].title = this.type=='Sell'?'待确认':'待付款';
      // this.top_list[2].status = this.type=='Sell'?'2':'1';
    },
    
    lazyLoad(){
        this.page = this.page+1;
        console.log('page',this.page)
        if(!this.noMore){
          this.getlist();
        }
    },
    goTo(v){
      this.$router.push({name:'orderDetail',query:{
        type:this.type,
        id:v.id,
        buy_id:'buy_id' in v?v.buy_id:null,
        sell_id:'sell_id' in v?v.sell_id:null,
        zd:v.zd
      }})
    },
    formatDate(v){
      return Util.formatDate(v)
    },
    changeType(v){
      this.type = v;
      this.status = 'all';
      this.list = [];
      this.noMore = false;
      this.page = 1;
      this.getlist();
    },
    getlist(status,bl){
      if(status&&!bl){
        this.status = status;
        this.list = [];
        this.noMore = false;
        this.page = 1;
      }
      Trade[this.type=="Sell"?'getlist':'getbuylist']({page:this.page,status:this.status}).then(res=>{
        if(res.code==1){
          // this.list = res.data;
          
          this.list = this.list.concat(res.data.data||[]);
          if(res.data.stop==1) this.noMore = true;
          console.log('noMore',this.noMore)
        }else{
          mui.toast(res.msg)
        }
      })
    },
    getStatus(v){
      // 买单状态 -1表示取消，0表示已创建，1表示待付款，2表示交易完成，all表示全部
      switch(+v){
        case 99:
          return '已失效';
        case 0:
          return '已创建';
        case 1:
          return '待付款';
        case 2:
          return '待确认';
        case 3:
          return '已完成';
        case 4:
          return '申诉中';
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
    box-shadow: none;
    .nav{
      background-color: #fff;
      >.left{
        color: #333 !important;
      }
      .center{
        color: #333;
        font-weight: 500;
        font-size: 36px;
      }
    }
  }
  .body{
    >.selected{
      display: flex;
      justify-content: space-between;
      background-color: #f7f7f7;
      li{
        flex: 1;
        height: 88px;
        line-height: 88px;
        text-align: center;
        &:last-child{
          border-left: 1px solid #eee;
        }
      }
      .se{
        background-color: #01be6e;
        color: #fff;
      }
    }
    >.top{
      background-color: #fff;
      display: flex;
      justify-content: space-between;
      li{
        height: 84px;
        line-height: 84px;
        font-size:34px;
        color: #333;
        text-align: center;
        flex: 1;
      }
      .se{
        font-size:34px;
        font-weight:500;
        color:#01BE6E;
        // border-bottom: 1px solid #01BE6E;
        position: relative;
        &::before{
          content: '';
          position: absolute;
          width:68px;
          height:4px;
          background:rgba(1,190,110,1);
          border-radius:2px;
          bottom: 0;
          left: 28px;

        }
      }
    }
    >.list{
      width: 690px;
      margin: 0 30px;
      li{
        background:rgba(255,255,255,1);
        border-radius:10px;
        border:1px solid rgba(1,190,110,1);
        padding: 30px;
        // height: 184px;
        margin-bottom: 22px;
        display: flex;
        justify-content: space-between;
        margin-top: 30px;
        position: relative;
        .left{
          p{
            font-size:28px;
            color:#333;
            span{
              &:nth-child(2){
                margin-left: 20px;
              }
            }
          }
        }
        .right{
          width:160px;
          height:68px;
          background:rgba(1,190,110,1);
          border-radius:8px;
          margin-top: 38px;
          color: #f7f7f7;
        }
        .status{
          position: absolute;
          top: 20px;
          right: 30px;
          width:160px;
          text-align: center;
        }
        .c_r{
          color: red !important;
        }
        .c_g{
          color: rgba(1,190,110,1) !important;
        }
      }
    }
  }
  
}
</style>

