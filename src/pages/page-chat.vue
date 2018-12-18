<template>
  <div class="panel panel-primary">
    <div class="panel-heading">
      <h3 class="panel-title">Chat - 土豆机器人</h3>
    </div>
    <div class="panel-body" ref="msgContainer">
      <chat-msg class="chat-msg" v-for="(msg,idx) in messages" :message="msg" :key="idx"></chat-msg>
    </div>
    <div class="panel-footer">
      <form class="form-inline" @submit.prevent>
        <div class="row">
          <div class="col-sm-10">
            <input class="form-control" @keydown.enter="sendMessage()" v-model="draftMessage.text" name="message">
          </div>
          <button class="btn btn-primary col-sm-2" @click="sendMessage()">Send</button>
        </div>

      </form>
    </div>
  </div>
</template>

<script>
  import ChatMsg from '../components/chat-msg';

  export default {
    name: 'page-chat',
    components: {ChatMsg},
    data() {
      return {
        draftMessage: {},
        messages: [
          {text: '123', name: 'tudou'}
        ]
      };
    },
    methods: {
      sendMessage() {
        this.messages.push(this.draftMessage);
        this.draftMessage = {};
      },
      scrollToBottom() {
        const scrollPanel = this.$refs.msgContainer;
        scrollPanel.scrollTop = scrollPanel.scrollHeight;
      }
    }
  };
</script>
<style scoped>
  .panel {
    margin-bottom: 0;
    height: 100%;
    /*width: 270px;*/
    /*margin-right: 20px;*/
  }

  .panel-body {
    height: calc(100vh - 104px - 38px);
    overflow-y: scroll;
    background-color: #eee;
  }

  .content p {
    margin-bottom: 0;
  }

  .form-control {
    display: block;
    width: 100%;
  }

  .chat-msg:not(:first-child) {
    margin-top: 1em;
  }
</style>
