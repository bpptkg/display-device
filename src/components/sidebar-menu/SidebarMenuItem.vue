<template>
  <span v-if="item.divider" class="vsm-menu-divider"></span>
  <div
    v-else
    :class="[
      'vsm-menu-item',
      { 'vsm-menu-item--active': exactActive || active },
    ]"
  >
    <SidebarMenuLink
      :tag="itemLinkTag"
      :href="itemLinkHref"
      :disabled="item.disabled"
      class="vsm-menu-item menu-item"
      @click.native="clickEvent(null)"
    >
      <TemplateIcon :icon="icon" color="#5f6368" class="menu-item-icon" />
      <span class="vsm-menu-item menu-item-title">{{ item.title }}</span>
      <div v-if="item.child" class="menu-item-arrow">
        <TemplateIcon
          v-if="exactActive || active"
          :icon="expandLessIcon"
          class="vsm-menu-item menu-item-arrow-icon"
        />
        <TemplateIcon
          v-else
          :icon="expandMoreIcon"
          class="vsm-menu-item menu-item-arrow-icon"
        />
      </div>
    </SidebarMenuLink>
    <template v-if="item.child">
      <div class="vsm-menu-item submenu-item">
        <SidebarMenuLink
          v-for="(subItem, index) in item.child"
          :key="index"
          :tag="
            subItem.disabled || !subItem.href || subItem.plain
              ? 'a'
              : 'router-link'
          "
          :href="subItem.href ? subItem.href : ''"
          :disabled="subItem.disabled"
          :target="subItem.target"
          :rel="subItem.rel"
          :referrerpolicy="subItem.referrerpolicy"
          :class="[
            'vsm-menu-item',
            'submmenu-item',
            {
              'submenu-item--active': isLinkActive(subItem),
            },
          ]"
          @click.native="clickEvent(subItem)"
        >
          <span class="vsm-menu-item submenu-item-title">
            {{ subItem.title }}
          </span>
        </SidebarMenuLink>
      </div>
    </template>
  </div>
</template>

<script>
import SidebarMenuLink from './SidebarMenuLink'
import { DefaultIcon, TemplateIcon } from '../icons'
import { ExpandMoreIcon, ExpandLessIcon } from '../icons/navigation'

export default {
  name: 'SidebarMenuItem',
  components: {
    SidebarMenuLink,
    TemplateIcon,
  },
  inject: ['emitActiveShow', 'emitItemClick', 'emitChildItem'],
  props: {
    item: {
      type: Object,
      required: true,
    },
    activeShow: {
      type: Object,
      default: null,
    },
    childItem: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      active: false,
      exactActive: false,
      showChild: false,
      expandLessIcon: ExpandLessIcon,
      expandMoreIcon: ExpandMoreIcon,
    }
  },
  computed: {
    show() {
      if (!this.item.child) return false
      return this.showChild
    },
    icon() {
      return this.item.icon || DefaultIcon
    },
    isRouterLink() {
      return (
        (this.$router &&
          this.item &&
          this.item.href !== undefined &&
          !this.item.external) === true
      )
    },
    itemLinkHref() {
      if (
        !this.$router &&
        (!this.item.href || typeof this.item.href !== 'string')
      )
        return ''
      if (this.item.child) return ''
      return this.item.href ? this.item.href : ''
    },
    itemLinkTag() {
      if (this.item.child) return 'a'
      return this.item.disabled || !this.itemLinkHref
        ? 'a'
        : this.isRouterLink
        ? 'router-link'
        : 'a'
    },
  },
  watch: {
    activeShow() {
      this.exactActive = this.item === this.activeShow
      this.active = false
    },
    $route() {
      setTimeout(() => {
        if (this.item.header || this.item.component) return
        this.initState()
      }, 1)
    },
  },
  created() {
    this.initState()
    if (!this.$router) {
      window.addEventListener('hashchange', this.initState)
    }
  },
  destroyed() {
    if (!this.$router) {
      window.removeEventListener('hashchange', this.initState)
    }
  },
  methods: {
    clickEvent(item) {
      if (this.item.child && !item) {
        this.active = !this.active
        this.showChild = !this.showChild
      } else {
        this.emitChildItem(item)
        this.emitActiveShow(this.item)
        this.emitItemClick(event, item || this.item)
      }
    },
    isLinkActive(item) {
      return this.matchRoute(item) || this.isChildActive(item.child)
    },
    isLinkExactActive(child) {
      return this.matchExactRoute(child.href)
    },
    isChildActive(child) {
      if (!child) return false
      return child.some((item) => this.isLinkActive(item))
    },
    matchRoute({ href, exactPath }) {
      if (!href) return false
      if (this.$router) {
        const { route } = this.$router.resolve(href)

        const found = exactPath
          ? this.matchExactRoute(href)
          : this.$route.matched.some(({ regex }) =>
              route.redirectedFrom
                ? route.path.match(regex) !== null ||
                  route.redirectedFrom.match(regex) !== null
                : route.path.match(regex) !== null
            )
        return found
      } else {
        return exactPath
          ? href === window.location.pathname
          : this.matchExactRoute(href)
      }
    },
    matchExactRoute(href) {
      if (!href) return false
      if (this.$router) {
        const { route } = this.$router.resolve(href)
        return route.fullPath === this.$route.fullPath
      } else {
        return (
          href ===
          window.location.pathname +
            window.location.search +
            window.location.hash
        )
      }
    },
    initState() {
      this.initActiveState()
    },
    initActiveState() {
      this.exactActive = this.isLinkActive(this.item)
      this.active = this.isLinkExactActive(this.item)
      if (this.exactActive && this.item.child) {
        this.showChild = true
      }
    },
  },
}
</script>

<style lang="scss" scoped>
$primary-color: #3c4043;
$active-color: #4b4ba3;

$menu-item-color: $primary-color;
$menu-item-active-color: $active-color;
$submenu-item-color: $primary-color;
$submenu-item-active-color: $active-color;

.vsm-menu-item {
  position: relative;

  .submenu-item {
    display: none;

    .submenu-item-title {
      color: $submenu-item-color;
      margin-left: 40px;
    }

    &--active {
      .submenu-item-title {
        font-weight: bold;
        color: $submenu-item-active-color;
      }
    }
  }

  &--active {
    background-color: rgba(26, 115, 232, 0.2);
    box-shadow: inset 4px 0 0 #4b4ba3;

    .menu-item-icon {
      fill: $active-color;
    }
    .submenu-item {
      display: block;
    }
    .menu-item-title {
      font-weight: bold;
      color: $active-color;
    }
  }

  .menu-item-icon {
    height: 24px;
    margin-right: 16px;
    vertical-align: middle;
    width: 24px;
  }

  .menu-item-arrow {
    float: right;
    width: 24px;
  }

  .menu-item-arrow-icon {
    vertical-align: middle;
  }
}

.vsm-menu-divider {
  border-bottom: 1px solid #dadce0;
  width: 100%;
  display: inline-block;
  margin: 12px 0;
}
</style>
