<template>
  <div class="page">
    <m-header title="MGK兑换海星" :canback="Boolean(1)"></m-header>
    <div class="body">
      <form>
        <ul>
          <li class="list">
            <div class="title">请输入MGK数量</div>
            <input type="number" class="inp" v-model="num" placeholder="请输入MGK数量">
          </li>
          <li class="list">
            <div class="title">可兑换的海星数量</div>
            <!-- <input type="text" class="inp" :value="Number(num*dis).toFixed(2)" placeholder="请输入数量"> -->
            <!-- <input type="text" class="inp" :value="Number(Math.floor(1/price)*num*(dis==0?1:dis)).toFixed(2)" placeholder="请输入数量" readonly> -->
            <!-- <input type="number" class="inp" :value="val" placeholder="请输入数量" readonly> -->
            <input type="number" class="inp" v-model="val" placeholder=" " readonly>
          </li>
          <!-- <li class="list poundage" >当前折扣：{{dis}}</li> -->
          <li class="list poundage" >当前币价：{{price}}</li>
          <!-- <li  class="list poundage" >MGK币单价为{{price}}＋（{{price}}×{{per}}%）={{price+price*per}}元</li> -->
        </ul>
        <div class="sub" @click="$refs['pwd'].open()">兑换</div>
      </form>
    </div>
    <m-pwd ref="pwd" @pay="pay"></m-pwd>
  </div>
</template>
<script>
import {Owner} from '@/server/server.js';
import {Util} from '@/assets/commonjs/utils.js';
import {mapGetters} from 'vuex';
import mPwd from '@/components/pwd-alert.vue';
export default {
  components:{
      mPwd
  },
  data() {
    return {
      type:null,
      dis:null,
      price:null,
      num:null,
      per:null,
      val:0,
    };
  },
  mounted() {
      this.initData();
      this.getbtaprice()
  },
  computed:{
    ...mapGetters(['coinTxt'])
  },
  watch:{
    'num'(){
      // this.val = Number(Math.floor(1/(this.price>1?1:this.price))*this.num*(this.dis==0?1:this.dis)).toFixed(2)
      this.val = Number(this.price*this.num).toFixed(2)
      console.log(this.val)
      // this.val = Number(Math.floor(1/1.2)*this.num*(this.dis==0?1:this.dis)).toFixed(2)
    }
  },
  methods:{
    initData(){
      
    },
    // 获取bta当前币价
    getbtaprice(){
      Owner.getbtaprice().then(res=>{
        if(res.code==1){
          this.dis = res.data.dis;
          this.price = res.data.price;
          this.per = res.data.per;

          console.log(this.dis)
        }else{
          mui.toast(res.msg)
        }
      })
    },
    // 兑换
    btatowf(pwd){
      Owner.btatowf({num:this.num,pwd}).then(res=>{
        mui.toast(res.msg)
        if(res.code==1){
          
        }
      })
    },
    extractRecord(){
        this.$router.push({name:'ExtractRecord',query:{type:this.type}})
    },
    pay(pwd){
      this.btatowf(pwd)
    }
  }
};
</script>
<style lang="less" scoped>
@import "~link-less";
.body {
  background: @bg-color;
  padding: 0 30px 30px;
  // color: #dbd9ec;
  color: #000;
  font-size: 32px;
  .list {
    position: relative;
    margin-top: 29px;
    .inp {
      margin-top: 29px;
      margin-bottom: 0;
      height: auto;
      background: @easy-black;
    }
  }
  .poundage {
    color: #8886a0;
    font-size: 28px;
  }
  .sub {
    margin-top: 130px;
    height: 88px;
    line-height: 88px;
    text-align: center;
    color: @bg-color-white;
    background: @btn-primary-color;
    border-radius: 8px;
  }
}
</style>
