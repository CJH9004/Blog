<template>
  <div class="article-warpper"  :class="{ 'noCatalog': !hasCatalog }">
      <v-loading type="ring" v-show="loading"></v-loading>
      <article class="article" v-show="!loading">
        <header>
          <h1 class="title">{{ article.title }}</h1>
          <ul class="tags">
            <li class="tag" v-for="(tag, index) in article.tags" :key="index">
              <i class="iconfont icon-tag1"></i>
              {{ tag.name }}
            </li>
          </ul>
        </header>
        <p v-html="parser(article.content || '')" class="markdown"  ref="articleContent"></p>
        <footer>
          <p>发表于 <span class="createTime">{{ article.createTime }}</span> ,最后修改于 <span class="createTime">{{ article.lastEditTime }}</span></p>
        </footer>
      </article>
      <aside class="catalog" v-if="hasCatalog" v-show="!loading">
        <h3 @click="scrollToTop" title="返回顶部">文章目录<i class="iconfont icon-top"></i></h3>
        <div class="catalog-wrapper">
          <ul class="catalog-list">
            <li v-for="(item, index) in catalog" :key="index" class="catalog-li">
              <a class="hover-underline" href="javascript:;" @click="scrollTo(item.href)">{{ item.text }}</a>
            </li>
          </ul>
        </div>
      </aside>
  </div>
</template>

<script>
import api from '../../api';
import marked from '../../assets/js/marked';
import Loading from 'components/Loading/Loading';
//滚动组件
import VueScrollTo from 'vue-scrollto';

export default {
  data(){
    return {
      article: {},
      catalog: [],
      hasCatalog: false,  //这个变量有来判断该文章有没有目录
      loading: true
    }
  },
  watch: {
    '$route'(to, from){
      let path = from.path;
      if(path === '/articles' || path === '/tags' || path === '/archives'){
        if(to.params.id){
         this.loading = true;
         this.catalog = [];
         this.article = {};
          api.getArticleById(to.params.id)
            .then(res => {
              if(res.data.code === 200){
                this.loading = false;
                this.article = res.data.data;
                this.$nextTick(() => {
                  this.createCatalog();
                });
              }
            })
            .catch(err => {
              this.$router.push({
                path: '/articles'
              })
            });

        }
      }
    }
  },
  created(){
    api.getArticleById(this.$route.params.id)
      .then(res => {
        if(res.data.code === 200){
          this.loading = false;
          this.article = res.data.data;
          this.$nextTick(() => {
            this.createCatalog();
          });
        }
      })
      .catch(err => {
        this.$router.push({
          path: '/articles'
        })
      });
  },
  methods: {
    parser(value){
      return marked(value);
    },
    //生成目录
    createCatalog(){
      let nodeList = this.$refs['articleContent'].querySelectorAll('h1, h2, h3, h4, h5, h6');
      if(nodeList.length === 0){
        this.hasCatalog = false;
        return;
      }
      this.hasCatalog = true;
      Array.from(this.$refs['articleContent'].querySelectorAll('h1, h2, h3, h4, h5, h6')).forEach((item, i) => {
        item.id = item.localName + '-' + i; //给标签设置id
        this.catalog.push({
          tagName: item.localName,
          text: item.innerText,
          href: item.localName + '-' + i     //href为上面所设置的id
        });
      });
    },
    //滚动到指定标题
    scrollTo(id){
      let obj = document.getElementById(id);
      VueScrollTo.scrollTo(obj, {
        onDone: function(){
          obj.style.transform = 'scale(1.2)';
          obj.style.webkitTransform = 'scale(1.2)';
          obj.style.transition = 'all .5s';
          obj.style.webkitTransition = 'all .5s';
          obj.addEventListener('transitionend', function(){
            this.style = '';
          })
        }
      });
    },
    //返回顶部
    scrollToTop(){
      VueScrollTo.scrollTo('#app');
    }
  },
  components: {
    'v-loading': Loading
  },
  updated(){
    window.scrollTo(0,1)
  }
}
</script>

<style scoped>
.title {
  color: #393939;
}
footer {
  font-size: 14px;
  color: #666;
}
.markdown {
  padding: 16px;
  overflow: hidden;
}
@media (min-width: 480px) {
  .markdown {
    padding: 32px;
  }
}
@media (min-width: 900px) {
  .markdown {
    padding: 64px;
  }
}
.catalog {
  border-radius: 15px;
  position: fixed;
  top: 25%;
  right: 0;
  width: 130px;
  height: 150px;
  background-color: rgba(43, 43, 43, 0.6);
  transform: translateX(100px);
  transition: all .5s;
  overflow: hidden;
}
.catalog:hover {
  transform: translateX(0px);
}
.catalog>h3 {
  color: #ccc;
  display: inline-block;
  width: 30px;
  text-align: center;
  margin: 0;
  position: absolute;
  top: 10px;
  left: 0;
  cursor: pointer;
}
.catalog-wrapper {
  width: 100px;
  position: absolute;
  right: 0;
  top: 0;
}
.catalog-list {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow-y: scroll;
  height: 150px;
}

/* 设置滚动条的样式 */
.catalog-list::-webkit-scrollbar {
  width: 6px;
}
/* 滚动槽 */
.catalog-list::-webkit-scrollbar-track {
  box-shadow:inset 0 0 6px rgba(0,0,0,0.3);
  border-radius:10px;
}
/* 滚动条滑块 */
.catalog-list::-webkit-scrollbar-thumb {
border-radius:10px;
background:rgba(0,0,0,0.1);
box-shadow:inset 0 0 6px rgba(0,0,0,0.5);
}
.catalog-list::-webkit-scrollbar-thumb:window-inactive {
background:rgba(255,0,0,0.4);
}

/* add to avoid reflow */
.catalog-list>li {
  height: 22px;
  margin: 2px 0;
}
.catalog-list a {
  color: rgb(168, 234, 236);
  font-size: 14px;
  display: block;
  overflow-x: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
