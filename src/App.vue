<script setup lang="ts">
import {onMounted, ref} from "vue";
import { Peer } from "peerjs";

const friendVideo = ref<any>(undefined)
const myVideo = ref<any>(undefined)
const peerID = ref('');
const peerFID = ref('');
// @ts-ignore
const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia
const peer = ref<any>(null)
const peerStarted = ref<boolean>(false)

onMounted(()=>{

  getUserMedia(
      {video: true, audio: true},
      (stream: any) => {
        myVideo.value = stream
      });

})

function startPeer() {
  peer.value = new Peer(
      peerID.value
      // ,{
      // host: '0.peerjs.com'
      // port: '443'
      // pingInterval: 5000
// }
  )

  peer.value.on('open', () => {
    peerStarted.value = true
  })

  peer.value.on('error', (error: any) => {
    alert('error')
    console.error(error)
  })

  peer.value.on('close', () => {
    peerStarted.value = false
    console.log('close')
  })

  peer.value.on('disconnected', (disconnected: any) => {
    alert('disconnected')
    console.log(disconnected)
  })

  peer.value.on('call', (call : any) => {
    getUserMedia(
        {video: true, audio: true},
        (stream : any) => {
          call.answer(stream);
          call.on('stream', (remoteStream : any) => {
            console.log(remoteStream)
            console.log(friendVideo.value)
            friendVideo.value = remoteStream
          });
        }, (err: any) => {
          alert('Failed to get local stream')
          console.log('Failed to get local stream' ,err);
        });
  });
}

function callPeer() {
  getUserMedia(
      { video: true, audio: true },
      (stream: any) => {
        const call = peer.value.call(peerFID.value, stream);
        call.on("stream", (remoteStream: any) => {
          friendVideo.value = remoteStream
        });
      },
      (err: any) => {
        alert('Failed to get local stream')
        console.error("Failed to get local stream", err);
      });
}

function closePeer() {
  // peer.value.close();
  peer.value.destroy();
}

function shareMyId() {
  if (!("share" in navigator)) {
    alert('Web Share API not supported.');
    return;
  }

  navigator.share({
    text: peerID.value,
  }).catch(error => console.log('Error sharing:', error));
}

async function pasteId() {

  navigator.clipboard.readText()
      .then((text) => {
        peerFID.value = text
      })
      .catch(() => {
        alert("Can not read clipboard");
      });
}

</script>

<template>
  <div class="home">
    <div class="call-info">
      <div>
        <span>My ID:</span>
        <input type="text" v-model="peerID">
        <button v-if="!peerStarted" @click.prevent="startPeer()" class="start-btn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
          </svg>
        </button>
        <button v-else @click.prevent="closePeer()" class="close-btn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
          </svg>
        </button>
        <button @click.prevent="shareMyId()" class="share-btn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15" />
          </svg>
        </button>
      </div>
      <div>
        <span>Friend ID:</span>
        <input type="text" v-model="peerFID">
        <button @click.prevent="callPeer()" class="call-btn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
          </svg>
        </button>
        <button @click.prevent="pasteId()" class="paste-btn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
          </svg>

        </button>
      </div>
      <div>
      </div>
    </div>
    <div class="friend-video">
      <video :srcObject="friendVideo" autoplay loop playsInline></video>
<!--      <video :srcObject="myVideo" autoplay loop playsInline></video>-->
    </div>
    <div class="my-video">
      <video :srcObject="myVideo" autoplay loop muted playsInline></video>
    </div>
  </div>
</template>
