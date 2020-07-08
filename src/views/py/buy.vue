<template>
  <div class="page">
    <m-header title="交易大厅"></m-header>
    <section class="body" style="background:#F7F7F7 !important" :style="'height:'+(screenHeight-100)+'px;overflow:auto;'" v-lazy-load="lazyLoad">
      <!-- 币价信息 -->
      <div class="top">
        <ul class="top">
          <li v-for="(v,i) in top_list" :key="i">
            <p>{{v.title}}</p>
            <p>{{v.pic}}</p>
          </li>
        </ul>
        <ul class="bot">
          <li v-for="(v,i) in bot_list" :key="i">
            <p>{{v.title}}</p>
            <p v-if="i!=2&&i!=3">{{v.pic}}</p>
            <p v-else :class="{'c_g':v.pic>0,'c_r':v.pic<0}">{{v.pic>0?'+':''}}{{v.pic}}%</p>
          </li>
        </ul>
      </div>

      <!-- 订单排序选择 -->
      <div class="center">
        <ul class="left">
          <li  @click="sellList(0)">
            <p>最新</p>
            <i :class="{'iconfont':true,'icontubiaozhizuo-1':sort==0}"></i>
          </li>
          <li @click="sellList(1)">
            <p>单价-高</p>
            <i :class="{'iconfont':true,'icontubiaozhizuo-':sort==1,'icontubiaozhizuo-1':sort!=1}"></i>
          </li>
          <li @click="sellList(3)">
            <p>单价-低</p>
            <i :class="{'iconfont':true,'icontubiaozhizuo-':sort==3,'icontubiaozhizuo-1':sort!=3}"></i>
          </li>
        </ul>
        <button class="right"  @click="$router.push({name:'myOrder',query:{type}})">我的订单</button>
      </div>

      <!-- 订单列表 -->
      <ul class="list">
        <li v-for="(v,i) in list" :key="i" @click="$router.push({name:'listDetail',query:{type,id:v.id}})">
          <div class="left">
            <p>卖家：{{String(v.mobile).substring(0,3)}}****{{String(v.mobile).substring(7,11)}}</p>
            <p>区块编号：{{v.ordersn}}</p>
            <p>
              <span>单价：￥{{v.price}}</span>
              <span>数量：{{v.cnum}}</span>
            </p>
            <!-- <p>总额：￥{{v.total_money}}</p> -->
            
            <!-- <p>
              <span>总额：￥{{Number(v.price*v.cnum).toFixed(2)}}</span>
              <span>最低交易数量：{{v.min_num}}起</span>
            </p> -->
            <p>总额：￥{{Number(v.price*v.cnum).toFixed(2)}}</p>
            <p>最低交易数量：{{v.min_num}}起</p>
          </div>
          <button class="right">卖出</button>
          <!-- <p class="time">{{formatDate(v.createtime)}}</p> -->
        </li>
      </ul>

      <!-- 发布订单 -->
      <div class="new" @click="$router.push({name:'News',query:{type}})">发布</div>
    </section>
    <footer2 :footer_list="footer_list"></footer2>
    <m-load ref="load"></m-load>
  </div>
</template>
<script>
import { Trade } from "@/server/server.js";
import { Util, Load, Secret } from "@/assets/commonjs/utils.js";
import { mapGetters, mapMutations } from "vuex";
import footer2 from '@/components/footer2.vue';
export default {
  components:{
      footer2
  },
  data() {
    return {
      top_list:[
        {
          title:'今日成交价',
          pic:'',
        },
        {
          title:'今日最高价',
          pic:'',
        },
        {
          title:'最新一笔价',
          pic:'',
        },
        {
          title:'昨日成交量',
          pic:'',
        },
      ],
      bot_list:[
        {
          title:'昨日收盘价',
          pic:'',
        },
        {
          title:'当前币价',
          pic:'',
        },
        {
          title:'今日涨跌',
          pic:'',
        },
        {
          title:'总涨跌幅',
          pic:'',
        },
      ],
      footer_list:[
        {
          title:'首页',
          icon:'iconfont iconshouye',
          route:'PanGold',
        },
        {
          title:'卖单中心',
          icon:'iconfont iconmaidan3',
          route:'Sell',
        },
        {
          title:'买单中心',
          icon:'iconfont iconmaidan2',
          route:'Buy',
        },
      ],
      list:[],
      data:{
        avgprice: null,
        maxprice: null,
        mgkprice: null,
        newsprice: null,
        ydnum: null,
        zdper: null,
        zhprice: null,
      },
      sort:0,
      type:'Buy',
      
      screenHeight:null,
      page:1,
      noMore:false,

    };
  },
  mounted() {
    this.initData();
    this.sellList();
    this.getprice();
  },
  computed: {
    ...mapGetters(["uid", "api", "bannerSrc", "coinTxt", "proData", "bgm"])
  },
  methods: {
    initData() {
      sessionStorage.setItem('btmNav2',2);
    },
    formatDate(v){
      return Util.formatDate(v)
    },
    
    lazyLoad(){
        this.page = this.page+1;
        console.log('page',this.page)
        if(!this.noMore){
          this.sellList();
        }
    },

    // 币价信息
    getprice(){
      Trade.getprice().then(res=>{
        if(res.code==1){
          this.data = res.data;
          this.top_list[0].pic = res.data.avgprice
          this.top_list[1].pic = res.data.maxprice
          this.top_list[2].pic = res.data.newsprice
          this.top_list[3].pic = res.data.ydnum
          this.bot_list[0].pic = res.data.zhprice
          this.bot_list[1].pic = res.data.mgkprice 
          this.bot_list[2].pic = res.data.zdper
          this.bot_list[3].pic = res.data.totalper
          
        }else{
          mui.toast(res.msg)
        }
      })
    },
    // 订单列表
    sellList(sort){
      switch(+sort){
        case 0:
          if(this.sort==0) return;
          this.sort = 0;
          break;
        case 1:
          this.sort = this.sort==1?2:1;
          break;
        case 3:
          this.sort = this.sort==3?4:3;
          break;
      }
      if(sort){
          this.list = [];
          this.page = 1;
          this.noMore = false;
      }
      Trade[this.type=="Sell"?'sellList':'buylist']({page:this.page,sort:this.sort}).then(res=>{
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
    >.top{
      width:690px;
      height:275px;
      background:linear-gradient(90deg,rgba(47,229,148,1) 0%,rgba(3,191,111,1) 100%);
      border-radius:10px;
      margin: 30px 30px 20px;
      padding: 40px 40px 0;
      ul{
        display: flex;
        justify-content: space-between;
        li{
          flex: 1;
          p{
            text-align: center;
            color: #fff;
            font-size:24px;
            &:last-child{
              font-size:34px;
              font-weight:600;
              margin-top: 6px;
            }
          }
          .c_g{
            font-size:34px;
            font-weight:600;
            color:rgba(162,255,137,1);
          }
          .c_r{
            font-size:34px;
            font-weight:600;
            color:rgba(226,0,0,1);
          }
        }
      }
      >.top{
        
      }
      >.bot{
        margin-top: 30px;
        display: flex;
        justify-content: space-between;
        li{
          flex: 10;
          &:nth-child(2){
            // flex: 20;
          }
        }
      }
    }
    >.center{
      display: flex;
      justify-content: space-between;
      width: 690px;
      margin: 0 30px 22px;
      .left{
        li{
          display: inline-flex;
          justify-content: space-between;
          background-color: #fff;
          border-radius: 10px;
          padding: 0px 15px;
          margin-right: 16px;
          height: 58px;
          line-height: 58px;
          p{
            font-size:28px;
            color:#333;
            margin-right: 16px;
          }
          i{
            font-size:20px;
            color:#aaa;
          }
        }
      }
      .right{
        height: 58px;
        background-color: #01BE6E;
        padding: 10px 24px;
        border-radius: 8px;
        font-size: 28px;
        color: #F7F7F7;
      }
    }
    >.list{
      width: 690px;
      margin: 0 30px 120px;
      li{
        background:rgba(255,255,255,1);
        border-radius:10px;
        border:1px solid rgba(1,190,110,1);
        padding: 30px 30px 30px;
        // height: 184px;
        margin-bottom: 22px;
        display: flex;
        justify-content: space-between;
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
          margin-top: 48px;
          color: #f7f7f7;
        }
        
        .time{
          position: absolute;
          top: 26px;
          right: 30px;
          color: red;
        }
      }
    }
    >.new{
      width: 110px;
      height: 110px;
      border-radius: 50%;
      box-shadow:0px 0px 10px 0px rgba(1,190,110,0.24);
      background-color: #fff;
      border:1px solid rgba(1,190,110,.6);
      line-height: 110px;
      font-size:32px;
      color:rgba(1,190,110,1);
      text-align: center;
      position: fixed;
      bottom: 140px;
      right: 30px;
    }
  }
}
</style>

