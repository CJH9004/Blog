<template>
  <div class="archives-list">
    <v-loading v-show="loading" type="ring"></v-loading>
    <h2 class="title" v-show="!loading">归档</h2>
    <div class="archives-content border-1px" v-for="(item, key, index) in archives" v-show="!loading" :key="index">
      <h3 class="title">{{ key }} ({{ item.length }})</h3>
      <ul>
        <li v-for="(article, index) in item"  :key="index">
          <router-link :to="'/articles/' + article._id" class="hover-underline">{{ article.title }}</router-link>
          <span class="createTime">{{ article.createTime }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import api from '../../api';
import Loading from 'components/Loading/Loading';
export default {
  data(){
    return {
      archives: {},
      loading: true
    }
  },
  created(){
    api.getAllArticles()
      .then(res => {
        if(res.data.code === 200){
          let data = res.data.data;
          //根据article.createTime这个字段进行归档，最后返回一个对象{ "2017年六月": [], "2017年五月": [] }
          let archives = data.reduce((prev, curr) => {
            let time = curr.createTime.slice(0, 7).replace(' ', '年');
            if(typeof prev[time] === 'undefined'){
              prev[time] = [curr];
            }else{
              prev[time].push(curr)
            }
            return prev;
          }, {});
           this.loading = false;
           this.archives = archives;
        }
      })
      .catch(err => {
        console.log('获取文章失败！');
        alert('网络出现问题！');
      });
  },
  components: {
    'v-loading': Loading
  }
}
</script>

<style scoped>
.title {
  color: #393939;
}
a {
  color: rgb(37, 92, 241);
  font-size: 18px;
}
</style>
