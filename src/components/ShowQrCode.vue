<template>
    <v-container>
        <v-dialog
        v-model="dialog"
        max-width="400"
        persistent>
            <v-card>
                <v-card-text>
                    <v-row justify="center" id="QRC">
                        <canvas id="QRCode"></canvas>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-container>
</template>
<script>
import { defineComponent, onMounted } from '@vue/composition-api'
import QRCode from 'qrcode'

export default defineComponent({
    props: {
        dialog: Boolean,
        text: String
    },
    setup(props, ctx) {
        onMounted(() => {
            QRCode.toCanvas(document.getElementById('QRCode'), props.text, function(err) {
                if (err) console.log(err);
                console.log('QR Mounted');
            })
        })
    },
})
</script>
<style scoped>
#QRC {
    width: 350px;
    height: 350px;
    padding: 20px;
}
</style>
