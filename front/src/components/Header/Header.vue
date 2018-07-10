<template>
  <header @mouseover="showBanner">
    <nav :class="['nav', {'nav-with-banner': isShowBanner}]">
      <router-link to="/articles">
        <div class="nav-logo">
          <img src="../../assets/images/logo.png" alt="随心的blog">
        </div>
      </router-link>
      <div 
        v-if="isPC"
        :class="['nav-list-box', {'nav-hide': !isShowNavList}]"
      >
        <ul class="nav-list" @mouseover="showNavList" @mouseout="hideNavList">
          <li><router-link to="/articles" active-class="active" class="hover-underline">文章</router-link></li>
          <li><router-link to="/tags" active-class="active" class="hover-underline">标签</router-link></li>
          <li><router-link to="/archives" active-class="active" class="hover-underline">归档</router-link></li>
          <li><router-link to="/about" active-class="active" class="hover-underline">关于我</router-link></li>
          <li><a href="/admin" active-class="active" class="hover-underline">管理</a></li>
        </ul>
      </div>
      <div 
        v-else
        class="nav-list-box-phone"
        @click="switchNavListForPhone"
      >
        <div class="collapse-nav-list">
          <div></div>
        </div>
        <transition name="collapse">
          <ul class="nav-list-phone" v-show="isShowNavList">
            <li><router-link to="/articles" active-class="active" class="hover-underline">文章</router-link></li>
            <li><router-link to="/tags" active-class="active" class="hover-underline">标签</router-link></li>
            <li><router-link to="/archives" active-class="active" class="hover-underline">归档</router-link></li>
            <li><router-link to="/about" active-class="active" class="hover-underline">关于我</router-link></li>
            <li><a href="/admin" active-class="active" class="hover-underline">管理</a></li>
          </ul>
        </transition>
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  data(){
    return {
      isShowNavList: true,
      isShowBanner: true,
      isPC: true,
      timerID: null
    }
  },
  methods: {
    // PC 端nav list动画
    showNavList(){
      clearTimeout(this.timerID)
      if(!this.isShowNavList){
        this.isShowNavList = true
      }
    },
    hideNavList(){
      // 避免重复计时
      clearTimeout(this.timerID)
      if(this.isShowNavList){
        this.timerID = setTimeout(()=>{
          this.isShowNavList = false
        },1500)
      }
    },
    // 滚到顶部且mouseover时显示nav背景图
    handleScroll(){
      if(window.pageYOffset !== 0 && this.isShowBanner === true){
        this.isShowBanner = false
      }
    },
    showBanner(){
      if(window.pageYOffset === 0 && this.isShowBanner === false){
        this.isShowBanner = true
      }
    },
    // 手机端nav list动画
    switchNavListForPhone(){
      if(this.isShowNavList){
        this.isShowNavList = false
      }else{
        this.isShowNavList = true
      }
    }
  },
  created(){
    window.addEventListener('scroll', this.handleScroll)
    this.isPC = window.innerWidth >= 768
  },
  mounted: function(){
    this.timerID = setTimeout(()=>{
      this.isShowNavList = false
    },3000)
  }
}
</script>

<style scoped>
  .nav {
    transition: height 0.5s;
    background: url('../../assets/images/bg.jpeg') no-repeat;
    background-size: cover;
    height: 80px;
    overflow: hidden;
  }
  .nav-logo img {
    height: 40px;
  }
  .nav-list-box {
    position: fixed;
    top: 0;
    width: 100%;
    text-align: center;
    transition: all 0.5s;
  }
  .nav-list {
    list-style-type: none;
    padding: 0;
    margin: 0 auto;
    height: 35px;
    max-width: 600px;
    width: 100%;
    background-color: rgba(43, 43, 43, 0.6);
    display: flex;
    justify-content: space-between;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    overflow: hidden;
  }

  /* 屏幕宽度小于768px时，显示collapse nav 列表 */
  .nav-list-box-phone {
    position: fixed;
    right: 10px;
    top: 10px;
  }
  .collapse-nav-list {
    width: 30px;
    height: 30px;
    border-radius: 15px;
    border: 10px solid rgba(0, 0, 0, 0.6);
    box-sizing: border-box;
    position: absolute;
    right: 0;
    cursor: pointer;
  }
  .nav-list-phone {
    list-style-type: none;
    margin: 0;
    padding: 6px 25px;
    width: 150px;
    background-color: rgba(43, 43, 43, 0.6);
    border-radius: 15px;
  }
  /* add to avoid reflow */
  .nav-list-phone>li {
    height: 22px;
    margin: 2px 0;
  }

  .nav-list>li {
    flex: 1;
    text-align: center;
    display: inline-block;
    color: #c9c9c9;
    font-size: 20px;
  }
  li>a {
    display: inline-block;
    width: 100%;
    height: 100%;
    color: #bbb;
  }
  .nav-hide {
    transform: translateY(-29px);
  }
  .nav-with-banner{
    height: 160px;
  }
  @media (min-width: 480px) {
    .nav-with-banner{
      height: 220px;
    }
    .nav-logo img {
      height: 50px;
    }
  }
  @media (min-width: 768px) {
    .nav-with-banner{
      height: 360px;
    }
    .nav-logo img {
      height: 60px;
    }
  }
  @media (min-width: 992px) {
    .nav-with-banner{
      height: 480px;
    }
    .nav-logo img {
      height: 80px;
    }
  }
  @media (min-width: 1200px) {
    .nav-with-banner{
      height: 575px;
    }
    .nav-logo img {
      height: 80px;
    }
  }

  /* 手机端 nav list 动画 */
  .collapse-enter-active {
    animation: collapse-in .5s;
  }
  .collapse-leave-active {
    animation: collapse-in .5s reverse;
  }
  @keyframes collapse-in {
    0% {
      transform: translate(100px,-63px) scale(0);
    }
    100% {
      transform: translate(0,0) scale(1);
    }
  }

  /* 局部link-active样式 */
  .active {
    color: #fff;
  }
  .hover-underline:hover {
    color: #ddd;
  }
</style>

