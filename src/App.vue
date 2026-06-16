<template>
  <Layout class="app-layout" :bottom-divider="false">
    <template #top>
      <Topbar>
        <template #title>
          <div class="brand">
            <span class="brand-mark">多</span>
            <strong>多语言管理</strong>
          </div>
        </template>
        <nav class="root-nav" aria-label="根导航">
          <button
            v-for="item in topMenu"
            :key="item.key"
            :class="{ active: currentRoot === item.key }"
            type="button"
            @click="topSelected = [item.key]"
          >
            {{ item.title }}
          </button>
        </nav>
        <template #extra>
          <div class="top-extra">
            <Button type="light">帮助</Button>
            <Avatar :size="32" shape="circle">J</Avatar>
          </div>
        </template>
      </Topbar>
    </template>

    <template #left>
      <aside class="side-nav" :class="{ collapsed: menuCollapsed }">
        <button class="collapse-button" type="button" @click="menuCollapsed = !menuCollapsed">
          {{ menuCollapsed ? '›' : '‹' }}
        </button>
        <template v-for="item in activeSideMenu" :key="item.key">
          <small v-if="item.type === 'description'">{{ item.title }}</small>
          <button
            v-else
            type="button"
            :class="{ active: sideSelected[0] === item.key }"
            @click="sideSelected = [item.key]"
          >
            {{ item.title }}
          </button>
        </template>
      </aside>
    </template>

    <CopySpaceView v-if="currentRoot === 'copy'" />
    <DemandView v-else />
  </Layout>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Avatar, Button, Layout, Topbar } from '@xhs/delight'
import CopySpaceView from './views/CopySpaceView.vue'
import DemandView from './views/DemandView.vue'

type SideMenuItem = { type: 'description' | 'item'; title: string; key: string }

const topMenu = [
  { title: '需求管理', key: 'demand' },
  { title: '文案空间', key: 'copy' },
  { title: '发布记录', key: 'release' },
]
const demandSideMenu: SideMenuItem[] = [
  { type: 'description', title: '需求管理', key: 'demand-group' },
  { type: 'item', title: '新建需求', key: 'create' },
  { type: 'item', title: '需求列表', key: 'list' },
  { type: 'description', title: '配置中心', key: 'config-group' },
  { type: 'item', title: '模块设置', key: 'module' },
  { type: 'item', title: '语言设置', key: 'language' },
]
const copySideMenu: SideMenuItem[] = [
  { type: 'item', title: '文案总览', key: 'overview' },
  { type: 'item', title: '文案需求', key: 'copy-demand' },
  { type: 'item', title: '集成发布', key: 'integration' },
  { type: 'item', title: '产品管理', key: 'product' },
]
const topSelected = ref(['demand'])
const sideSelected = ref(['create'])
const menuCollapsed = ref(false)
const currentRoot = computed(() => topSelected.value[0] || 'demand')
const activeSideMenu = computed(() => currentRoot.value === 'copy' ? copySideMenu : demandSideMenu)

watch(currentRoot, (root) => {
  sideSelected.value = [root === 'copy' ? 'overview' : 'create']
})
</script>
