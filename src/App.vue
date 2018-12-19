<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
    import store from './services/store';
    import {getStore} from './services/utils';

    export default {
        name: 'app',
        components: {},
        mounted() {
            store.name = getStore('username');
        }
    };
</script>

<style>
    @import "~bootstrap/dist/css/bootstrap.css";

    * {
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }

    *:focus {
        outline: none;
    }

    .btn:focus, .btn:active:focus {
        outline: none;
    }

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    #uploader {
        position: absolute;
        width: 0;
        height: 0;
        z-index: -1;
        padding: 0;
        min-height: 0;
        border: 0;
    }
</style>
