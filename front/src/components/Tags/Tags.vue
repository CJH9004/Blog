<template>
  <div class="tags-list">
    <v-loading v-show="loading" type="ring"></v-loading>
    <div class="tags-wrapper" v-show="!loading">
      <h2 class="title">所有标签</h2>
      <ul class="tags">
        <li v-for="(tag, index) in tags" class="tag" :key="index">
          <i class="iconfont icon-tag1"></i>
          <a href="javascript:;" @click="scrollTo(tag._id)" class="hover-underline">{{ tag.name }}</a>
        </li>
      </ul>
    </div>
    <div class="tags-article border-1px" v-for="(item, index) in tagArticle" :id="item.id" v-show="!loading" :key="index">
      <h3 class="title">{{ item.name }}</h3>
      <ul class="articles">
        <li v-for="(article, index) in item['articles']" :key="index" class="article">
          <router-link :to="'/articles/' + article._id"><span class="title hover-underline">{{ article.title }}</span></router-link>
          <span class="createTime">{{ article.createTime | formatDate }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import api from '../../api';
import Loading from 'components/Loading/Loading';
//滚动组件
import VueScrollTo from 'vue-scrollto';

export default {
  data(){
    return {
      tags: [],
      tagArticle: [],
      loading: true
    }
  },
  filters: {
    formatDate(value){
      return value.slice(0, 11);
    }
  },
  created(){
    //先获取所有标签，再根据所有标签获取文章
    api.getAllTags()
      .then(res => {
        if(res.data.code === 200){
          let tags = res.data.data.slice(0);
          this.tags = tags;
          this.loading = false;
          tags.forEach((o) => {
            api.getArticleByTagId(o._id)
              .then(res => {
                if(res.data.code === 200){
                  let obj = {};
                  obj.name = o.name;
                  obj.id = o._id;
                  obj.articles = res.data.data;
                  this.tagArticle.push(obj);
                }
              })
              .catch(err => {
                console.log('根据标签获取文章失败！');
                alert('网络出现问题！');
              });
          });
        }
      })
      .catch(err => {
        console.log('获取所有标签错误！');
        alert('网络出现问题！');
      });
  },
  methods: {
    //滚动到某处
    scrollTo(id){
      let obj = document.getElementById(id);
      VueScrollTo.scrollTo(obj);
    }
  },
  components: {
    'v-loading': Loading
  }
}
</script>

<style scoped>
.tag>a {
  color: chocolate;
}
.title {
  color: #393939;
  box-shadow: 0 2px 4px #ddd;
}
.articles {
  list-style-type: none;
}
</style>
