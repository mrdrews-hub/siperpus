<template>
    <div id="qr-code-full-regions">
    </div>
</template>
<script>
import { defineComponent, onMounted, reactive, ref } from '@vue/composition-api'
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode'

export default defineComponent({
  props: {
    qrbox: {
      type: Number,
      default: 250,
    },
    fps: {
      type: Number,
      default: 10,
    },
  },
  setup(props, ctx) {
    const id = ref('qr-code-full-regions')
    const config = {
      fps: props.fps,
      qrbox: props.qrbox
    }
    onMounted(() => {
      const html5QrcodeScanner = new Html5QrcodeScanner(id.value, config)
      function onScanSuccess(decodedText, decodedResult) {
        ctx.emit('result', decodedText, decodedResult, html5QrcodeScanner)
      }
      

      html5QrcodeScanner.render(onScanSuccess)
    })

  }

  // mounted() {
  //   const config = {
  //     fps: this.fps,
  //     qrbox: this.qrbox,
  //   }
  //   const html5QrcodeScanner = new Html5QrcodeScanner('qr-code-full-regions', config)
  //   html5QrcodeScanner.render(this.onScanSuccess)
  // },
  // methods: {
  //   onScanSuccess(decodedText, decodedResult) {
      
  //     this.$emit('result', decodedText, decodedResult)
  //   },
  // },
})
</script>
