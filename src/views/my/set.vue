<template>
	<div class="page">
		<m-header title="其他设置" :canback="Boolean(1)"></m-header>
		<section :class="{'body':true,'toscale':cut}">
			<ul class="list">
				<li class="item">
					<span>用户名</span>
					<span>{{userInfo?userInfo.username:'-'}}</span>
				</li>
				<li class="item">
					<span>手机号</span>
					<span>{{userInfo?userInfo.mobile:'-'}}</span>
				</li>
				<router-link class="item" :to="{name:item.route,query:{type:item.type}}" v-for="(item,index) in navList" :key="index">
					<span>{{item.name}}</span>
					<i class="iconfont iconright"></i>
				</router-link>
				<li class="item" v-if="isApp">
					<span>版本号</span>
					<span>v{{version?version:'1.0'}}</span>
				</li>
				<li class="item" @click.stop="changeSe">
					<span>背景音乐开关</span>
					<!-- <span>v{{version?version:'1.0'}}</span> -->
					<div :class="{'bgc':true,'se':se}">
						<div></div>
					</div>
				</li>
				<!-- <li>
                    <audio :autoplay="se" :src="mp3"  class="mp3" id="mp3" ref="mp3"></audio>
				</li>-->
				<!-- <li class="item" @click="aliPay">
                    <span>支付宝支付</span>
				</!-->
				<!-- <li class="item" @click="wechatPay">
                    <span>微信支付</span>
				</li>-->
			</ul>
			<button class="btn btn-blue btn-quit" @click="toQuit">退出登录</button>
		</section>
		<m-load ref="load"></m-load>
		<img class="myImg" v-show="myImg" :src="myImg" style="width:100%;height:100%;position:fixed;top:0;left:0;z-index:10;" alt />
	</div>
</template>
<script>
import { Init, Base, Owner } from '@/server/server.js'
import { Util, Load, HB, Pay } from '@/assets/commonjs/utils.js'
import { mapGetters, mapMutations } from 'vuex'
export default {
	name: 'set',
	data() {
		return {
			isApp: false,
			navList: [
				{
					name: '修改登录密码',
					route: 'SetPwd',
					type: 'login'
				},
				{
					name: '修改交易密码',
					route: 'SetPwd',
					type: 'trade'
				},
				{
					name: '晒图奖励',
					route: 'ShaiTu',
					type: ''
				}
				// {
				//     name:'关于',
				//     route:'CheckUpdate',
				//     type:''
				// },
			],
			myImg: null,
			cut: false,
			se: true
			// mp3:require('@/assets/images/01.mp3'),
		}
	},
	// created() {
	//     Pay._init(); //支付初始化
	// },
	mounted() {
		let mp3 = document.getElementById('mp3')
		this.se = !mp3.paused
	},
	computed: {
		...mapGetters(['userInfo', 'version', 'api'])
	},
	methods: {
		...mapMutations([
			'saveUserInfo',
			'saveUserID',
			'saveCoinTxt',
			'saveProData',
			'saveVersion',
			'saveBGM'
		]),
		initData() {
			try {
				if (plus) {
					this.isApp = true
				}
			} catch (e) {}
			HB.getVersion(data => {
				localStorage.setItem('version', data)
				this.saveVersion(data)
			})
		},
		changeSe() {
			this.se = !this.se
			// this.$refs.mp3[this.se?'play':'pause']()
			// this.saveBGM(this.se)
			let mp3 = document.getElementById('mp3')
			mp3[this.se ? 'play' : 'pause']()
			localStorage.setItem('bgm', this.se ? 1 : 0)
			// console.log('bgm',localStorage.getItem('bgm'))

			// console.log(mp3)
			// console.log(mp3.paused)
			// Owner.setbgm({bgm:this.se?1:0}).then(res=>{
			//     if(res.code==1){
			//         localStorage.setItem('bgm',this.se?1:0)
			//     }else{
			//         mui.toast(res.msg)
			//     }
			// })
		},
		// aliPay(){
		//     Pay.pay('alipay');
		// },
		// wechatPay(){
		//     Pay.pay('wxpay');
		// },
		configAli(data) {
			let alipayConfig = {
				biz_content: data.biz_content,
				app_id: data.app_id,
				version: data.version,
				format: data.format,
				sign_type: data.sign_type,
				method: 'alipay.trade.wap.pay' || data.method,
				notify_url: data.notify_url,
				return_url: data.return_url,
				charset: data.charset,
				sign: data.sign,
				timestamp: data.timestamp
			}
			this.httpPost(
				'https://openapi.alipaydev.com/gateway.do',
				alipayConfig
			)
		},
		httpPost(URL, PARAMS) {
			var temp = document.createElement('form')
			temp.action = URL
			temp.method = 'post'
			temp.style.display = 'none'

			for (var x in PARAMS) {
				var opt = document.createElement('textarea')
				opt.name = x
				opt.value = PARAMS[x]
				temp.appendChild(opt)
			}

			document.body.appendChild(temp)
			temp.submit()

			return temp
		},
		getShare() {
			try {
				if (plus) {
					plus.share.getServices(
						res => {
							res[2].send(
								{
									type: 'image',
									pictures: [
										'http://fagzlz.a6shop.net:80/uploads/20190821/2924b90238ff3e6e48b4e85b71b5b39b.png'
									],
									extra: { scene: 'WXSceneSession' }
								},
								function() {
									alert('分享成功！')
								},
								function(e) {
									alert('分享失败：' + e.message)
								}
							)
						},
						err => {
							console.log(err)
						}
					)
				}
			} catch (e) {}
		},
		/**
		 * 退出确认
		 */
		toQuit() {
			try {
				if (plus) {
					mui.confirm('退出登录', actions => {
						if (actions.index == 0) this.quit()
					})
				}
			} catch (e) {
				mui.confirm('退出登录', actions => {
					if (actions.index == 1) this.quit()
				})
			}
		},
		/**
		 * 退出操作
		 */
		quit() {
			Load.loadStart(this)
			Init.quit().then(res => {
				if (res.code == 1) {
					mui.toast(res.msg)
					this.clearLocal()
					// setTimeout(() => {
					//     this.clearLocal();
					//     Load.loadEnd(this);
					//     this.$router.replace({name:'Login'});
					// }, 1000);
				} else {
					setTimeout(() => {
						Load.loadEnd(this)
						return
					}, 500)
				}
			})
		},
		/**
		 * 清楚缓存
		 */
		clearLocal() {
			let a = localStorage.getItem('bgm')
			let password = localStorage.getItem('pwd')
			let account = localStorage.getItem('account')
			let show = localStorage.getItem('show')
			localStorage.clear()

			this.saveUserInfo(null)
			this.saveUserID(null)
			this.saveCoinTxt(null)
			this.saveProData(null)

			setTimeout(() => {
				sessionStorage.setItem('btmNav', a)
				localStorage.setItem('bgm', a)
				localStorage.setItem('pwd', password)
				localStorage.setItem('account', account)
				localStorage.setItem('show', show)
				setTimeout(() => {
					Load.loadEnd(this)
					this.$router.replace({ name: 'Login' })
				}, 500)
			}, 500)
		}
	}
}
</script>
<style lang="less" scoped>
@import '~link-less';
.toscale {
	// .transform(scale(.5));
	height: auto;
	overflow: visible;
}
.body {
	background-color: @bg-color;
	color: #000;
	.list {
		margin: @margin-primary;
		.item {
			.display-flex();
			justify-content: space-between;
			align-items: center;
			padding: @padding-primary 0;
			> div {
				position: relative;
				width: 100px;
				height: 40px;
				background-color: #aaa;
				border-radius: 20px;
				div {
					position: absolute;
					left: 4px;
					top: 4px;
					width: 32px;
					height: 32px;
					background-color: #fff;
					border-radius: 50%;
				}
			}
			.se {
				background-color: rgb(74, 189, 255);
				> div {
					left: 64px;
				}
			}
		}
	}
	.btn-quit {
		height: 80px;
		line-height: 80px;
		width: 90%;
		display: block;
		margin: @margin-primary auto;
	}
}
@keyframes myScale {
	0% {
		.transform(scale(1));
	}
	50% {
		.transform(scale(0.5));
	}
	100% {
		.transform(scale(0));
	}
}
.myImg {
	animation-name: myScale;
	animation-duration: 1.5s;
	animation-fill-mode: forwards;
	border: 1px solid #ddd;
}
</style>

