<template>
  <div class="account">
    <div class="avatar" v-clickaway="hide" @click="toggle">
      <BAvatar
        v-b-tooltip.hover
        title="Account"
        class="b-avatar"
        size="2rem"
        :text="isAuthenticated ? abbrevName : ''"
      />
    </div>
    <div v-show="visible" class="account-content">
      <div v-if="isAuthenticated">
        <div class="account-content-info">
          <div class="account-content-info-avatar">
            <BAvatar class="b-avatar" :text="abbrevName" size="4rem" />
          </div>
          <div class="account-content-info-name">
            {{ user.name || user.username }}
          </div>
          <div class="account-content-info-username">@{{ user.username }}</div>
        </div>
        <div class="item-divider"></div>
        <div class="sign-button-wrapper">
          <button class="sign-button" @click="handleLogout">Sign out</button>
        </div>
      </div>
      <div v-else class="account-content-info">
        <div class="account-content-info-name">Hello there!</div>
        <div class="sign-button-wrapper">
          <button class="sign-button" @click="handleLogin">Sign in</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Axios from 'axios'
import { directive as clickaway } from 'vue-clickaway'
import { BAvatar, VBTooltip } from 'bootstrap-vue'

export default {
  name: 'TheAvatar',
  components: {
    BAvatar,
  },
  directives: {
    clickaway,
    'b-tooltip': VBTooltip,
  },
  data() {
    return {
      visible: false,
    }
  },
  computed: {
    ...mapState({
      user: (state) => state.user.user,
      csrfToken: (state) => state.user.csrfToken,
    }),
    isAuthenticated() {
      return this.user.username !== undefined && this.user.username !== null
    },
    abbrevName() {
      const defaultAbbrevName = 'D'
      if (this.isAuthenticated) {
        const userSplit = this.user.name.split(' ')
        const name =
          userSplit.length > 1
            ? userSplit
                .map((n) => n[0].toUpperCase())
                .slice(0, 1)
                .join('')
            : this.user.name.length > 1
            ? [...this.user.name]
                .map((n) => n.toUpperCase())
                .slice(0, 1)
                .join('')
            : defaultAbbrevName
        return name
      } else {
        return defaultAbbrevName
      }
    },
  },
  methods: {
    toggle() {
      this.visible = !this.visible
    },
    show() {
      this.visible = true
    },
    hide() {
      this.visible = false
    },
    async handleLogin() {
      window.location.replace('/')
    },
    async handleLogout() {
      /**
       * Sign out may not work when developing the app on localhost server.
       */
      await Axios.post('/logout')
        .catch((_) => {
          // Ignore the error. This typically occurred when you're developing on
          // localhost server.
        })
        .finally(() => {
          window.location.replace('/')
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.account {
  position: relative;
  display: inline-block;
}

.account-content {
  position: absolute;
  right: 0;
  background-color: #fff;
  width: 250px;
  line-height: normal;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3),
    0 2px 6px 2px rgba(60, 64, 67, 0.15);
  z-index: 1;
  overflow-x: hidden;
  overflow-y: auto;
}

.item-divider {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  margin: 7px 0;
}

.account-content-info {
  margin: 20px 33px;
  align-items: center;
  display: flex;
  flex-direction: column;
}

.avatar {
  cursor: pointer;
}

.account-content-info-avatar {
  margin-bottom: 10px;
  position: relative;
  display: block;
  text-align: center;
}

.account-content-info-name {
  color: #202124;
  letter-spacing: 0.29px;
  margin: 0;
  text-align: center;
  text-overflow: ellipsis;
  overflow: hidden;
}

.account-content-info-username {
  color: #5f6368;
  letter-spacing: normal;
  text-align: center;
  text-overflow: ellipsis;
  overflow: hidden;
}

.sign-button-wrapper {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.sign-button {
  background-color: #ffffff;
  border: 1px solid #dadce0;
  -webkit-border-radius: 4px;
  border-radius: 4px;
  display: inline-block;
  letter-spacing: 0.15px;
  margin: 16px;
  outline: 0;
  padding: 10px 24px;
  text-align: center;
  text-decoration: none;
  white-space: normal;
}

.b-avatar {
  background-color: #ef5483 !important;
}
</style>
