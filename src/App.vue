<script setup lang="ts">

import {onBeforeMount, onMounted, ref} from "vue";
import { Peer } from "peerjs";

const friendVideo = ref<any>(undefined)
const myVideo = ref<any>(undefined)

const peerID = ref('');
const peerFID = ref('');
// @ts-ignore
const getUserMedia = ref<any>(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia);

const peer = new Peer()

onMounted(()=>{

  getUserMedia.value(
      {video: true, audio: false},
      (stream: any) => {
        myVideo.value = stream
      });

  peer.on('open', id => {
    peerID.value = id
  })

  peer.on('error', error => {
    alert('error')
    console.error(error)
  })

  peer.on('close', () => {
    alert('close')
    console.log('close')
  })

  peer.on('disconnected', disconnected => {
    alert('disconnected')
    console.log(disconnected)
  })

  peer.on('call', (call) => {
    getUserMedia.value(
        {video: true, audio: true},
        (stream : any) => {
          call.answer(stream);
          call.on('stream', (remoteStream) => {
            console.log(remoteStream)
            console.log(friendVideo.value)
            friendVideo.value = remoteStream
          });
        }, (err: any) => {
          alert('Failed to get local stream')
          console.log('Failed to get local stream' ,err);
        });
  });

})

function callPeer() {
  getUserMedia.value(
      { video: true, audio: true },
      (stream: any) => {
        const call = peer.call(peerFID.value, stream);
        call.on("stream", (remoteStream) => {
          friendVideo.value = remoteStream
        });
      },
      (err: any) => {
        alert('Failed to get local stream')
        console.error("Failed to get local stream", err);
      });
}
</script>

<template>
  <div class="home">
    <div class="call-info">
      <div>
        my id:
        <input type="text" v-model="peerID">
      </div>
      <div>
        friend id:
        <input type="text" v-model="peerFID"><button @click.prevent="callPeer()">Call</button>
      </div>
      <div>
      </div>
    </div>
    <div class="friend-video">
      <video width="300" :srcObject="friendVideo" autoplay loop playsInline></video>
    </div>
    <div class="my-video">
      <video width="300" :srcObject="myVideo" autoplay loop muted playsInline></video>
    </div>
  </div>
</template>
