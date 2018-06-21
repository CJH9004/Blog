<template>
  <div class="articles-list">
    <article v-for="(item, index) in articles" :key="index" class="article border-1px">
      <header>
        <h1 class="title"><router-link :to="'/articles/' + item._id" class="hover-underline">{{ item.title }}</router-link></h1>
        <p class="createTime">{{ item.createTime }}</p>
      </header>
      <p class="markdown" v-html="parser(item.abstract || '')"></p>
      <ul class="tags">
        <li class="tag" v-for="(tag, index) in item.tags" :key="index">
          <i class="iconfont icon-tag1"></i>
          {{ tag.name }}
        </li>
      </ul>
      <footer>
        <router-link :to="'/articles/' + item._id" class="continue hover-underline">...read more</router-link>
      </footer>
    </article>
    <p v-show="load" class="load">加载中...</p>
    <div class="scrollToTop" v-show="articles.length > 0" @click="scrollToTop">top</div>
  </div> 
</template>

<script>
import api from '../../api';
import marked from '../../assets/js/marked.js';
import Loading from 'components/Loading/Loading';
import VueScrollTo from 'vue-scrollto';

export default {
  data(){
    return {
      articles: [],
      page: 1,  //默认加载第一页
      limit: 5, //一次加载五条数据
      pages: -1, //总页数
      load: false,  //显示加载中
      end: false   //判断请求是否完成，只有当前请求发送完，才能发送下一个请求
    }
  },
  created(){
     api.getArticlesByPage(this.page, this.limit)
        .then(res => {
          if(res.data.code === 200){
            this.pages = Math.ceil(res.data.total/this.limit);
            this.articles = res.data.data.slice(0);
          }
        })
        .catch(err => {
          console.log('获取文章失败！');
          alert('网络出现问题！');
        });
  },
  mounted(){
    document.addEventListener('scroll', () => {
      let scrollTop = document.body.scrollTop;      //获取当前滚动条的高度
      let offsetHeight = document.body.offsetHeight;    //获取可视区的高度
      let scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight); //获取总内容高度
      if(offsetHeight + scrollTop + 5 >= scrollHeight){  
        if(this.end === false){      //先当前是否在处理发送的请求，只有this.end===fasle的时候才能发送请求
          this.end = true;                 
          if(this.page >= this.pages){     //判断当前页数是否>总页数
            this.load = false;
            return;
          }
          this.load = true;        //显示“加载中...”
          this.page = this.page + 1;           //当前页数加一， 再请求
          api.getArticlesByPage(this.page, this.limit)
          .then(res => {
            if(res.data.code === 200){
              this.load = true;     //隐藏掉“加载中”
              this.end = false;     //可以发送下一个请求了
              this.$nextTick(() => {
                  this.articles = this.articles.concat(res.data.data.slice(0));
              });
            }
          })
          .catch(err => {
            console.log('获取文章失败！');
            alert('网络出现问题！');
          });
        } 
      }
    });
  },
  methods: {
    //解析markdown
    parser(value){
      return marked(value);
    },
    scrollToTop(){
      VueScrollTo.scrollTo(document.getElementById('app'));
    }
  }
}
</script>

<style scoped>
/* 局部link样式 */
a{
  color: #393939;
}

.title {
  box-shadow: 0 2px 4px #ddd;
}
.articles-list {
  display: flex;
  flex-wrap: wrap;
}
.article {
  flex: 1 0 260px;
}
.continue {
  float: right;
}
.scrollToTop {
  position: fixed;
  right: 10px;
  bottom: 25%;
  width: 40px;
  line-height: 40px;
  border-radius: 15px;
  color: #fff;
  text-align: center;
  background-color: rgba(43, 43, 43, 0.6);
  cursor: pointer;
}
</style>
