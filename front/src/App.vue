<template>
    <div id="app">
        <v-header></v-header>
        <main class="container">
            <transition name="fade" mode="out-in">
                <keep-alive><router-view></router-view></keep-alive>
            </transition>
        </main>
        <v-footer></v-footer>                  
    </div>        
</template>

<script>
import Header from 'components/Header/Header';
import Footer from 'components/Footer/Footer';

export default {
    components: {
      'v-header': Header,
      'v-footer': Footer
    }
}
</script>

<style>
body {
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
}
#app {
    display: flex;
    flex-flow: column;
    min-height: 800px;
}
.container {
    flex: 1;
}
.border-1px {
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px #ddd;
  margin: 16px;
  padding: 16px;
}
.tags {
  list-style-type: none;
  margin: 0;
  padding: 0;
}
.tag {
  display: inline-block;
  color: chocolate;
  margin: 0 16px;
}
/* 全局link样式 */
.active {
    border-bottom: 5px solid rgba(124, 241, 139, 0.8);
}
.hover-underline:hover {
    border-bottom: 5px solid rgba(124, 241, 139, 0.8);
}
a {
    transition: all 0.3s;
    text-decoration: none;
}
.createTime {
  color: darkseagreen;
}
</style>
