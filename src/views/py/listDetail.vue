<template>
  <div class="page">
    <m-header :title="type=='Buy'?'买单详情':'卖单详情'" :canback="Boolean(1)"></m-header>
    <section class="body" style="background:#F7F7F7 !important">
      <ul class="content">
        <li>
          <p>卖家：{{data.username}}</p>
        </li> 
        <li>
          <p>卖家手机号：{{data.mobile}}</p>
        </li>
        <li>
          <p>数量：{{data.cnum}}</p>
        </li>
        <li>
          <p>购买数量：</p>
          <!-- <input type="number" :placeholder="`请输入购买数量,最低交易数量为${Number(data.min_num)}`" v-model="num"> -->
          <input type="number" :placeholder="`请输入购买数量`" v-model="num">
        </li>
        <li>
          <p>单价：{{data.price}}</p>
        </li>
        <li>
          <!-- <p>总金额：{{data.total_money}}</p> -->
          <p>总金额：{{Number(data.cnum*data.price).toFixed(4)}}</p>
        </li>
      </ul>
      <p class="ts">最低交易数量为{{Number(data.min_num)}}</p>
      <button @click="openMsg" v-if="type=='Sell'">立即买入</button>
      <button @click="$refs['pwd'].open()" v-else >立即卖出</button>
    </section>
    <m-pwd ref="pwd" @pay="pay"></m-pwd>
    <m-load ref="load"></m-load>
  </div>
</template>
<script>
import { Trade, Init, Mine } from '@/server/server.js';
import { Util, Load, Secret } from "@/assets/commonjs/utils.js";
import { mapGetters, mapMutations } from "vuex";
import mPwd from '@/components/pwd-alert2.vue';
export default {
  components:{
      mPwd
  },
  data() {
    return {
      type:null,
      id:null,
      data:{
        buy_id: null,
        cnum: null,
        completetime: null,
        createtime: null,
        fee: null,
        fee2: null,
        handletime: null,
        id: null,
        imgurl: null,
        min_num: 0,
        money: null,
        num: null,
        oldstatus: null,
        ordersn: null,
        price: null,
        qrtime: null,
        remark: null,
        status: null,
        total_money: null,
        type: null,
        uid: null,
        updatetime: null,
        username: null,
      },
      data2:{
        buymax: null,
        buymin: null,
        fee: null,
        sellmax: null,
        sellmin: null,
      },
      qj:null,
      num:null,
      msg:null,
    };
  },
  mounted() {
    this.initData();
    this.selldetail();
    this.getFee();
    this.getmsg();
  },
  computed: {
    ...mapGetters(["uid", "api", "bannerSrc", "coinTxt", "proData", "bgm"])
  },
  methods: {
    initData() {
      this.type = this.$route.query.type;
      this.id = this.$route.query.id;
    },
    // 立即买入
    openMsg(){
      try{
          if(plus){
              mui.confirm(this.msg,actions=>{
                  if(actions.index==0)
                  this.addOrderSell();
              })
          }
      }catch(e){
          mui.confirm(this.msg,actions=>{
              if(actions.index==1)
              this.addOrderSell();
          })
      }
    },
    // 买入弹窗提示内容
    getmsg(){
      Trade.getmsg().then(res=>{
        if(res.code==1){
          this.msg = res.data;
        }else{
          mui.toast(res.msg)
        }
      })
    },
    // 订单详情
    selldetail(){
      Trade[this.type=='Sell'?'selldetail':'buydetail']({id:this.id}).then(res=>{
        if(res.code==1){
          this.data = res.data;
        }else{
          // mui.toast(res.msg)
          this.$router.go(-1)
        }
      })
    },
    // 参数
    getFee(){
      Trade.getFee().then(res=>{
        if(res.code==1){
          this.data2 = res.data;
          if(this.type=='Buy'){
            this.qj = '￥' + (this.data2.buymin||0) + ' ~ ￥' +  (this.data2.buymax||0);
          }else{
            this.qj = '￥' + (this.data2.sellmin||0) + ' ~ ￥' +  (this.data2.sellmax||0);
          }
        }else{
          mui.toast(res.msg)
        }
      })
    },
    // 通过卖单创建买单
    addOrderSell(paypwd){
      let params = {
        paypwd,
        num:this.num,
        id:this.id
      }
      Trade[this.type=="Sell"?'addOrderSell':'addOrderBuy'](params).then(res=>{
        mui.toast(res.msg)
        if(res.code==1){
          setTimeout(()=>{
            
            if(this.type=='Sell'){
              this.$router.push({name:'orderDetail',query:{type:'Buy',id:res.data.orderid,zd:0}})
            }else{
              this.$router.go(-1)
            }
          },500)
        }
      })
    },
    pay(paypwd){
      this.addOrderSell(paypwd);
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
    .content{
      margin: 30px 30px 50px;
      width: 690px;
      width:690px;
      background:rgba(255,255,255,1);
      border-radius:10px;
      border:1px solid rgba(1,190,110,1);
      padding:  10px 30px;
      li{
        display: flex;
        justify-content: space-between;
        p{
          color: #333;
          height: 60px;
          line-height: 60px;
        }
        input{
          height: 60px;
          border: none;
          flex: 10;
          margin: 0;
          padding-right: 0;
        }
      }
    }
    .ts{
      color: red;
      margin-left: 40px;
      margin-bottom: 30px;
    }
    >button{
      width:690px;
      height:88px;
      background:rgba(5,192,112,1);
      border-radius:8px;
      border:1px solid rgba(1,190,110,1); 
      margin: 0 30px;
    }
  }
  
}
</style>

