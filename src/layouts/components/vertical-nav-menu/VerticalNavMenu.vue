<template>
  <v-navigation-drawer
    :value="isDrawerOpen"
    app
    floating
    width="260"
    class="app-navigation-menu"
    :right="$vuetify.rtl"
    @input="val => $emit('update:is-drawer-open', val)"
  >
    <!-- Navigation Header -->
    <div class="vertical-nav-header d-flex items-center ps-6 pe-5 pt-5 pb-2">
      <router-link
        to="/"
        class="d-flex align-center text-decoration-none"
      >
        <v-img
          :src="require('@/assets/images/logos/logo.svg')"
          max-height="30px"
          max-width="30px"
          alt="logo"
          contain
          eager
          class="app-logo me-3"
        ></v-img>
        <v-slide-x-transition>
          <h2 class="app-title text--primary">
            SIPERPUS
          </h2>
        </v-slide-x-transition>
      </router-link>
    </div>

    <!-- Navigation Admin -->
    <v-list
      expand
      shaped
      class="vertical-nav-menu-items pr-5"
    >
      <nav-menu-link
        title="Dashboard"
        :to="{ name: 'dashboard' }"
        :icon="icons.mdiHomeOutline"
      ></nav-menu-link>
      <nav-menu-link
        title="Rack"
        :to="{ name: 'rack' }"
        :icon="icons.mdiBookshelf"
      ></nav-menu-link>
      <nav-menu-link
        title="Categories"
        :to="{ name: 'categories' }"
        :icon="icons.mdiShapePlus"
      ></nav-menu-link>
      <nav-menu-link
        title="Members"
        :to="{ name: 'members' }"
        :icon="icons.mdiAccountGroup"
      ></nav-menu-link>
      <!-- <nav-menu-link
        title="Pelanggaran"
        :to="{ name: 'pelanggaran' }"
        :icon="icons.mdiAlert"
      ></nav-menu-link> -->
      <v-list-group
        :value="true"
        :prepend-icon="icons.mdiBookOpen"
      >
        <template v-slot:activator>
          <v-list-item-title>Books</v-list-item-title>
        </template>
        <nav-menu-link
          class="ml-4"
          title="Katalog Buku"
          :to="{ name: 'books' }"
          :icon="icons.mdiBookCog"
        ></nav-menu-link>
        <nav-menu-link
          class="ml-4"
          title="Pengadaan Buku"
          :to="{ name: 'stocks' }"
          :icon="icons.mdiBookPlus"
        ></nav-menu-link>
        <nav-menu-link
          class="ml-4"
          title="Peminjaman"
          :to="{ name: 'borowing' }"
          :icon="icons.mdiBookClock"
        ></nav-menu-link>
        <nav-menu-link
          class="ml-4"
          title="Pengembalian"
          :to="{ name: 'return' }"
          :icon="icons.mdiBookCheck"
        ></nav-menu-link>
      </v-list-group>
      <nav-menu-link
        title="Report"
        :to="{ name: 'report' }"
        :icon="icons.mdiFileTable"
      ></nav-menu-link>
      <nav-menu-section-title title="Root"></nav-menu-section-title>
      <nav-menu-link
        title="Users"
        :to="{ name: 'users' }"
        :icon="icons.mdiAccountKey"
      ></nav-menu-link>
    </v-list>
    <!-- END -->

  </v-navigation-drawer>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import {
  mdiHomeOutline,
  mdiAccountGroup,
  mdiEyeOutline,
  mdiCreditCardOutline,
  mdiBookOpen,
  mdiBookCheck,
  mdiBookClock,
  mdiBookshelf,
  mdiBookCog,
  mdiShapePlus,
  mdiAccountKey,
  mdiFileOutline,
  mdiFormSelect,
  mdiAccountCogOutline,
  mdiFileTable,
  mdiBookPlus,
  mdiAlert
} from '@mdi/js'
import NavMenuSectionTitle from './components/NavMenuSectionTitle.vue'
import NavMenuGroup from './components/NavMenuGroup.vue'
import NavMenuLink from './components/NavMenuLink.vue'

export default {
  components: {
    NavMenuSectionTitle,
    NavMenuGroup,
    NavMenuLink,
  },
  props: {
    isDrawerOpen: {
      type: Boolean,
      default: null,
    },
  },
  setup(props, ctx) {
    const store = ctx.root.$store

    return {
      store,
      icons: {
        mdiHomeOutline,
        mdiAccountGroup,
        mdiEyeOutline,
        mdiCreditCardOutline,
        mdiBookOpen,
        mdiBookCheck,
        mdiBookClock,
        mdiBookshelf,
        mdiBookCog,
        mdiBookPlus,
        mdiAccountKey,
        mdiFileTable,
        mdiShapePlus,
        mdiFileOutline,
        mdiFormSelect,
        mdiAccountCogOutline,
        mdiAlert
      },
    }
  },
}
</script>

<style lang="scss" scoped>
.app-title {
  font-size: 1.25rem;
  font-weight: 700;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: 0.3px;
}

// ? Adjust this `translateX` value to keep logo in center when vertical nav menu is collapsed (Value depends on your logo)
.app-logo {
  transition: all 0.18s ease-in-out;
  .v-navigation-drawer--mini-variant & {
    transform: translateX(-4px);
  }
}

@include theme(app-navigation-menu) using ($material) {
  background-color: map-deep-get($material, 'background');
}

.app-navigation-menu {
  filter: drop-shadow(1px 0px 6px #ddd);
  .v-list-item {
    &.vertical-nav-menu-link {
      ::v-deep .v-list-item__icon {
        .v-icon {
          transition: none !important;
        }
      }
    }
  }
}

// You can remove below style
// Upgrade Banner
.app-navigation-menu {
  .upgrade-banner {
    position: absolute;
    bottom: 13px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
