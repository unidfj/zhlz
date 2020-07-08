import axios from 'axios'
import qs from 'qs'
import {Secret} from '@/assets/commonjs/utils.js';

/**
 * 基础模块
 */
export const Base = new class {
    constructor(){
        this.uploadApi = '/api/user/upload';  //上传
        this.sendcodeApi = '/api/sms/send';//验证码
        this.imgcodeApi = '/api/Captcha/get'; //图形验证码
        this.bankApi = '/api/user/getbank';//银行
        this.download = '/api/app/info'; //下载
        this.uploadWgtApi = '/api/upload/upFile';//上传wgt
        this.downloadWgtAPi = '/api/upload/downfile';//下载资源更新
        this.getVersionAPi = '/api/upload/getVersion'; //获取服务器版本号
        this.getTextApi =  '/api/app/gettext'; //币与按钮名称
        this.dataApi = '/api/index/getImg'; //基础数据
        this.textSeAPi = '/api/demo/test1';//测试加解密
        this.mesAPi = '/api/Notice/getNew';//弹窗公告
        this.mesReadAPi = '/api/Notice/saveread';//弹窗已读公告
        this.getZhImgApi = '/api/app/getZhImg'; //大厅图片
        

    }
    getZhImg(params){
        return axios.get(this.getZhImgApi,{params}).then((res)=>res.data); 
    }
    getMsg(){
        return axios.get(this.mesAPi).then((res)=>res.data);
    }
    readMsg(params){
        return axios.post(this.mesReadAPi,qs.stringify(params)).then((res)=>res.data);
    }
    getBank(){
        return axios.post(this.bankApi).then((res)=>res.data);
    }
    upload(params){
        return  axios.post(this.uploadApi,params).then((res)=>res.data);
    }
    sendCode(params){
        return axios.post(this.sendcodeApi,qs.stringify(params)).then((res)=>res.data); 
    }
    getImgCode(params){
        return axios.get(this.imgcodeApi,{params}).then((res)=>res.data); 
    }
    getDownload(){
        return axios.get(this.download).then((res)=>res.data); 
    }
    uploadWgt(params){
        return axios.post(this.uploadWgtApi,params).then((res)=>res.data); 
    }
    getVersion(){
        return axios.get(this.getVersionAPi).then((res)=>res.data); 
    }
    getText(){
        return axios.get(this.getTextApi).then((res)=>res.data); 
    }
    getData(){
        return axios.post(this.dataApi).then(res=>res.data)
    }
    getTest(params){
        return axios.get(this.textSeAPi,{params}).then(res=>res.data)
    }
}

/**
 * 用户模块
 */
 export const Init = new class {
     constructor(){
        this.registerApi = '/api/user/register';  //注册
        this.changepwdApi = '/api/user/getbackpass';  //修改密码
        this.backpwdApi = '/api/user/getbackpass';  //忘记密码
        this.userApi = '/api/user/getinfo'; //用户信息
        this.capitalApi = ''; //用户资产
        this.realApi = '/api/user/changeisreal';  //实名认证
        this.loginApi = '/api/user/login';  //登录
        this.backTradeApi = '/api/user/uppaypsw';//修改交易密码
        this.quitApi = '/api/user/logout';//退出登录
    }
     register(params){
        return  axios.post(this.registerApi,qs.stringify({data:Secret.encrypt(JSON.stringify(params))})).then((res)=>res.data)
    }
    changePwd(params){
        return  axios.post(this.changepwdApi,qs.stringify({data:Secret.encrypt(JSON.stringify(params))})).then((res)=>res.data)
    }
    backpwd(params){
        return  axios.post(this.backpwdApi,qs.stringify({data:Secret.encrypt(JSON.stringify(params))})).then((res)=>res.data)
    }
    getUser(params){
        return  axios.post(this.userApi,qs.stringify(params)).then((res)=>res.data)
    }
    getCapital(params){
        return  axios.post(this.capitalApi,qs.stringify(params)).then((res)=>res.data)
    }
    toReal(params){
        return  axios.post(this.realApi,qs.stringify({data:Secret.encrypt(JSON.stringify(params))})).then((res)=>res.data)
    }
    login(params){
        return  axios.post(this.loginApi,qs.stringify({data:Secret.encrypt(JSON.stringify(params))})).then((res)=>res.data)
    }
    backTrade(params){
        return  axios.post(this.backTradeApi,qs.stringify({data:Secret.encrypt(JSON.stringify(params))})).then((res)=>res.data)
    }
    quit(){
        return  axios.get(this.quitApi).then((res)=>res.data)
    }
 }
 

/**
 * 个人中心
 */
export const Owner = new class {
    constructor(){
        this.bespeakListApi = '';//预约列表
        this.teamApi = '/api/user/team';//团队
        this.kjfeeApi = '/api/user/getkjfee';//充值矿机费率
        this.payInfoApi = '/api/user/payinfo';//支付信息
        this.bindaliApi = '/api/user/uppay'; //支付宝绑定
        this.bindwechatApi = '/api/user/upwechar'; //微信绑定
        this.userCoinApi= '/api/user/getUserCoin'; //资产模块
        this.coinOrderApi = '/api/user/getCoinOrder';//明细 
        this.coinApi = '/api/user/getCoin';//矿机与推广收益
        this.transferApi = '/api/user/transfer';//转出
        this.shaituApi = '/api/usershow/add';  //晒图
        this.rechargeInfoApi = '/api/user/getRechargeInfo'; //矿机充值信息
        this.rechargeApi = '/api/user/addRechargeLog'; //充值信息
        this.booklistApi = '/api/booking/booking/getlog'; //预约记录
        this.sellInfoApi = '/api/order/order/getSellPay'; //预约记录
        this.bindbankApi = '/api/user/upbank'; //银行卡绑定
        this.payApi= '/api/order/order/payment'; //支付
        this.diallistApi = '/api/turntable/getlist';  //转盘奖品
        this.rewardApi = '/api/turntable/getreward';  //奖品

        // 矿机记录
        this.buystutasApi = '/api/order/order/buyStutas'; //抢矿中列表
        this.buystutas2Api = '/api/order/order/buyStutas2'; //抢矿收益中列表
        this.buyappealApi = '/api/order/order/buyAppeal'; //抢矿申诉列表
        
        // 转让记录
        this.sellstatusApi = '/api/order/order/sellStatus'; //待转让列表
        this.sellstatus2Api = '/api/order/order/sellStatus2'; //转让中列表
        this.sellstatus4Api = '/api/order/order/sellStatus4'; //转让完成列表
        this.sellappealApi = '/api/order/order/sellAppeal'; //转让申诉列表
        // 申诉记录
        this.setappealApi = '/api/order/order/setAppeal';  //申诉
        this.buyerApi = '/api/order/order/payment'; //买家信息

        this.contractApi = '/api/order/order/renewContract'; //续约

        this.sellLogApi = '/api/order/sell/getselllog';  //收益出售记录   !!!!暂时不用！！！
        this.setSellApi = '/api/order/sell/setselllog';  //收益出售

        this.applyApi = '/api/wallet/apply'; //提取
        this.applyLogApi = '/api/wallet/lists'; //提取记录
        this.rateApi = '/api/wallet/getRate'; //兑换比例
        this.titleApi = '/api/notice/gettitles';  //公告
        this.noticeDetailApi = '/api/notice/details';  //公告详情

        // 新增
        this.getbtapriceApi = '/api/user/getbtaprice';//获取bta当前币价
        this.btatowfApi = '/api/user/btatowf';//bta兑换微分
        this.addRechargeLogApi = '/api/user/addRechargeLog';//bta充值
        this.getRechargeInfoApi = '/api/user/getRechargeInfo';//获取bta充值页面的信息
        this.setmbApi = '/api/user/setmb';//设置备用手机号
        this.getmsgApi = '/api/booking/booking/getmsg';//获取预约和预约即抢的提示
        this.deloreApi = '/api/ore/ore/delore';//宠物销毁
        this.setbgmApi = '/api/user/setbgm';//设置背景音乐
        this.getisopenApi = '/api/ore/ore/getisopen';//获取是否开启宠物销毁功能和销毁的百分比
    }

    getisopen(params){
        return  axios.get(this.getisopenApi,{params}).then((res)=>res.data);
    }
    setbgm(params){
        return  axios.post(this.setbgmApi,qs.stringify(params)).then((res)=>res.data);
    }
    delore(params){
        return  axios.post(this.deloreApi,qs.stringify(params)).then((res)=>res.data);
    }
    getmsg(params){
        return  axios.get(this.getmsgApi,{params}).then((res)=>res.data);
    }
    setmb(params){
        return  axios.post(this.setmbApi,qs.stringify(params)).then((res)=>res.data);
    }
    getRechargeInfo(params){
        return  axios.get(this.getRechargeInfoApi,{params}).then((res)=>res.data);
    }
    addRechargeLog(params){
        return  axios.post(this.addRechargeLogApi,qs.stringify(params)).then((res)=>res.data);
    }
    btatowf(params){
        return  axios.post(this.btatowfApi,qs.stringify(params)).then((res)=>res.data);
    }
    getbtaprice(params){
        return  axios.get(this.getbtapriceApi,{params}).then((res)=>res.data);
    }
    getTeam(params){
        return  axios.post(this.teamApi,qs.stringify(params)).then((res)=>res.data);
    }
    getPayInfo(params){
        return  axios.get(this.payInfoApi,{params}).then((res)=>res.data);
    }
    getUserCoin(params){
        return  axios.get(this.userCoinApi,{params}).then((res)=>res.data);
    }
    getCoinOrder(params){
        return  axios.get(this.coinOrderApi,{params}).then((res)=>res.data);
    }
    getCoin(params){
        return  axios.post(this.coinApi,qs.stringify(params)).then((res)=>res.data);
    }
    getTransfer(params) {
        return axios.post(this.transferApi,qs.stringify({data:Secret.encrypt(JSON.stringify(params))})).then(res => res.data);
    }
    shaitu(params) {
        return axios.post(this.shaituApi,qs.stringify(params)).then(res => res.data);
    }
    getRechargeInfo(params) {
        return axios.post(this.rechargeInfoApi,qs.stringify(params)).then(res => res.data);
    }
    recharge(params) {
        return axios.post(this.rechargeApi,qs.stringify({data:Secret.encrypt(JSON.stringify(params))})).then(res => res.data);
    }
    getBooklist(params) {
        return axios.get(this.booklistApi,{params}).then(res => res.data);
    }
    getSellInfo(params) {
        return axios.get(this.sellInfoApi,{params}).then(res => res.data);
    }
    bindAli(params) {
        return axios.post(this.bindaliApi,qs.stringify({data:Secret.encrypt(JSON.stringify(params))})).then(res => res.data);
        // return axios.post(this.bindaliApi,qs.stringify(params)).then(res => res.data);
    }
    bindwechat(params) {
        return axios.post(this.bindwechatApi,qs.stringify({data:Secret.encrypt(JSON.stringify(params))})).then(res => res.data);
    }
    getOrder(params) {
        return axios.get(this.orderListApi,{params}).then(res => res.data);
    }
    addBank(params) {
        return axios.post(this.bindbankApi,qs.stringify({data:Secret.encrypt(JSON.stringify(params))})).then(res => res.data);
    }
    buyStutas(params){
        return axios.get(this.buystutasApi,{params}).then(res => res.data);
    }
    buyStutas2(params){
        return axios.get(this.buystutas2Api,{params}).then(res => res.data);
    }
    buyAppeal(params){
        return axios.get(this.buyappealApi,{params}).then(res => res.data);
    }
    sellStatus(params){
        return axios.get(this.sellstatusApi,{params}).then(res => res.data);
    }
    sellStatus2(params){
        return axios.get(this.sellstatus2Api,{params}).then(res => res.data);
    }
    sellStatus4(params){
        return axios.get(this.sellstatus4Api,{params}).then(res => res.data);
    }
    sellAppeal(params){
        return axios.get(this.sellappealApi,{params}).then(res => res.data);
    }
    setAppeal(params){
        return axios.post(this.setappealApi,params).then(res => res.data);
    }
    minePay(params){
        return axios.post(this.payApi,qs.stringify({data:Secret.encrypt(JSON.stringify(params))})).then(res => res.data);
    }
    buyer(params){
        return axios.get(this.buyerApi,{params}).then(res => res.data);
    }
    getDialList(params){
        return axios.get(this.diallistApi,{params}).then(res => res.data);
    }
    getReward(params){
        return axios.get(this.rewardApi,{params}).then(res => res.data);
    }
    contract(params){
        return axios.post(this.contractApi,qs.stringify(params)).then(res => res.data);
    }
    sellLog(){
        return axios.get(this.sellLogApi).then(res => res.data);
    }
    setSell(params){
        return axios.post(this.setSellApi,qs.stringify({data:Secret.encrypt(JSON.stringify(params))})).then(res => res.data);
    }
    apply(params){
        return axios.post(this.applyApi,qs.stringify(params)).then(res => res.data);
    }
    getapplyList(params){
        return axios.get(this.applyLogApi,{params}).then(res => res.data);
    }
    getrate(){
        return axios.get(this.rateApi).then(res => res.data);
    }
    getKjfee(){
        return axios.get(this.kjfeeApi).then(res => res.data);
    }
    getTitle(params){
        return axios.get(this.titleApi,{params}).then(res=>res.data)
    }
    getNoticeDetail(params){
        return axios.get(this.noticeDetailApi,{params}).then(res=>res.data)
    }
}

/**
 *  帮助中心 
 */
export const Help = new class {
    constructor(){
        this.getCategoryListApi = '/api/question/getCategoryList';//全部问题
        this.getAllListApi = '/api/question/getAllList'
        this.getDetailApi = '/api/question/getDetail';//问题详情
        this.getCenterApi = '/api/question/getCenter';
        this.feedbackApi = '/api/question/addFeedback';  //提交问题

    }
    getCategoryList(params) {
        return axios.get(this.getCategoryListApi,{params}).then((res) => res.data)
    }
    getAllList(params) {
        return axios.post(this.getAllListApi,qs.stringify(params)).then((res) => res.data)
    }

    getDetail(params) {
        return axios.post(this.getDetailApi,qs.stringify(params)).then((res) => res.data)
    }
    getCenter(params) {
        return axios.get(this.getCenterApi,{params}).then((res) => res.data)
    }
    addFeedback(params) {
        return axios.post(this.feedbackApi,qs.stringify(params)).then((res) => res.data)
    }
}

/**
 * 主页
 */
export const Index = new class {
    constructor(){
        // this.fa_blockApi = '/api/user/fa_block';  //矿机这也列表
        this.fa_blockApi = '/api/ore/ore/getorelevel';  //矿机这也列表
        this.miningApi = '/api/mining/mining/index';  //抢矿
        this.oreResultApi = '/api/mining/mining/getOreResult';  //抢矿结果
        this.bookingApi = '/api/booking/booking/setBooking';  //预约
        this.countDownApi = '/api/ore/ore/countDown'; //抢矿倒计时
        this.titleApi = '/api/notice/gettitles';  //公告
        this.bannerAPi = '/api/question/getTopImg';   //banner     
        this.subscribeApi = '/api/index/subscribe';  //预约人数


    }
    subscribe(){
        return axios.get(this.subscribeApi).then((res) => res.data)
    }
    getMine(){
        return axios.get(this.fa_blockApi).then((res) => res.data)
    }
    mining(params){
        return axios.get(this.miningApi,{params}).then((res) => res.data)
    }
    booking(params){
        return axios.get(this.bookingApi,{params}).then((res) => res.data)
    }
    getcountDown(params){
        return axios.post(this.countDownApi,qs.stringify(params)).then(res=>res.data)
    }
    getoreResult(params){
        return axios.post(this.oreResultApi,qs.stringify(params)).then(res=>res.data)
    }
    getTitle(params){
        return axios.get(this.titleApi,{params}).then(res=>res.data)
    }
    getBanner(){
        return axios.post(this.bannerAPi).then(res=>res.data)

    }
}

/**
 * 交易订单
 */
export const Trade = new class {
    constructor(){
        this.getpriceApi = '/api/sellorder/getprice';  //交易中心的显示的各种价格
        this.buylistApi = '/api/buyorder/buylist';  //买单中心的买单列表
        this.sellListApi = '/api/sellorder/sellList';  //卖单中心的卖单列表

        this.getFeeApi = '/api/sellorder/getFee';  //获取卖单手续费和买卖单的价格区间
        this.addOrderApi = '/api/sellorder/addOrder';  //创建卖单  
        this.buyAddOrderApi = '/api/buyorder/addOrder';  //创建买单  

        this.selldetailApi = '/api/sellorder/selldetail';  //卖单中心的卖单详情
        this.buydetailApi = '/api/buyorder/buydetail';  //买单中心的买单详情
        this.addOrderSellApi = '/api/buyorder/addOrderSell';  //通过卖单创建买单  
        this.addOrderBuyApi = '/api/sellorder/addOrderBuy';  //通过买单创建卖单  

        this.detail2Api = '/api/buyorder/detail';  //会员中心买单详情
        this.detailApi = '/api/sellorder/detail';  //会员中心卖单详情
        this.Tdetail2Api = '/api/buyorder/detail2';  //会员中心买单详情
        this.TdetailApi = '/api/sellorder/detail2';  //会员中心卖单详情
        this.getlistApi = '/api/sellorder/getlist';  //会员中心卖单列表
        this.getbuylistApi = '/api/buyorder/getlist';  //会员中心买单列表接口

        this.paymentApi = '/api/buyorder/payment';  //买单付款  
        this.setconfirmApi = '/api/sellorder/setconfirm';  //卖单确认  
        this.appealApi = '/api/sellorder/appeal';  //卖家申诉  
        this.abolish2Api = '/api/buyorder/abolish';  //取消买单
        this.abolishApi = '/api/sellorder/abolish';  //取消卖单
        
        this.getmsgApi = '/api/buyorder/getmsg';  //买入弹窗提示内容

        
        
    }
    getmsg(params){
        return axios.get(this.getmsgApi,{params}).then(res=>res.data)
    }
    abolish2(params){
        return axios.get(this.abolish2Api,{params}).then(res=>res.data)
    }
    abolish(params){
        return axios.get(this.abolishApi,{params}).then(res=>res.data)
    }
    appeal(params){
        return axios.post(this.appealApi,qs.stringify(params)).then(res=>res.data)
    }
    setconfirm(params){
        return axios.post(this.setconfirmApi,qs.stringify(params)).then(res=>res.data)
    }
    payment(params){
        return axios.post(this.paymentApi,qs.stringify(params)).then(res=>res.data)
    }
    buydetail(params){
        return axios.get(this.buydetailApi,{params}).then(res=>res.data)
    }
    detail2(params){
        return axios.get(this.detail2Api,{params}).then(res=>res.data)
    }
    detail(params){
        return axios.get(this.detailApi,{params}).then(res=>res.data)
    }
    dt2(params){
        return axios.get(this.Tdetail2Api,{params}).then(res=>res.data)
    }
    dt(params){
        return axios.get(this.TdetailApi,{params}).then(res=>res.data)
    }
    addOrderBuy(params){
        return axios.post(this.addOrderBuyApi,qs.stringify(params)).then(res=>res.data)
    }
    getbuylist(params){
        return axios.get(this.getbuylistApi,{params}).then(res=>res.data)
    }
    buylist(params){
        return axios.get(this.buylistApi,{params}).then(res=>res.data)
    }
    addOrderSell(params){
        return axios.post(this.addOrderSellApi,qs.stringify(params)).then(res=>res.data)
    }
    selldetail(params){
        return axios.get(this.selldetailApi,{params}).then(res=>res.data)
    }
    getlist(params){
        return axios.get(this.getlistApi,{params}).then(res=>res.data)
    }
    buyAddOrder(params){
        return axios.post(this.buyAddOrderApi,qs.stringify(params)).then(res=>res.data)
    }
    sellAddOrder(params){
        return axios.post(this.addOrderApi,qs.stringify(params)).then(res=>res.data)
    }
    getFee(params){
        return axios.get(this.getFeeApi,{params}).then(res=>res.data)
    }
    getprice(params){
        return axios.get(this.getpriceApi,{params}).then(res=>res.data)
    }
    sellList(params){
        return axios.get(this.sellListApi,{params}).then(res=>res.data)
    }
}

export const Mine = new class {
    constructor(){
        this.showApi = '/api/mill/show';  //获取活期/定期的矿机
        this.singleApi = '/api/mill/single';  //单个矿机详情
        this.buyApi = '/api/mill/buy';  //购买矿机  
        this.cancel_tipsApi = '/api/mill/cancel_tips';  //退租时提示
        this.cancelApi = '/api/mill/cancel';  //退租活期矿机  
        this.mymillApi = '/api/mill/mymill';  //我的矿机
        this.netincomeApi = '/api/mill/netincome';  //我的收益
        this.cancel_tips_newApi = '/api/mill/cancel_tips_new';  //新_取消矿机时的提示
        
        
    }
    cancel_tips_new(params){
        return axios.get(this.cancel_tips_newApi,{params}).then(res=>res.data)
    }
    netincome(params){
        return axios.get(this.netincomeApi,{params}).then(res=>res.data)
    }
    mymill(params){
        return axios.get(this.mymillApi,{params}).then(res=>res.data)
    }
    cancel(params){
        return axios.post(this.cancelApi,qs.stringify(params)).then(res=>res.data)
    }
    cancel_tips(params){
        return axios.get(this.cancel_tipsApi,{params}).then(res=>res.data)
    }
    buy(params){
        return axios.post(this.buyApi,qs.stringify(params)).then(res=>res.data)
    }
    single(params){
        return axios.get(this.singleApi,{params}).then(res=>res.data)
    }
    show(params){
        return axios.get(this.showApi,{params}).then(res=>res.data)
    }
}

