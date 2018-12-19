<template>
  <div class="msg-container" :class="{'sent':incoming}">
    <div class="avatar">
      <img class="img-responsive" src="../assets/images/avatars/male-avatar-1.png" alt="">
    </div>
    <div class="messages">
      <p v-if="!message.link&&message.text">{{message.text}}</p>
      <a v-if="message.link" target="_blank" :href="message.link">{{message.text}}</a>
      <div v-for="(img,idx) in message.images" :key="idx">
        <img class="msg-img" v-if="img" :src="img" alt="">
      </div>
      <!--<p class="text-muted">{{message.name}} * {{message.sendAt | fromNow}}</p>-->
    </div>
  </div>
</template>

<script>
  export default {
    name: 'chat-msg',
    props: {
      message: {
        type: Object,
        default: () => ({
          name: '',
          text: '',
          sendAt: Date.now(),
          images: []
        })
      }
    },
    computed: {
      incoming() {
        return this.message.name !== 'tudou';
      }
    }
  };
</script>

<style scoped>
  .msg-container {
    position: relative;
    padding-left: 40px;
    display: inline-block;
  }

  .msg-container.sent {
    padding-right: 40px;
    padding-left: 0;
  }

  .msg-container.sent .avatar {
    position: absolute;
    right: 0;
    left: auto;
    top: 0;
  }

  .msg-container .avatar {
    position: absolute;
    left: 0;
    top: 0;
  }

  .avatar {
    width: 40px;
  }

  .messages {
    padding: 1.5em;
    background-color: #fff;
  }

  .messages p {
    margin-bottom: 0;
    font-size: 16px;
    line-height: 1.8;
    word-break: break-all;
  }

  .msg-img {
    max-width: 150px;
  }
</style>
