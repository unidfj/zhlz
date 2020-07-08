<template>
  <div class="page">
    <m-header :title="type=='Buy'?'买单详情':'卖单详情'" :canback="Boolean(1)"></m-header>
    <section class="body" style="background:#F7F7F7 !important">
      <!-- <div v-if="type=='Sell'&&data.status!=0&&data.status!=4">
        <div v-for="(v,i) in data" :key="i">
          <ul class="content" >
            <li>
              <p>数量：{{data.cnum}}</p>
            </li>
            <li>
              <p>单价：{{v.price}}</p>
            </li>
            <li>
              <p>总金额：{{v.total_money}}</p>
            </li>
            <li>
                <p>创建时间：{{formatDate(data.createtime)}}</p>
            </li>
            <li v-if="data.paytime">
                <p>付款时间：{{formatDate(data.paytime)}}</p>
            </li>
            <li>
              <p>状态：<span :class="{'c_r':v.status!=3&&v.status!=0,'c_g':v.status==3||v.status==0}">{{getStatus(v.status)}}</span></p>
            </li>

            <li class="sellpayinfo" v-if="v.status!=1&&v.imgurl">
              <p class="title">支付凭证</p>
              <div class="upload">
                  <img class="img" :src="api+v.imgurl" alt="">
              </div>
            </li>

            <li v-if="v.status==2&&ss_show">
              <p>申诉理由：</p>
              <input type="text" placeholder="请输入申诉理由" v-model="des">
            </li>

            <li class="sellpayinfo" v-if="v.status==2&&ss_show">
              <p class="title">上传申诉凭证</p>
              <div class="upload">
                  <input class="file" type="file" @change="upload($event,true)">
                  <img class="img" :src="src2" alt="">
              </div>
            </li>
          </ul>
          <button @click="openPwd(v.id)" v-if="(v.status==2&&type=='Sell')" class="btn">确认订单</button>
          <button @click="appeal(null,v.id)" v-if="(v.status==2&&type=='Sell')" class="btn btn_r">{{ss_show?'确认申诉':'申诉'}}</button>
        </div>
      </div> -->

      <div v-if="type=='Sell'&&data.status==4">
        <div v-for="(v,i) in data.appinfo" :key="i">
          <ul class="content" >
            <!-- <li>
              <p>状态：<span :class="{'c_r':v.status!=3&&v.status!=0,'c_g':v.status==3||v.status==0}">{{getStatus(v.status)}}</span></p>
            </li> -->
            <li v-if="type=='Buy'">
              <p>卖家手机号：{{v.mobile}}</p>
            </li>
            <li v-else>
              <p>买家手机号：{{v.mobile2}}</p>
            </li>
            <li>
              <p>订单编号：{{v.ordersn2}}</p>
            </li>

            <!-- 申诉理由 -->
            <li class="appeal">
              <p>申诉理由：{{v.des}}</p>
            </li>

            <li class="sellpayinfo" v-if="v.status!=1">
              <p class="title">申诉凭证</p>
              <div class="upload">
                  <img class="img" :src="api+v.image" alt="">
              </div>
            </li>
          </ul>
        </div>
      </div>

      <ul class="content" v-else>
        <li v-if="data.status!=0&&data.status!=99&&zd==0">
          <p>{{type=='Sell'?'买':'卖'}}家：{{list_data.username||'-'}}</p>
        </li>
        <li v-if="data.status!=0&&data.status!=99&&zd==0">
          <p>{{type=='Sell'?'买':'卖'}}家手机号：{{list_data.mobile||'-'}}</p>
        </li>
        <li v-if="data.status!=0&&data.status!=99&&zd==1">
          <p>{{type=='Sell'?'买':'卖'}}家：{{data.username||'-'}}</p>
        </li>
        <li v-if="data.status!=0&&data.status!=99&&zd==1">
          <p>{{type=='Sell'?'买':'卖'}}家手机号：{{data.mobile||'-'}}</p>
        </li>
        <!-- <li v-if="data.status==0">
          <p>数量：{{data.cnum}}</p>
        </li>
        <li v-else>
          <p>数量：{{data.num}}</p>
        </li> -->
        <li>
          <p>数量：{{data.cnum}}</p>
        </li>
        <li>
          <p>单价：{{data.price}}</p>
        </li>
        <li  v-if="data.status==0">
          <!-- <p>总金额：{{data.total_money}}</p> -->
          <p>总金额：{{Number(data.cnum*data.price).toFixed(4)}}</p>
        </li>
        <li v-else>
          <!-- <p>总金额：{{data.total_money}}</p> -->
          <p>总金额：{{Number(data.num*data.price).toFixed(4)}}</p>
        </li>
        <li>
            <p>创建时间：{{formatDate(data.createtime)}}</p>
        </li>
        <li v-if="data.paytime">
            <p>付款时间：{{formatDate(data.paytime)}}</p>
        </li>
        <li>
          <p>状态：<span :class="{'c_r':data.status!=3&&data.status!=0,'c_g':data.status==3||data.status==0}">{{getStatus(data.status)}}</span></p>
        </li>

        <li class="sellpayinfo" v-if="data.status==1&&type=='Buy'">
          <p class="title">收款方式 </p>
          <div v-if="payinfo&&payinfo.wechat_url&&zd==0">
            <img :src="api+payinfo.wechat_url" alt="">
            <p>微信</p>
          </div>
          <div v-if="payinfo&&payinfo.wechat_url&&zd==0">
            <img :src="api+payinfo.alipay_url" alt="">
            <p>支付宝</p>
          </div>

          <div v-if="list_data&&list_data.wechat_url&&zd==1">
            <img :src="api+list_data.wechat_url" alt="">
            <p>微信</p>
          </div>
          <div v-if="list_data&&list_data.wechat_url&&zd==1">
            <img :src="api+list_data.alipay_url" alt="">
            <p>支付宝</p>
          </div>
        </li>

        
        <li v-if="payinfo&&payinfo.bank&&zd==0">
          <p>银行名称：{{payinfo.bank}}</p>
        </li>
        <li v-if="payinfo&&payinfo.bankname&&zd==0">
          <p>支行名称：{{payinfo.bankname}}</p>
        </li>
        <li v-if="payinfo&&payinfo.bankuname&&zd==0">
          <p>账户姓名：{{payinfo.bankuname}}</p>
        </li>
        <li v-if="payinfo&&payinfo.bankact&&zd==0">
          <p>银行账号：{{payinfo.bankact}}</p>
        </li>

        
        <li v-if="list_data&&list_data.bank&&zd==1">
          <p>银行名称：{{list_data.bank}}</p>
        </li>
        <li v-if="list_data&&list_data.bankname&&zd==1">
          <p>支行名称：{{list_data.bankname}}</p>
        </li>
        <li v-if="list_data&&list_data.bankuname&&zd==1">
          <p>账户姓名：{{list_data.bankuname}}</p>
        </li>
        <li v-if="list_data&&list_data.bankact&&zd==1">
          <p>银行账号：{{list_data.bankact}}</p>
        </li>

        <li class="sellpayinfo" v-if="data.status==1&&type=='Buy'">
          <p class="title">上传支付凭证</p>
          <div class="upload">
              <input class="file" type="file" @change="upload($event)">
              <img class="img" :src="src" alt="">
          </div>
        </li>

        <!-- <li class="sellpayinfo" v-if="data.status==2&&type=='Buy'"> -->
        <li class="sellpayinfo" v-if="data.status==2">
          <p class="title">支付凭证</p>
          <div class="upload">
              <img class="img" :src="api+data.imgurl" alt="">
          </div>
        </li>

        
        <!-- <li class="sellpayinfo" v-if="data.status!=1&&data.imgurl">
          <p class="title">支付凭证</p>
          <div class="upload">
              <img class="img" :src="api+data.imgurl" alt="">
          </div>
        </li> -->

        <li v-if="data.status==2&&ss_show">
          <p>申诉理由：</p>
          <input type="text" placeholder="请输入申诉理由" v-model="des">
        </li>

        <li class="sellpayinfo" v-if="data.status==2&&ss_show">
          <p class="title">上传申诉凭证</p>
          <div class="upload">
              <input class="file" type="file" @change="upload($event,true)">
              <img class="img" :src="src2" alt="">
          </div>
        </li>


      </ul>
      <!-- <button @click="openPwd()" v-if="(data.status==1&&type=='Buy')&&(data.status==2&&type=='Sell')">{{type!="Sell"?'立即买入':'立即卖出'}}</button> -->
      <button @click="openPwd()" v-if="data.status==1&&type=='Buy'"  class="btn">立即买入</button>
      
      <button @click="openPwd(data.id)" v-if="(data.status==2&&type=='Sell')" class="btn">确认订单</button>
      <button @click="appeal(null,data.id)" v-if="(data.status==2&&type=='Sell')" class="btn btn_r">{{ss_show?'确认申诉':'申诉'}}</button>
      <button @click="qx" v-if="data.status==0"  class="btn">撤单</button>
      
    </section>
    <m-pwd ref="pwd" @pay="pay"></m-pwd>
    <m-load ref="load"></m-load>
  </div>
</template>
<script>
import { Trade,Init,Base  } from "@/server/server.js";
import { Util, Load, Secret,HB } from "@/assets/commonjs/utils.js";
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
        min_num: null,
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
        sellinfo:[{
          mobile:null,
          username:null,
          sellpayinfo:{
            alipay_url:null,
            wechat_url:null,
          },
        }]
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
      imgurl:null,
      imgurl2:null,
      src: require("@/assets/images/gzlz/upload.png"),
      src2: require("@/assets/images/gzlz/upload.png"),
      buyid:null,
      ss_show:false,
      des:null,
      buy_id:null,
      sell_id:null,
      zd:null,
      list:[],
      list_data:{
        alipay_url: null,
        alipayact: null,
        alipayname: null,
        bank: null,
        bankact: null,
        bankname: null,
        bankuname: null,
        wechat_url: null,
        wechatact: null,
        wechatname: null
      },
      buy_id:null,
      sell_id:null,
      payinfo:{},
    };
  },
  mounted() {
    this.initData();
    this.getFee();
  },
  computed: {
    ...mapGetters(["uid", "api", "bannerSrc", "coinTxt", "proData", "bgm"])
  },
  methods: {
    initData() {
      this.type = this.$route.query.type;
      this.id = this.$route.query.id;
      this.buy_id = this.$route.query.buy_id;
      this.sell_id = this.$route.query.sell_id;
      this.zd = this.$route.query.zd;

      if(this.type=='Buy'&&this.buy_id){
        this.dt2()
      }else if(this.type=='Sell'&&this.sell_id){
        this.dt();
      }else{
        this.selldetail();
      }
      
    },
    formatDate(v){
      return Util.formatDate(v)
    },
    // 订单详情
    selldetail(){
      Trade[this.type=="Sell"?'detail':'detail2']({id:this.id}).then(res=>{
        if(res.code==1){
          this.data = res.data;
          this.list_data = this.type=='Sell'?this.data.buyinfo[0]:this.data.sellinfo[0]
          this.payinfo = this.type=='Sell'?this.list_data.buypayinfo:this.list_data.sellpayinfo

          this.buy_id = this.type=='Sell'?res.data.id:this.list_data.id;
          this.sell_id = this.type!='Sell'?res.data.id:this.list_data.id;
        }else{
          mui.toast(res.msg)
        }
      })
    },
    // 订单详情
    dt2(){
      Trade.dt2({id:this.id,buy_id:this.buy_id,sell_id:this.sell_id}).then(res=>{
        if(res.code==1){
          let data = res.data;
          this.data = Array(...data.sellinfo)[0];
          this.list_data = this.data.sellpayinfo;
          this.buy_id = res.data.id;
          this.sell_id = this.data.id;
          console.log('data',this.data.buy_id)
          // this.data = res.data;
        }else{
          mui.toast(res.msg)
        }
      })
    },
    // 订单详情
    dt(){
      console.log('666666666')
      Trade.dt({id:this.id,buy_id:this.buy_id,sell_id:this.sell_id}).then(res=>{
        if(res.code==1){
          let data = res.data;
          this.data = Array(...data.buyinfo)[0];
          this.list_data = this.data.buypayinfo;
          this.sell_id = res.data.id;
          this.buy_id = this.data.id;
          console.log('data',this.data)
        }else{
          mui.toast(res.msg)
        }
      })
    },
    // 取消详情
    qx(){
      let _this = this;
      function qx2(){
        Trade[_this.type=="Sell"?'abolish':'abolish2']({id:_this.id}).then(res=>{
          mui.toast(res.msg)
          if(res.code==1){
            setTimeout(()=>{
              _this.$router.go(-1)
            },500)
          }
        })
      }
      
      try{
          if(plus){
              mui.confirm('确认取消订单？',actions=>{
                  if(actions.index==0)
                  qx2();
              })
          }
      }catch(e){
          mui.confirm('确认取消订单？',actions=>{
              if(actions.index==1)
              qx2();
          })
      }
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
    // 申诉
    appeal(paypwd,id){
      if(!this.ss_show){
        this.ss_show = true;
        if(id) this.buyid = id;
        return;
      }
      if(!paypwd&&this.ss_show){
        this.$refs['pwd'].open()
        return;
      }
      let params = {
        paypwd,
        // sellid:this.sell_id,
        // buyid:this.buy_id,
        buyid:this.zd!=0?this.buy_id:this.sell_id,
        sellid:this.zd!=0?this.sell_id:this.buy_id,
        // buyid:this.buy_id,
        // sellid:this.sell_id,
        imgurl:this.imgurl2,
        des:this.des
        
      }
      console.log('params',params)

      Trade.appeal(params).then(res=>{
        mui.toast(res.msg)
        if(res.code==1){
          setTimeout(()=>{
            this.$router.go(-1)
          },500)
        }
      })
    },
    // 卖家确认
    setconfirm(paypwd){
      let params = {
        paypwd,
        sellid:this.zd==0?this.buy_id:this.sell_id,
        buyid:this.zd==0?this.sell_id:this.buy_id 
      }
      Trade.setconfirm(params).then(res=>{
        mui.toast(res.msg)
        if(res.code==1){
          setTimeout(()=>{
            this.$router.go(-1)
          },500)
        }
      })
    },
    // 买单付款
    payment(paypwd){
      let params = {
        imgurl:this.imgurl,
        paypwd,
        sellid:this.zd==0?this.buy_id:this.sell_id,
        buyid:this.zd==0?this.sell_id:this.buy_id 
      }
      console.log('params',params)
      Trade.payment(params).then(res=>{
        mui.toast(res.msg)
        if(res.code==1){
          setTimeout(()=>{
            this.$router.go(-1)
          },500)
        }
      })
    },
    pay(paypwd){
      if(this.type=='Buy'){
        this.payment(paypwd)
      }else if(this.type=='Sell'&&this.ss_show){
        this.appeal(paypwd)
      }else{
        this.setconfirm(paypwd)
      }
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
    // 上传图片
    upload(event,bl){
        let _This = this;
        let formData = new FormData();
        Load.loadStart(_This);            
        HB.uploadImgLimit2(event.target.files[0],url=>{
            formData.append('image',url);
            Base.upload(formData).then((res)=>{
                Load.loadEnd(_This);
                if(res.code == 1){
                    if(bl){
                      _This.imgurl2 = res.data
                      _This.src2 = _This.api+res.data
                    }else{
                      _This.imgurl = res.data
                      _This.src = _This.api+res.data
                    }
                }else {
                    mui.toast(res.msg);
                    return ;
                }
            })
        })
    },
    openPwd(id){
      if(this.type=='Sell'){
        this.buyid = id;
        this.ss_show = false;
      }
      this.$refs['pwd'].open();
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
          .c_r{
            color: red !important;
          }
          .c_g{
            color: rgba(1,190,110,1) !important;
          }
        }
        input{
          height: 60px;
          border: none;
          flex: 10;
          margin: 0;
        }
      }
      .sellpayinfo{
        display: block;
        .title{
          font-weight: 550;
          font-size: 28px;
          display: block;
        }
        >div{
          display: inline-block;
          margin: 30px;
          img{
            width: 200px;
            height: 200px;
            background-color: #ccc;
            display: block;
          }
          p{
            text-align: center;
          }
        }
        .upload{
          width: 560px;
          height: 300px;
          position: relative;
          >img{
            width: 100%;
            height: 100%;
          }
          >.file{
            width: 100%;
            height: 200%;
            position: absolute;
            top: 0;
            left: 0;
            opacity: 0;
          }
        }
      }
      .appeal{
        height: auto;
        p{
          height: auto;
        }
      }
    }
    .btn{
      width:690px;
      height:88px;
      background:rgba(5,192,112,1);
      border-radius:8px;
      border:1px solid rgba(1,190,110,1); 
      margin: 0 30px 30px;
    }
    .btn_r{
      background-color: red;
      border: none;
    }
  }
  
}
</style>

