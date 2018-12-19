<template>
  <div class="room-selection">
    <h1>土豆机器人</h1>
    <p class="instructions">请输入你的姓名开始对话</p>
    <input type="text" v-model="name" class="input-line" placeholder="">
    <button class="btn btn-primary btn-lg start-btn" @click="onClick">开始</button>
  </div>
</template>

<script>
  import store from '../services/store';
  import {getStore, setStore} from '../services/utils';

  export default {
    name: 'page-login',
    data() {
      return {
        name: ''
      };
    },
    mounted() {
      this.name = getStore('username') || '';
    },
    methods: {
      onClick() {
        store.name = this.name;
        setStore('username', store.name);
        this.$router.push('/chat');
      }
    }

  };
</script>

<style scoped>
  .room-selection {
    margin: 3em auto 0 auto;
    padding: 1em 1.5em 1.3em 1.5em;
    width: 25em;
    text-align: center;
  }

  .instructions {
    font-size: 18px;
    margin-top: 2em;
  }

  .input-line {
    display: block;
    width: 100%;
    text-align: center;
    border: 0;
    font-size: 18px;
    line-height: 2;
    border-bottom: 1px solid #ccc;
    border-radius: 0;
  }

  .start-btn {
    margin-top: 3em;
    width: 50%;
    font-weight: bold;
  }
</style>
