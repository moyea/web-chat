<template>
  <div class="panel panel-primary">
    <div class="panel-heading">
      <h3 class="panel-title">Chat - 土豆机器人</h3>
    </div>
    <div class="panel-body" ref="msgContainer">
      <chat-msg class="chat-msg" v-for="(msg,idx) in messages" :message="msg" :key="idx"></chat-msg>
    </div>
    <div class="panel-footer">
      <div class="m-footer">
        <div class="msg-input">
          <input class="form-control" @keydown.enter="send()" v-model="draftMessage.text" name="message">
        </div>
        <div class="msg-oper">
          <label for="file" class="icon icon-file">
            <i class="glyphicon glyphicon-paperclip"></i>
          </label>
          <input id="file" type="file" ref="file" @change="handleChange" @click="handleClick">
          <i class="glyphicon glyphicon-send icon icon-send" @click="send"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import ChatMsg from '../components/chat-msg';
  import vue2Dropzone from 'vue2-dropzone';
  import 'vue2-dropzone/dist/vue2Dropzone.min.css';
  import API from '../services/api';
  import store from '../services/store';
  import {getStore, setStore} from '../services/utils';

  const getImageMsg = (msgList) => {
    return msgList.reduce((acc, cur) => acc.concat(cur.images), []);
  };

  const commandTypes = {
    MIX: 1, // 融合
    TRANS: 2, // 转换
    LOGO: 3, // 加logo
    CHRISTMAS: 4, // 圣诞帽
    ERROR: 99
  };

  const commandKeyWords = {
    [commandTypes.MIX]: [
      '融合',
      '合成'
    ],
    [commandTypes.TRANS]: [
      '转换',
      '手绘',
      '风格'
    ],
    [commandTypes.LOGO]: [
      'logo',
      '水印'
    ],
    [commandTypes.ERROR]: [
      'error',
      'exception'
    ],
    [commandTypes.CHRISTMAS]: [
      '圣诞节',
      '圣诞帽',
      '帽子'
    ]
  };

  const getCommandTypeFromMsg = (msg) => {
    const counts = Object.keys(commandKeyWords)
            .map(k => {
              let count = 0;
              commandKeyWords[k].forEach(keyword => {
                if (msg.toUpperCase().indexOf(keyword.toUpperCase()) > -1) {
                  count++;
                }
              });
              return {
                key: k,
                count
              };
            });

    counts.sort((a, b) => b.count - a.count);
    const maxCount = counts[0];
    return maxCount.count > 0 ? parseInt(maxCount.key) : -1;
  };

  const getCommandRespMsg = (command) => {
    switch (command) {
      case commandTypes.MIX:
        return {
          text: '请发给我两张图片，我会帮你进行融合',
          name: 'tudou'
        };
      case commandTypes.TRANS:
        return {
          text: '我需要一张图片',
          name: 'tudou'
        };
      case commandTypes.LOGO:
        return {
          text: '我需要一张图片',
          name: 'tudou'
        };
      case commandTypes.CHRISTMAS:
        return {
          text: '你的图片呢',
          name: 'tudou'
        };
    }
  };

  // 指令所需图片数量
  const commandImageLenMapping = {
    [commandTypes.MIX]: 2,
    [commandTypes.TRANS]: 1,
    [commandTypes.LOGO]: 1,
    [commandTypes.CHRISTMAS]: 1
  };
  export default {
    name: 'page-chat',
    components: {ChatMsg, VueDropzone: vue2Dropzone},
    data() {
      return {
        draftMessage: {},
        messages: [
          {text: '123', name: 'tudou', images: []}
        ],
        commandMsg: [],
        file: null,
        command: -1
        // dropzoneOptions: {
        //   url: 'http://example.com',
        //   thumbnailWidth: 150,
        //   maxFilesize: 0.5,
        //   autoProcessQueue: false
        // headers: {"My-Awesome-Header": "header value"}
        // }
      };
    },
    mounted() {
      const key = store.name;
      this.messages = getStore(key) || [];
    },
    methods: {
      handleClick(e) {
        e.target.value = null;
      },
      handleChange(e) {
        const vm = this;
        const file = e.target.files[0];
        if (!/image\/\w+/.test(file.type)) {
          return false;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
          vm.file = this.result;
          vm.postMsg({images: [vm.file]});
        };
      },
      send() {
        if (!this.draftMessage.text) {
          return;
        }
        this.command = getCommandTypeFromMsg(this.draftMessage.text);
        this.draftMessage = {
          ...this.draftMessage,
          name: store.name
        };
        this.postMsg(this.draftMessage, this.command > 0);
      },
      postMsg(msg, isCommand) {
        const curMsg = {
          ...this.draftMessage,
          ...msg,
          name: store.name
        };
        console.log(curMsg);
        this.messages.push(curMsg);
        this.draftMessage = {};
        if (isCommand) {
          if (this.command === 99) {
            this.messages.push({
              ...msg,
              link: 'https://stackoverflow.com/search?q=' + msg.text.replace(/' '/g, '+'),
              name: 'tudou',
              sendAt: Date.now()
            });
            return;
          }
          const commandRespMsg = getCommandRespMsg(this.command);
          if (commandRespMsg) {
            setTimeout(() => {
              this.messages.push(commandRespMsg);
            }, Math.random() * 1000);
          }
          this.commandMsg = [];
          return;
        }
        if (this.command > 0) {
          this.commandMsg.push(curMsg);
          const images = getImageMsg(this.commandMsg);
          if (this.commandMsg.length >= commandImageLenMapping[this.command]) {
            this.sendMsg({
              ...msg,
              type: this.command,
              images
            });
          }
        } else {
          this.sendMsg(curMsg);
          this.draftMessage = {};
        }
      },
      sendMsg(msg) {
        API.post('api/v1/robots/talk', msg)
                .then(res => {
                  const images = res.images;
                  this.messages.push({
                    ...res,
                    images,
                    name: 'tudou'
                  });
                  // this.scrollToBottom();
                  this.command = -1;
                  this.commandMsg = [];
                })
                .catch(err => {
                });
      },
      scrollToBottom() {
        this.$nextTick(() => {
          const scrollPanel = this.$refs.msgContainer;
          scrollPanel.scrollTop = scrollPanel.scrollHeight;
        });
      },
    },
    watch: {
      messages: {
        handler(newVal) {
          setStore(store.name, newVal);
          this.scrollToBottom();
        },
        immediate: false,
        deep: true
      }
    },
    beforeDestroy() {
      setStore(store.name, this.messages);
    }
  };
</script>
<style scoped>
  .panel {
    position: fixed;
    width: 100%;
    margin-bottom: 0;
    height: 100%;
    overflow: hidden;
  }

  .panel-heading {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 10;
  }

  .panel-title {
    line-height: 27px;
  }

  .panel-body {
    margin-top: 48px;
    height: calc(100vh - 58px - 48px);
    overflow-y: scroll;
    background-color: #eee;
  }

  .panel-footer {
    position: fixed;
    width: 100%;
    overflow: hidden;
    bottom: 0;
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

  #file {
    display: none;
  }

  .icon {
    width: 3em;
    text-align: center;
  }

  .icon-file {
    line-height: 34px;
    margin-bottom: 0;
    cursor: pointer;
  }

  .icon-send {
    /*margin-left: 2em;*/
    line-height: 34px;
    cursor: pointer;
  }

  .m-footer {
    position: relative;
    width: 100%;
    padding-right: 8em;
  }

  .msg-oper {
    position: absolute;
    width: 8em;
    bottom: 0;
    right: -10px;
  }
</style>
