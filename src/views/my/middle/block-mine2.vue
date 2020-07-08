<template>
	<div class="page">
		<m-header :title="setTitle(type)" :canback="Boolean(1)">
			<i v-if="type !='credit5'" @click="goTo('Extract')">提取</i>
		</m-header>
		<div class="body">
			<div class="content">
				<div class="num" v-if="type=='credit2'">
					<!-- <span>{{data?data.config.credit2_from:'0'}}={{data?data.config.credit2_to:'0'}} {{type=="credit4"?"USD":"SGD"}}</span> -->
					<div class="top">
						<p>当前MGK币：{{money?money:'0'}}</p>
						<p>冻结MGK币：{{lock_credit2?lock_credit2:'0'}}</p>
					</div>
					<div class="btn_box" v-if="type=='credit2'">
						<button @click="$router.push({name:'Exchange'})">兑换</button>
						<button @click="$router.push({name:'CZ'})">充值</button>
					</div>
				</div>
				<div class="num" v-else-if="type=='credit4'">{{data?data.config.credit4_from:'0'}}={{data?data.config.credit4_to:'0'}} {{type=="credit4"?"USD":"SGD"}}</div>
				<div class="num" v-else>
					<p>累计收益</p>
					<!-- <p class="total">{{data?data.config.credit5:'0'}}</p> -->
					<p class="total">{{money?money:'0'}}</p>
				</div>
			</div>

			<div class="change" v-if="type=='credit2'">
				<p :class="{'se':!se}" @click="se = false">宠物收益</p>
				<p :class="{'se':se}" @click="se = true">其他明细</p>
			</div>

			<ul v-if="data && data.data && data.data.length>0&&!se&&type!='credit5'">
				<li class="list" v-for="(item,index) in data.data" :key="index">
					<ul>
						<li class="identifier">
							<span>编号：{{item.orecode}}</span>
							<span v-if="Number(item.money)>0" class="list-num">+{{item.money}}</span>
							<span v-else class="list-num red">+{{item.money}}</span>
						</li>
						<li>
							等级：
							<span class="grade">{{item.levelname}}</span>
						</li>
						<li>
							价值：
							<span>{{item.level}}</span>
						</li>
						<li>
							智能合约：
							<span>{{item.days}}天{{parseInt(item.per)}}%</span>
						</li>
						<li>{{item.time}}</li>
					</ul>
				</li>
			</ul>

			<ul v-if="list.length>0&&(se||type=='credit5')">
				<li class="list2" v-for="(item,index) in list" :key="index">
					<div class="mine-grab">
						<span>{{item.remark}}</span>
						<span :class="{'list-num1':Number(item.num)<0, 'list-num2':Number(item.num)>0 }">{{item.num}}</span>
					</div>
					<div>{{item.time}}</div>
				</li>
			</ul>
			<!-- <p v-else class="no-msg">没有更多了呢~</p> -->
			<next v-show="!data || !data.data || data.data.length==0" ref="next" :nomore="true"></next>
		</div>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
import { Owner } from '@/server/server.js'
import { Load, Secret } from '@/assets/commonjs/utils.js'
export default {
	data() {
		return {
			type: null,
			data: null,
			list: [],
			se: false,
			money: null,
			lock_credit2: null
		}
	},
	mounted() {
		this.initData()
		this.getCoinOrder(this.type)
		this.getCoin(this.type)
	},
	computed: {
		...mapGetters(['uid', 'coinTxt'])
	},
	methods: {
		initData() {
			this.type = this.$route.query.type
			Load.loadNext(this)
		},
		setTitle(type) {
			switch (type) {
				case 'credit1':
					return this.coinTxt[type + '_text']
					break
				case 'credit2':
					return this.coinTxt[type + '_text']
					break
				case 'credit3':
					return this.coinTxt[type + '_text']
					break
				case 'credit4':
					return this.coinTxt[type + '_text']
					break
				case 'credit5':
					return this.coinTxt[type + '_text']
					break
			}
		},
		goTo(route) {
			this.$router.push({ name: route, query: { type: this.type } })
		},
		// getCoin(){
		//   Owner.getCoin({type}).then(res=>{
		//     if(res.code==1){

		//     }else{
		//       mui.toast(res.msg)
		//     }
		//   })
		// },
		getCoin(type) {
			// if(type!='credit2') return;
			Owner.getCoin({ type }).then(res => {
				if (res.code == 1) {
					// this.list = JSON.parse(Secret.decrypt(res.data));

					this.list = JSON.parse(Secret.decrypt(res.data)).data
					this.money = JSON.parse(Secret.decrypt(res.data)).money
					this.lock_credit2 = JSON.parse(
						Secret.decrypt(res.data)
					).lock_credit2
				} else {
					mui.toast(res.msg)
				}
			})
		},
		getCoinOrder(type) {
			if (type != 'credit2') return
			let params = {
				id: this.uid,
				type
			}
			Owner.getCoinOrder(params).then(res => {
				// if(res.code == 1){
				this.data = JSON.parse(Secret.decrypt(res.data))
				console.log('data', this.data)
				// mui.toast(res.msg);
				// }else {
				//     mui.toast(res.msg);
				//     return ;
				// }
			})
		}
	}
}
</script>
<style lang="less" scoped>
@import '~link-less';
.body {
	// background: @bg-color;
	background: #f7f7f7 !important;
	padding: 30px;
	color: @bg-color-white;
	.content {
		// height: 220px;
		// padding-top: 30px;
		// padding-bottom: 20px;
		// background: @bg-card-color;
		// border-radius: 8px;

		width: 690px;
		height: 270px;
		background: linear-gradient(
			90deg,
			rgba(47, 229, 148, 1) 0%,
			rgba(3, 191, 111, 1) 100%
		);
		border-radius: 10px;
		padding-top: 44px;
		.num {
			text-align: center;
			color: @primary-color;
			font-size: 40px;
			.total {
				color: @primary-color;
				font-size: 32px;
			}
			> .top {
				p {
					font-size: 32px !important;
					font-weight: 500;
					color: rgba(255, 255, 255, 1);
					&:last-child {
						margin-top: 8px;
					}
				}
			}
		}
		> .top {
			p {
				font-size: 24px;
			}
		}
	}
	.list {
		margin-top: 20px;
		// height: 220px;
		padding: 22px;
		// background: @bg-card-color;
		background: #fff;
		border-radius: 8px;
		font-size: 25px;
		li {
			color: #000;
		}
		.identifier {
			.display-flex();
			justify-content: space-between;
			span {
				color: #000;
			}
			.list-num {
				font-size: 35px;
				color: green;
			}
			.red {
				color: red;
			}
		}
		.grade {
			color: rgba(245, 190, 40, 1);
		}
	}
	.btn_box {
		// width: 690px;
		// margin: 20px 30px;
		margin: 20px 0;
		display: flex;
		justify-content: space-between;
		margin: 30px;
		width: 520px;
		margin-left: 85px;
		button {
			width: 240px;
			height: 68px;
			background: rgba(255, 255, 255, 0.5);
			border-radius: 8px;
			border: 1px solid rgba(255, 255, 255, 0.3);
		}
	}

	.list2 {
		margin-top: 20px;
		padding: 20px 30px;
		// background: @bg-card-color;
		background: #fff;
		border-radius: 8px;
		> div {
			color: #000;
		}
		.mine-grab {
			.display-flex();
			justify-content: space-between;
			padding-bottom: 8px;
			.list-num1 {
				font-size: 32px;
				color: red;
			}
			.list-num2 {
				font-size: 32px;
				color: green;
			}
		}
	}
	.change {
		width: 690px;
		// margin: 30px;
		margin-top: 30px;
		display: flex;
		justify-content: space-between;
		border-radius: 10px;
		border: 1px solid rgba(1, 190, 110, 0.6);
		p {
			flex: 1;
			text-align: center;
			height: 88px;
			line-height: 88px;
			background-color: #01be6e;
		}
		.se {
			background: rgba(1, 190, 110, 0.2);
			color: #01be6e;
		}
	}
}
.page {
	/deep/ .header {
		.nav {
			background-color: #fff;
			.center,
			.left {
				color: #000;
			}
			.right {
				color: #01be6e;
			}
		}
	}
}
</style>
