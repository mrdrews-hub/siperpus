<template>
  <transition name="slide-fade">
    <component :is="resolveLayout">
      <router-view></router-view>
    </component>
  </transition>
</template>

<script>
import { computed, ref, watch } from '@vue/composition-api'
import { useRouter } from '@/utils'
import LayoutBlank from '@/layouts/Blank.vue'
import LayoutContent from '@/layouts/Content.vue'
import LayoutMember from '@/layouts/MemberContent.vue'

export default {
  components: {
    LayoutBlank,
    LayoutContent,
    LayoutMember
  },
  setup(props, context) {
    const { route } = useRouter()
    const resolveLayout = computed(() => {
      // Handles initial route
      if (route.value.name === null) return null

      if (route.value.meta.layout === 'blank') return 'layout-blank'

      if (route.value.meta.layout === 'member') return 'layout-member'

      return 'layout-content'
    })

    return {
      resolveLayout,
    }
  },
}
</script>
<style>
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
