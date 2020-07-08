<template>
  <div class="page">
    <m-header :title="type=='Buy'?'发布买单':'发布卖单'" :canback="Boolean(1)"></m-header>
    <section class="body" style="background:#F7F7F7 !important">
      <ul class="list">
        <li>
          <p>{{type=='Buy'?'买　　家':'卖　　家'}}</p>
          <input type="text" placeholder="系统自动读取用户名" :value="info.username" readonly>
        </li>
        <li>
          <p>{{type=='Buy'?'买家手机号':'卖家手机号'}}</p>
          <input type="text" placeholder="系统自动读取用户名" :value="info.mobile" readonly>
        </li>
        <li>
          <p>数　　量</p>
          <input type="number" placeholder="请输入数量" v-model="num">
        </li>
        <li>
          <p>单价范围</p>
          <input type="text" :value="qj" readonly>
        </li>
        <li>
          <p>单　　价</p>
          <input type="number" placeholder="请输入单价" v-model="price">
        </li>
        <li>
          <p>总金额</p>
          <input type="number" placeholder="系统自动结算" readonly :value="Number(num*price).toFixed(2)">
        </li>
        <li>
          <p>最低限额</p>
          <input type="number" placeholder="请输入最低限额" v-model="minnum">
        </li>
        <li v-if="type!='Buy'" class="kc">
          <p>实际扣除</p>
          <input type="number" placeholder="系统自动结算" :value="Number(+num + +num*(+data.fee/100||0)).toFixed(2)">
          <p class="right" >MGK</p>
        </li>
      </ul>
      <p class="ts" v-if="type!='Buy'">手续费：{{data.fee||0}}%</p>
      <p class="right" v-else>求购单一经发布不可撤销</p>
      <button @click="$refs['pwd'].open()">立即发布</button>
    </section>
    <m-load ref="load"></m-load>
    <m-pwd ref="pwd" @pay="pay"></m-pwd>
  </div>
</template>
<script>
import { Trade,Init } from "@/server/server.js";
import { Util, Load, Secret } from "@/assets/commonjs/utils.js";
import mPwd from '@/components/pwd-alert2.vue';
import { mapGetters, mapMutations } from "vuex";
export default {
    components:{
        mPwd
    },
  data() {
    return {
      type:null,
      data:{
        buymax: null,
        buymin: null,
        fee: null,
        sellmax: null,
        sellmin: null,
      },
      qj:null,
      info:{
        bgm: null,
        creditid: null,
        id: null,
        isreal: null,
        level: null,
        levelname: null,
        mobile: null,
        mobile2: null,
        realname: null,
        username: null,
      },
      num:null,
      price:null,
      minnum:null,
    };
  },
  mounted() {
    this.initData();
    this.getFee();
    this.getUser(this.uid);
  },
  computed: {
    ...mapGetters(["uid", "api", "bannerSrc", "coinTxt", "proData", "bgm"])
  },
  methods: {
    initData() {
      this.type = this.$route.query.type;
    },
    // 个人信息
    getUser(id){
        Init.getUser({id}).then(res=>{
            if(res.code ==1){
                // this.info = res.data[0];
                this.info = JSON.parse(Secret.decrypt(res.data))[0];
                console.log('info',this.info)
            }else {
                mui.toast(res.msg);
            }
        })
    },
    // 参数
    getFee(){
      Trade.getFee().then(res=>{
        if(res.code==1){
          this.data = res.data;
          if(this.type=='Buy'){
            this.qj = '￥ ' + (this.data.buymin||0) + '~ ￥' +  (this.data.buymax||0);
          }else{
            this.qj = '￥ ' + (this.data.sellmin||0) + '~ ￥' +  (this.data.sellmax||0);
          }
        }else{
          mui.toast(res.msg)
        }
      })
    },
    // 创建买卖单
    addOrder(paypwd){
      let params =  {
        paypwd,
        num:this.num,
        price:this.price,
        minnum:this.minnum,
      }
      Trade[this.type!='Buy'?'sellAddOrder':'buyAddOrder'](params).then(res=>{
        mui.toast(res.msg)
        if(res.code==1){
          setTimeout(()=>{
            this.$router.go(-1)
            console.log('666')
          },500)
        }
      })
    },
    pay(paypwd){
      this.addOrder(paypwd);
    }
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
    >.list{
      background-color: #fff;
      padding-left: 24px;
      li{
        height: 96px;
        line-height: 96px;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        position: relative;
        p{
          font-size:34px;
          color:#333333;
          flex: 4;
        }
        input{
          flex: 10;
          height: 96px;
          border: none;
          background-color: rgba(0, 0, 0, 0);
        }
        &:last-child{
          border-bottom: none;
        }
      }
      .kc{
        display: flex;
        justify-content: space-between;
        p{
          flex: 4;
        }
        input{
          // margin-right: 140px;
          flex: 7.5;
        }
        .right{
          text-align: right;
          margin-right: 30px;
          flex: 2;
        }
      }
    }
    .ts{
      font-size:28px;
      color:rgba(226,0,0,1);
      margin: 10px 30px 0;
    }
    >button{
      width:690px;
      height:88px;
      background:rgba(5,192,112,1);
      border-radius:8px;
      border:1px solid rgba(1,190,110,1);
      margin: 62px 30px 30px;
    }
  }
  
}
</style>

