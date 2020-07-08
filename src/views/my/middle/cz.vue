<template>
	<div class="page">
		<m-header title="充值" :canback="Boolean(1)"></m-header>
		<div class="body">
			<form>
				<ul>
					<li class="list">
						<div class="title">数量</div>
						<input type="text" class="inp" v-model="hkmoney" placeholder="请输入数量" />
					</li>
					<li class="list">
						<div class="title">所需金额</div>
						<input type="text" class="inp" :value="Number(price * hkmoney).toFixed(4)" readonly />
					</li>

					<li class="list" @click="choicePay">
						<div class="title">支付方式</div>
						<input type="text" class="inp" :value="text" placeholder="请选择支付方式" readonly />
					</li>

					<li class="list" v-show="addr">
						<div class="title">收款地址</div>
						<input type="text" class="inp" :value="addr" readonly id="url" />
						<button ref="copy" class="dz" data-clipboard-target="#url" data-clipboard-action="copy" @click="copy">复制</button>
					</li>

					<div class="list" v-show="paytype">
						<span class="title">收款二维码</span>
						<div class="content">
							<!-- <img class="code-img" :src="api+(paytype==1?wx_qrcode:zfb_qrcode)" > -->
							<img class="code-img" :src="api + src2" />
						</div>
					</div>
					<li class="list">
						<div class="title">上传凭证</div>
						<img :src="src" alt />
						<input type="file" class="file" @change="change($event)" />
					</li>
					<!-- <li class="list poundage" >当前折扣：{{dis}}</li> -->
					<li class="list poundage">当前币价：{{ price }}</li>
				</ul>
				<div class="sub" @click="addRechargeLog">提交</div>
			</form>
		</div>
		<m-load ref="load"></m-load>
		<m-pwd ref="pwd" @pay="pay"></m-pwd>
	</div>
</template>
<script>
import { Owner, Base } from '@/server/server.js'
import { Util, Load } from '@/assets/commonjs/utils.js'
import { mapGetters } from 'vuex'
import mPwd from '@/components/pwd-alert.vue'
import Clipboard from 'clipboard'
export default {
	components: {
		mPwd
	},
	data() {
		return {
			payPicker: new mui.PopPicker(),
			myClipboard: null,
			type: null,
			dis: null,
			price: null,
			hkmoney: null,
			list: [],
			paytype: null,
			text: null,
			src: require('@/assets/images/gzlz/upload.png'),
			hkimg: null,
			wx_qrcode: null,
			zfb_qrcode: null,
			src2: null,
			addr: null,
			data: {
				mgkaddr: null,
				mgkimg: null,
				sykj: null,
				usdtaddr: null,
				usdtimg: null,
				wx_qrcode: null,
				xzbz: null,
				zfb_qrcode: null
			}
		}
	},
	mounted() {
		this.initData()
		this.getbtaprice()
		this.getRechargeInfo()
	},
	computed: {
		...mapGetters(['coinTxt', 'api'])
	},
	methods: {
		initData() {
			this.myClipboard = new Clipboard(this.$refs['copy'])
		},
		// 充值信息
		getRechargeInfo() {
			Owner.getRechargeInfo().then(res => {
				if (res.code == 1) {
					const data = res.data.data
					this.wx_qrcode = data.wx_qrcode
					this.zfb_qrcode = data.zfb_qrcode
					this.data = data
					if (data.hkfs) {
						for (let key in data.hkfs) {
							this.list.push({ value: key, text: data.hkfs[key] })
						}
					}
					this.payPicker.setData(this.list)
				} else {
					mui.toast(res.msg)
				}
			})
		},

		choicePay() {
			let _This = this
			this.isDown = false
			this.payPicker.show(function(items) {
				_This.paytype = items[0].value
				_This.text = items[0].text
				switch (+items[0].value) {
					case 1:
						_This.src2 = _This.data.wx_qrcode
						_This.addr = null
						break
					case 2:
						_This.src2 = _This.data.zfb_qrcode
						_This.addr = null
						break
					case 3:
						_This.src2 = _This.data.usdtimg
						_This.addr = _This.data.usdtaddr
						break
					case 4:
						_This.src2 = _This.data.mgkimg
						_This.addr = _This.data.mgkaddr
						break
				}
				console.log('addr', _This.addr)
				console.log('src2', _This.src2)
				console.log('+items[0].value', +items[0].value)
			})
		},
		// 获取bta当前币价
		getbtaprice() {
			Owner.getbtaprice().then(res => {
				if (res.code == 1) {
					this.dis = res.data.dis
					this.price = res.data.price
					console.log(this.dis)
				} else {
					mui.toast(res.msg)
				}
			})
		},
		// 兑换
		addRechargeLog() {
			Owner.addRechargeLog({
				hkimg: this.hkimg,
				hkmoney: this.hkmoney,
				paytype: this.paytype
			}).then(res => {
				mui.toast(res.msg)
				if (res.code == 1) {
					setTimeout(() => {
						this.$router.go(-1)
					}, 500)
				}
			})
		},
		extractRecord() {
			this.$router.push({
				name: 'ExtractRecord',
				query: { type: this.type }
			})
		},
		pay(pwd) {
			this.btatowf(pwd)
		},
		/**
		 * 上传
		 */
		change(event) {
			let _This = this
			let formData = new FormData()
			if (!event.target.files[0]) return
			Load.loadStart(_This)
			// this.formData.image = event.target.files[0];
			Util.uploadImgLimit(event.target.files[0], url => {
				formData.append('image', url)
				Base.upload(formData).then(res => {
					Load.loadEnd(_This)
					if (res.code == 1) {
						_This.hkimg = res.data
						_This.src = _This.api + res.data
					} else {
						mui.toast(res.msg)
						return
					}
				})
			})
		},
		copy() {
			this.myClipboard.on('success', e => {
				mui.toast('复制成功！')
			})
			this.myClipboard.on('error', e => {
				Util.commonCopy('url')
			})
		}
	}
}
</script>
<style lang="less" scoped>
@import '~link-less';
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
		img {
			width: 100%;
			height: 400px;
			margin-top: 20px;
			// height: 200px;
		}
		.code-img {
			width: 300px;
			height: 300px;
		}
		.file {
			position: absolute;
			top: 60px;
			left: 0;
			width: 100%;
			height: 400px;
			opacity: 0;
		}
		.dz {
			position: absolute;
			right: 30px;
			top: 94px;
		}
		.inp_dz {
			padding-right: 180px;
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
