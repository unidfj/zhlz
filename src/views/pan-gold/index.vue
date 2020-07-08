<template>
	<div class="page">
		<m-header title="MGK"></m-header>
		<section class="body">
			<scroller ref="my_scroller" :on-refresh="refresh" :on-infinite="infinite"></scroller>
			<div class="notice" @click="notice()">
				<div class="notice-inner">
					<i class="iconfont icongonggao mark"></i>
					<span style="margin:0 5px;">公告:</span>
					<ul v-if="noticeList && noticeList.length>0" class="notice-list">
						<li class="notice-item" v-for="(item,index) in noticeList" :key="index">{{item.title}}</li>
					</ul>
					<span v-else>暂无</span>
				</div>
			</div>
			<!-- <img class="banner" :src="bannerSrc?api+bannerSrc:defaultBanner" alt> -->
			<swiper :options="swiperOption" class="swiper-wrap" ref="mySwiper" v-if="banner.length!=0">
				<swiper-slide v-for="(item, index) in banner" :key="index">
					<img :src="api+item" class="title-img" />
				</swiper-slide>
				<!-- 常见的小圆点 -->
				<div class="swiper-pagination" v-for="(item,index) in banner" :key="index" slot="pagination"></div>
			</swiper>

			<p class="p_titl c_0" v-if="members_num">总预约人数：{{members_num}}</p>
			<ul class="list" v-if="list">
				<!-- <li class="list-con" v-for="(item,index) in list" :key="index" v-if="item.status == 1"> -->
				<li class="list-con" v-for="(item,index) in list" :key="index">
					<div class="img-wrap">
						<img :src="api+item.images" class="img" />
					</div>
					<ul class="con-wrap">
						<li class="title">{{item.levelname}}</li>
						<li>价值：{{item.min_price}}-{{item.max_price}}</li>
						<li>抢购时间：{{formatTime(item.stime)}}-{{formatTime(item.etime)}}</li>
						<li>预约/即抢{{coinTxt&&coinTxt['credit1_text']}}：{{parseInt(item.money)}}/{{parseInt(item.money2)}}</li>
						<!-- <li>智能合约收益：{{item.days}}天/{{parseInt(item.per)}}%</li> -->
						<li>智能合约收益：{{item.days}}天/{{Number(item.per).toFixed(2)}}%</li>
						<!-- <li>可挖{{coinTxt&&coinTxt['credit2_text']}}：{{parseInt(item.credit2)}}枚</li> -->
						<li>可挖{{coinTxt&&coinTxt['credit2_text']}}：{{Number(item.credit2).toFixed(2)}}枚</li>
						<!-- <li>可挖{{coinTxt&&coinTxt['credit4_text']}}：收益{{parseInt(item.credit4)}}%</li> -->
					</ul>

					<!-- <div  class="type-btn btn-default" >敬请等待</div> -->
					<div
						v-if="item.isbooking ==0&&status!=0"
						:class="{'type-btn btn-blue':true,'btn-red':item.cd_status == 0}"
						@click="event(item.isbooking,item.level,item.cd_status)"
					>{{setTimeDown(item.isbooking,item.cd_status,item.cd_time,item.minutes,item.seconds,item.level,index)}}</div>
					<div
						v-else-if="item.isbooking ==1&&status!=0"
						:class="{'type-btn':true,'btn-blue':item.status !=-1&&item.isbooking == 1,'btn-default':item.status ==-1,'btn-red':item.cd_status == 0}"
						@click="event(item.isbooking,item.level,item.cd_status)"
					>{{setTimeDown(item.isbooking,item.cd_status,item.cd_time,item.minutes,item.seconds,item.level,index)}}</div>
					<div v-else-if="item.isbooking ==2&&status!=0" class="type-btn btn-default">敬请等待</div>
					<div v-else-if="item.isbooking ==3||status==0" class="type-btn btn-default">{{coinTxt&&coinTxt['mining_text']}}</div>
					<div
						v-else-if="item.isbooking ==4&&status!=0"
						:class="{'type-btn':true,'btn-blue':(item.isbooking!=2||item.isbooking!=3)&&!(item.isbooking==4&&item.cd_status==-1),'btn-red':item.cd_status == 0,'btn-default':item.isbooking==4}"
						@click="event(item.isbooking,item.level,item.cd_status)"
					>{{setTimeDown(item.isbooking,item.cd_status,item.cd_time,item.minutes,item.seconds,item.level,index)}}</div>
					<div
						v-if="(item.isbooking==4&&item.cd_status==-1)||(item.isbooking==0||item.isbooking==1)&&status!=0"
						:class="{'type-btn bot_btn':true,'btn-default':(item.isbooking==4&&item.cd_status==-1),'btn-red':!(item.isbooking==4&&item.cd_status==-1)}"
						@click="(item.isbooking==4&&item.cd_status==-1)?'':booking(item.level,2,item.isbooking)"
					>预约即抢</div>
					<div v-else :class="{'type-btn btn-red bot_btn':true}" style="opacity:0">我是透明</div>
				</li>
			</ul>
			<p v-else class="msg">{{msg}}</p>
			<div class="mining-layer" v-show="quitFlag">
				<div class="mining-con">
					<img class="mining-img" :src="miningSrc" alt />
					<i class="iconfont iconclose" @click="quitMin"></i>
				</div>
			</div>
		</section>

		<div class="animation" v-show="startMining">
			<div class="box">
				<!-- <img class="img" src="../../assets/images/gzlz/mining.gif" v-show="!result2"> -->
				<img class="img" :src="gif" v-show="!result2" />
				<img :src="img04" alt v-show="result2" />
				<p v-show="result2">{{result?'抢购成功':'抢购失败'}}</p>
				<p v-show="!result2">抢购中</p>
				<button @click="animationBtn" v-show="result2">{{result?'确认':'关闭'}}</button>
				<!-- <button @click="startMining = false" v-show="!result2">关闭</button> -->
			</div>
		</div>
		<m-Footer></m-Footer>
		<m-load ref="load"></m-load>
	</div>
</template>
<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { Init, Index, Base, Owner } from '@/server/server.js'
import { Util, Load, Secret } from '@/assets/commonjs/utils.js'
import { mapGetters, mapMutations } from 'vuex'
require('swiper/dist/css/swiper.css') //引入swiper.css
export default {
	components: {
		swiper,
		swiperSlide
	},
	data() {
		return {
			result: null,
			result2: false,
			startMining: false,

			list: null,
			levelArr: [],
			timeInt: null,
			mineInt: null,
			mineInt2: null,
			mineFlag: true,
			bookFlag: true,
			orderFlag: true,
			msg: null,
			noticeList: [],
			//  move:0,
			//  moveTime:3,
			//  moveInter:null,
			defaultBanner: require('@/assets/images/gzlz/banner.png'),
			swiperOption: {
				loop: true,
				autoplay: {
					delay: 2500,
					stopOnLastSlide: false,
					/* 触摸滑动后是否继续轮播 */
					disableOnInteraction: false
				},
				// 分页器设置
				pagination: {
					el: '.swiper-pagination',
					clickable: true,
					type: 'bullets'
				}
			},
			banner: [],
			miningSrc: require('@/assets/images/gzlz/mining.gif'),
			img04: require('@/assets/images/04.png'),
			gif: require('@/assets/images/01.gif'),
			quitFlag: false,
			mineTime: null,
			resultInt: null,
			randomTime: null,
			lastTime: null,
			level: null,
			msg2: null,
			msg1: null,
			members_num: null,
			status: null,

			mineTime: null,
			mineInt: null,
			randomTime: null,
			subscribeTime: null
		}
	},
	mounted() {
		this.initData()
		setTimeout(() => {
			this.getMine()
		}, 550)
		this.getmsg()
		this.mineInt = setInterval(() => {
			this.getMine()
		}, 60000)
		this.getTitle()
		// if(!this.bannerSrc)
		// this.getBanner();
		if (!this.coinTxt) this.getText()
		//   setTimeout(() => {
		//     this.quitFlag = true;
		//   }, 3000);

		this.subscribe()
		// this.subscribeTime = setInterval(() => {
		//   this.subscribe();
		// }, 1000);
	},
	computed: {
		...mapGetters(['uid', 'api', 'bannerSrc', 'coinTxt', 'proData', 'bgm'])
	},
	methods: {
		initData() {
			this.banner = (this.proData && this.proData.home_top_banner) || [
				require('@/assets/images/gzlz/banner.png')
			]
			this.randomTime = parseInt(Math.random() * 20)

			// if(!this.bgm) return;
			// let mp3 = document.getElementById('mp3')
			// mp3.play();
			// mp3[this.se?'play':'pause']();
		},
		...mapMutations(['saveBanner', 'saveCoinTxt']),
		// getTest(){
		//   Base.getTest({data:Secret.encrypt(JSON.stringify({id:'444'}))}).then(res=>{
		//   })
		// },
		// 结束抢购动画
		animationBtn() {
			if (this.result) {
				this.$router.push('/mine')
			} else {
				this.startMining = false
			}
		},
		// 预约人数
		subscribe() {
			Index.subscribe().then(res => {
				if (res.code == 1) {
					this.members_num = res.data
				} else {
					mui.toast(res.msg)
				}
			})
		},
		//
		getmsg() {
			Owner.getmsg().then(res => {
				if (res.code == 1) {
					this.msg1 = res.data.msg
					this.msg2 = res.data.msg2
				} else {
					mui.toast(res.msg)
				}
			})
		},
		/**
		 * 获取币中名称与按钮
		 */
		getText() {
			Base.getText().then(res => {
				if (res.code == 1) {
					this.saveCoinTxt(res.data)
					localStorage.setItem('coinTxt', JSON.stringify(res.data))
				}
			})
		},
		/**
		 * 下拉刷新
		 */
		refresh() {
			this.getMine()
			setTimeout(() => {
				this.$refs.my_scroller.finishPullToRefresh()
				mui.toast('加载完毕！')
			}, 1000)
		},
		infinite() {},
		goTo(routeName) {
			this.$router.push({ name: routeName })
		},
		/**
		 * 获取公告
		 */
		getTitle() {
			Index.getTitle({ type: 'mh' }).then(res => {
				if (res.code == 1) {
					this.noticeList = res.data
				} else {
					mui.toast(res.msg)
				}
			})
		},
		/**
		 * 公告入口
		 */
		notice() {
			this.$router.push({ name: 'Notice', query: { type: 'mh' } })
		},
		/**
		 * 获取单张banner
		 */
		getBanner() {
			Index.getBanner().then(res => {
				if (res.code == 1) {
					if (
						res.data &&
						res.data.banner_img &&
						res.data.banner_img != ''
					)
						this.saveBanner(res.data.banner_img)
				}
			})
		},
		/**
		 * 获取首页列表
		 */
		async getMine() {
			// console.log('getMine')
			if (!this.orderFlag) return
			if (this.mineInt) clearInterval(this.mineInt)
			let _This = this
			this.levelArr = []
			this.orderFlag = false
			await Index.getMine().then(res => {
				if (res.code == 1) {
					for (var i = 0; i < 100; i++) {
						clearInterval(i)
					}
					this.orderFlag = true
					this.list = res.data.levels || []
					this.status = res.data.status
					if (res.data.status == 0) {
						mui.toast(res.data.msg)
					}
					// this.subscribe();
					// this.subscribeTime = setInterval(() => {
					//   this.subscribe();
					// }, 1000);

					this.mineInt = setInterval(() => {
						this.getMine()
					}, 60000)
				} else {
					this.orderFlag = true
					this.msg = res.msg
					mui.toast(res.msg)
					return
				}
			})
			// this.subscribeTime = setInterval(() => {
			//   this.subscribe();
			// }, 1000);
		},
		formatTime(time) {
			return Util.formatTime(time).substr(0, 5)
		},
		event(status, level, cdStatus) {
			console.log('status,level,cdStatus', status, level, cdStatus)
			switch (status) {
				case 0:
					this.booking(level, 1)
					break
				case 1:
					// if(cdStatus == 0 ||cdStatus == -1 )
					if (cdStatus == -1) {
						this.booking(level, 1)
						return
					}
					if (cdStatus == 0) return
					this.mining(level)
					// if(isbooking==1 ||isbooking ==2){
					//   this.$router.push({name:'StartMining',params:{level}});
					// }
					// this.$router.push({name:'StartMining'});
					break
				case 4:
					if (cdStatus == 0 || cdStatus == -1) {
						return
					}
					this.mining(level)
					// this.$router.push({name:'StartMining',params:{level}});
					break
			}
		},
		/**
		 * 预约
		 */
		booking(level, type) {
			if (!this.bookFlag) return
			try {
				if (plus) {
					mui.confirm(type == 1 ? this.msg1 : this.msg2, actions => {
						if (actions.index == 0) {
							this.bookFlag = false
							Load.loadStart(this)
							Index.booking({ level, type }).then(res => {
								mui.toast(res.msg, { duration: 550 })
								if (res.code == 1) {
									this.bookFlag = true
									Load.loadEnd(this)

									setTimeout(() => {
										this.getMine()
									}, 550)
								} else {
									this.bookFlag = true
									Load.loadEnd(this)
								}
							})
						}
					})
				}
			} catch (e) {
				mui.confirm(type == 1 ? this.msg1 : this.msg2, actions => {
					if (actions.index == 1) {
						this.bookFlag = false
						Load.loadStart(this)
						Index.booking({ level, type }).then(res => {
							mui.toast(res.msg, { duration: 500 })
							if (res.code == 1) {
								this.bookFlag = true
								Load.loadEnd(this)
								setTimeout(() => {
									this.getMine()
								}, 550)
							} else {
								this.bookFlag = true
								Load.loadEnd(this)
							}
						})
					}
				})
			}
		},
		/**
		 * 倒计时
		 */
		setTimeDown(isbooking, status, cdTime, minutes, seconds, level, index) {
			let time = String(new Date().getTime()).substr(0, 10)
			// console.log(Number(time),cdTime)
			switch (status) {
				case -1: //-1表示不倒计时的时间段内，不能抢购
					if (isbooking == 0) {
						return this.coinTxt['booking_text']
					} else if (isbooking == 4) {
						// 抢购前五分钟
						// return this.coinTxt['mining_text']
						return this.coinTxt['booking_text']
					} else if (isbooking == 1) {
						// 已预约
						// return this.coinTxt['booked_text']
						return this.coinTxt['booking_text']
					}
					// else {
					//   return '已预约'
					// }
					break
				case 0: //0表示还在倒计时
					this['level' + level] = {
						minutes,
						seconds
					}
					this.setDown(this['level' + level], index)
					return (
						'距离抢购' +
						this['level' + level].minutes +
						':' +
						this['level' + level].seconds
					)
					break
				case 1: //1表示倒计时结束开始抢购
					return this.coinTxt['mine_grab_text']
					break
				case 2: //2表示倒计时结束处于抢购中的时间段
					return this.coinTxt['mine_grab_text']
					break
			}
		},
		/**
		 * 立即抢购
		 */
		mining(level) {
			this.result = null
			if (!this.mineFlag) {
				return
			}

			clearInterval(this.mineInt)
			Load.loadStart(this)
			this.mineFlag = false
			this.level = level
			Index.mining({ level }).then(res => {
				// mui.toast(res.msg)
				Load.loadEnd(this)
				this.mineFlag = true
				if (res.code == 1) {
					//   Load.loadEnd(this);
					// this.level = level;
					// this.startMining();
					// //   this.$router.push({name:'StartMining',params:{level}});

					this.mineTime = setTimeout(() => {
						this.mineInt2 = setInterval(() => {
							this.getoreResult(this.level)
						}, 1000)
					}, 180000)
					// }, 10000);

					this.startMining = true
				} else {
					mui.toast(res.msg)
					// this.mineFlag = true;
					// Load.loadEnd(this);
					// mui.confirm(res.msg);
					return
				}
			})
		},
		/**
		 * 开始倒计时
		 */
		setDown(obj, level) {
			// if(!!timeInt){
			//   return;
			// }

			// clearInterval(this.subscribeTime);
			clearInterval(this.mineInt)
			obj.seconds += 1

			let timeInt = setInterval(() => {
				// console.log(obj.seconds)
				if (!document.getElementsByClassName('list-con')[0]) {
					clearInterval(timeInt)
				}
				if (obj.seconds == 0 && obj.minutes == 0) {
					clearInterval(timeInt)
					this.getMine()
					this.list[level].cd_status = 2
					//   return;
				}
				if (obj.seconds < 10) {
					// console.log(obj.seconds)
					obj.seconds = '0' + Number(obj.seconds)
				}
				if (obj.minutes < 10) {
					// console.log(obj.minutes)
					obj.minutes = '0' + Number(obj.minutes)
				}
				if (obj.seconds > 0) {
					obj.seconds = obj.seconds - 1
					if (Number(obj.seconds) < 10) {
						obj.seconds = '0' + Number(obj.seconds)
					}
				} else {
					if (obj.minutes > 0) {
						obj.minutes = obj.minutes - 1
						if (obj.minutes < 10) {
							obj.minutes = '0' + Number(obj.minutes)
						}
						obj.seconds = 59
					} else {
						// console.log('else')
						// obj.seconds = 0;
						// obj.minutes = 0;
						// clearInterval(timeInt);
						// this.getMine();
					}
				}
				if (obj.minutes == 0 && obj.seconds == 0) {
					document.getElementsByClassName('list-con')[
						level
					].children[2].innerText = this.coinTxt['mine_grab_text']
				} else {
					document.getElementsByClassName('list-con')[
						level
					].children[2].innerText =
						'距离抢购' + obj.minutes + ':' + obj.seconds
				}
			}, 1000)
		},
		/**
		 * 抢购退出
		 */
		quitMin() {
			let _this = this
			try {
				if (plus) {
					mui.confirm('确定退出抢购', action => {
						if (action.index == 0) {
							_this.quitFlag = false
							_this.clearMiningTime()
						} else {
							console.log('app cancel')
						}
					})
				}
			} catch (e) {
				mui.confirm('确定退出抢购', action => {
					if (action.index == 1) {
						console.log('web confirm')
						_this.quitFlag = false
						_this.clearMiningTime()
					} else {
						console.log('web cancel')
					}
				})
			}
		},
		/**
		 * 抢购的所有定时器
		 */
		// miningTimeGroup(){
		//     let _this = this;
		//     //3分钟 请求结果
		//     this.mineTime = setTimeout(() => {
		//       setTimeout(() => {
		//         this.resultInt = setInterval(() => {
		//           this.getoreResult(this.level);
		//         }, 3000);
		//       }, this.randomTime*1000);
		//     }, 180000);
		//     //5分钟超时截断跳转
		//     this.lastTime = setTimeout(() => {
		//       mui.alert('抢购过于热情，请前往记录查看抢购详情',()=>{
		//         _this.$router.push({name:'Mine'})
		//       })
		//     }, 300000);
		// },
		/**
		 * 抢矿结果
		 */
		getoreResult(level) {
			Index.getoreResult({ level }).then(res => {
				if (res.code == 1) {
					// this.$router.push({path:res.data.url})

					if (res.data.url == '/pan-gold/buy-result?type=fail') {
						this.result = false
					} else {
						this.result = true
					}
					clearInterval(this.mineInt2)
					setTimeout(() => {
						this.result2 = true
						this.getMine()
					}, 200)
				} else {
					return
				}
			})
		},
		/**
		 * 开始抢购
		 */
		// startMining(){
		//     this.quitFlag = true;
		//     this.miningTimeGroup();
		// },
		/**
		 * 清除抢购的定时器
		 */
		clearMiningTime() {
			clearInterval(this.resultInt)
			clearTimeout(this.mineTime)
			clearTimeout(this.lastTime)
		}
	},
	beforeRouteLeave(to, from, next) {
		clearInterval(this.mineInt)
		clearInterval(this.resultInt)
		clearTimeout(this.mineTime)
		clearTimeout(this.lastTime)
		// clearInterval(this.subscribeTime);

		// for (var i = 0; i < 100; i++) {
		//   clearInterval(i);
		// }
		next()
	}
}
</script>
<style lang="less" scoped>
@import '~link-less';
.body {
	line-height: 36px;
	background-color: @bg-color;
	@keyframes lunbo {
		from {
			right: -75%;
		}
		to {
			right: 75%;
		}
	}
	.swiper-wrap .title-img {
		height: 300px;
		width: 100%;
	}
	.notice {
		position: relative;
		margin: 0 2%;
		height: 40px;
		line-height: 40px;
		color: white;
		font-size: 24px;
		border-radius: 40px;
		overflow: hidden;
		padding-left: 5%;
		i,
		span {
			vertical-align: top;
			font-size: 12px;
			color: #000;
		}
		.notice-inner {
			position: absolute;
			right: -75%;
			top: 0;
			background: transparent;
			width: 75%;
			animation-name: lunbo;
			animation-duration: 12s;
			animation-iteration-count: infinite;
			z-index: 2;
		}
		.notice-list {
			width: 70%;
			display: inline-block;
			vertical-align: top;
		}
		.notice-item {
			// color: @bg-color;
			color: #000 !important;
			background: transparent;
			font-size: 24px;
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
		}
		span {
			color: #000;
		}
	}
	.banner {
		width: 100%;
		height: 300px;
	}

	> .p_titl {
		margin: 10px 30px 0;
	}
	.list {
		margin: 0 4%;
		font-size: 0px;
		.list-con:nth-child(odd) {
			margin-right: 5%;
		}
		.list-con {
			width: 47.5%;
			display: inline-block;
			margin-top: 30px;
			padding-bottom: 29px;
			// background: @bg-card-color;
			border: 2px solid;
			border-image: linear-gradient(
					-30deg,
					rgba(146, 132, 191, 1),
					rgba(37, 171, 226, 1)
				)
				10 10;
			background: linear-gradient(
				-30deg,
				rgba(16, 58, 174, 1) 0%,
				rgba(21, 178, 255, 1) 98%
			);
			font-size: 22px;
			// border-radius:12px;
			// border-radius:50%;
			text-align: center;
			box-sizing: border-box;
			// overflow: hidden;
			.img-wrap {
				text-align: center;
				.img {
					// height:140px;
					// max-width: 100%;
					width: 100%;
					// margin-top: 41px;
				}
			}
			.con-wrap {
				padding: 19px 19px 25px 19px;
				color: #ddd;
				.title {
					padding-bottom: 10px;
					color: #f5be28;
					font-size: 28px;
				}
			}
			.type-btn {
				width: 82%;
				height: 68px;
				line-height: 68px;
				display: block;
				margin: auto;
				text-align: center;
				color: @bg-color-white;
				font-size: 32px;
				letter-spacing: 1px;
				border-radius: 8px;
			}
			.bg1 {
				background: linear-gradient(
					90deg,
					rgba(108, 234, 114, 1) 0%,
					rgba(26, 184, 0, 1) 98%
				);
			}
			.bg2 {
				background: rgba(68, 66, 90, 1);
			}
			.bg3 {
				background: linear-gradient(
					90deg,
					rgba(245, 190, 40, 1) 0%,
					rgba(255, 132, 42, 1) 100%
				);
			}
			.bg4 {
				background: linear-gradient(
					-90deg,
					rgba(254, 45, 45, 1) 0%,
					rgba(255, 96, 96, 1) 100%
				);
			}
			&:last-child {
				margin-bottom: @margin-primary;
			}
		}
	}
	.msg {
		width: 100%;
		text-align: center;
		margin-top: 20%;
	}
	.mining-layer {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.1);
		.display-flex();
		align-items: center;
		justify-content: center;
		flex-direction: column;
		.mining-con {
			text-align: center;
			position: relative;
			i {
				background-color: #ddd;
				border-radius: 50%;
				vertical-align: top;
				width: 40px;
				height: 40px;
				position: absolute;
				right: 6%;
				top: 100px;
			}
			.mining-img {
				width: 80%;
			}
		}
	}
}
.bot_btn {
	margin-top: 20px !important;
}
// .ale{
//   position: fixed;
//   top: 0;
//   left: 0;
//   background-color: rgba(0, 0, 0, .8);
//   width: 100%;
//   height: 100%;
//   z-index: 99;
//   .box{
//     width: 400px;
//     // border-radius: 10px;
//     // background-color: #fff;
//     margin: 160px 175px;
//     img{
//       width: 100%;
//     }
//   }
// }

.animation {
	position: fixed;
	top: 0;
	left: 0;
	background-color: rgba(0, 0, 0, 0.8);
	width: 100%;
	height: 100%;
	z-index: 99;
	.box {
		position: fixed;
		left: 10%;
		top: 20%;
		// background-color: #fff;
		// background-color: @bg-color;
		border-radius: 30px;
		width: 80%;
		padding: 0 0 40px;
		text-align: center;
		// background-color: #fff;
		background-color: rgba(24, 116, 210, 1);
		img {
			width: 80%;
			width: 40%;
			margin: 10% 30% 8%;
		}
		p {
			font-weight: 550;
			font-size: 48px;
			// color: #000;
		}
		button {
			background-color: #2cb4ff;
			padding: 10px 40px;
			margin: 30px 0;
			border-radius: 30px;
		}
	}
}
</style>
<style lang="less">
._v-container {
	height: 300px !important;
	margin-top: -40px !important;
	z-index: 1;
}
._v-container > ._v-content > .loading-layer .spinner-holder .spinner,
._v-container > ._v-content > .pull-to-refresh-layer .spinner-holder .spinner {
	margin-top: 0 !important;
	fill: white !important;
	stroke: white !important;
	z-index: 1;
}
</style>
