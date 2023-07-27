<script setup lang="ts">

import {onBeforeMount, ref} from "vue";
import { Peer } from "peerjs";

// const myVideo = ref<HTMLVideoElement>(null)
const fVideo = ref<any>(undefined)
const mVideo = ref<any>(undefined)

let peerID = ref('');
let peerFID = ref('');

const peer = new Peer()

onBeforeMount(()=>{

  peer.on('open', id => {
    peerID.value = id
  })

  peer.on('error', error => {
    console.log(error)
  })

  peer.on('close', () => {
    console.log('close')
  })

  peer.on('disconnected', disconnected => {
    console.log(disconnected)
  })

  // @ts-ignore
  let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  peer.on('call', (call) => {

    getUserMedia(
        {video: true, audio: true},
        (stream : any) => {
          call.answer(stream);
          call.on('stream', (remoteStream) => {
            console.log(remoteStream)
            console.log(fVideo.value)
            fVideo.value = remoteStream
          });
        }, (err: any) => {
          console.log('Failed to get local stream' ,err);
        });

    getUserMedia(
        {video: true, audio: false},
        (stream: any) => {
          mVideo.value = stream
        });

  });

})

function callPeer() {
  // @ts-ignore
  let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

  getUserMedia(
      { video: true, audio: true },
      (stream: any) => {
        const call = peer.call(peerFID.value, stream);
        call.on("stream", (remoteStream) => {
          fVideo.value = remoteStream
        });
      },
      (err: any) => {
        console.error("Failed to get local stream", err);
      });

  getUserMedia(
      {video: true, audio: false},
      (stream: any) => {
        mVideo.value = stream
      });
}
</script>

<template>

  <div class="home" style="text-align: center">
    <h1>Peer Video</h1>
    <div>
      my id:
      <input type="text" v-model="peerID">
    </div>
    <div>
      friend id:
      <input type="text" v-model="peerFID">
    </div>
    <div>
      <button @click.prevent="callPeer()">Call</button>
    </div>
    <!--    <div>-->
    <!--      <video ref="myVideo"></video>-->
    <!--    </div>-->
    <div>
      <!--      <video width="300" height="200" :srcObject.prop="fVideo" autoplay/>-->
      <video style="border: 2px solid #000" width="300" controls :srcObject="fVideo" autoplay loop playsInline></video>
    </div>
    <div>
      <video style="border: 2px solid #000" width="300" controls :srcObject="mVideo" autoplay loop muted playsInline></video>
      <!--      <video style="border: 2px solid #000" autoplay/>-->
    </div>
    <!--    <HelloWorld msg="Welcome to Your Vue.js App"/>-->
  </div>

  <RouterView />
</template>
