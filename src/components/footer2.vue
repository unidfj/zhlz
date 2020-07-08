<!-- 
  底部组件（全局注册组件）
  navInd2：导航的默认值
-->
<template>
    <ul class="footer">
      <li v-for="(v,i) in footer_list" :key="i" @click="goTo(v.route,i)" :class="{'nav-bg':navInd2 == i}">
        <i :class="v.icon"></i>
        <p>{{v.title}}</p>
      </li>
    </ul>
</template>

<script>
import {mapGetters} from 'vuex';
export default{
  props:{
      footer_list:{
          type:Array,
          default(){
              return false;
          }
      }
  },
  data(){
    return {
        navInd2:1,
    }
  },
  mounted(){
        this.activeNav();
  },
  computed:{
        ...mapGetters(['proData'])
  },
  methods:{
    goTo(route,index){
        this.navInd2 = index;
        if(index==0){
          sessionStorage.setItem('btmNav',0);
        }else{
          sessionStorage.setItem('btmNav2',index);
        }
        
        console.log('route',route)
        this.$router.push({name:route})
    },
    activeNav(){
        if(sessionStorage.getItem('btmNav2')){
            let index = sessionStorage.getItem('btmNav2');
            this.navInd2 = index;
            console.log('index:',index)
        }
    }
  }
}

</script>
<style scoped lang="less">
@import '~link-less';
  .footer{
    position: fixed;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 100px;
    padding-top: 16px;
    li{
      flex: 10;
      text-align: center;
      p{
        font-size:22px;
        color: #999999;
        margin-top: -4px;
      }
      i{
        font-size: 48px;
        color: #999;
      }
    }
    .nav-bg {
      p,i{
        color: #01BE6E;
      }
    }
  }
</style>
