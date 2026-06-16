<template>
  <main class="copy-space-page">
    <section class="copy-board">
      <header class="copy-board-header">
        <h1>所有文案</h1>
      </header>

      <div class="copy-filter-row">
        <div class="copy-search-combo">
          <button type="button" class="filter-select">按文案</button>
          <Input v-model="filters.keyword" placeholder="请输入" />
        </div>
        <button type="button" class="filter-select wide">业务&nbsp;&nbsp;请选择</button>
        <button type="button" class="filter-select wide">项目模块&nbsp;&nbsp;请选择</button>
        <Button type="text" class="column-button">自定义列</Button>
      </div>

      <section class="copy-table" aria-label="所有文案">
        <div class="copy-table-head">
          <div>文案</div>
          <div>业务</div>
          <div>项目模块</div>
          <div>翻译内容</div>
        </div>

        <article v-for="item in copyRows" :key="item.key" class="copy-table-row">
          <div class="copy-main-cell">
            <strong>{{ item.title }}</strong>
            <span class="key-pill">{{ item.key }}</span>
          </div>
          <div class="copy-link-cell">{{ item.business }}</div>
          <div class="copy-link-cell">{{ item.module }}</div>
          <div class="copy-translations">
            <div v-for="translation in item.translations" :key="translation.language" class="copy-translation-row">
              <span>{{ translation.language }}</span>
              <p>{{ translation.copy }}</p>
            </div>
          </div>
        </article>
      </section>
    </section>
  </main>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { Button, Input } from '@xhs/delight'

type Translation = { language: string; copy: string }
type CopyRow = {
  title: string
  key: string
  business: string
  module: string
  translations: Translation[]
}

const filters = reactive({ keyword: '' })

const languageSet = [
  ['中文繁体', 'rednote'],
  ['英语', 'rednote'],
  ['日语', 'rednote'],
  ['韩语', 'rednote'],
  ['西班牙语', 'rednote'],
  ['法语', 'rednote'],
  ['俄语', 'rednote'],
  ['备注', '这是一条翻译说明'],
]
const longCopy = '这段文案很长，这段文案很长，这段文案很长，这段文案很长，这段文案很长，我文案很长，这段文案很长，这段文案很长，这段文案很长，这段文案很长，这段文案很长，这段文案很长，这段文案很长。'
const copyRows: CopyRow[] = [
  {
    title: '小红书',
    key: 'capa_long_text_toollist_title1',
    business: '很长的一个名字很长很长',
    module: '内容消费/笔详',
    translations: languageSet.map(([language, copy]) => ({ language, copy })),
  },
  {
    title: '图文笔记',
    key: 'capa_long_text_toollist_title1',
    business: '笔记',
    module: '内容消费/笔详',
    translations: [
      { language: '中文繁体', copy: longCopy },
      ...languageSet.slice(1).map(([language, copy]) => ({ language, copy })),
    ],
  },
  {
    title: '视频笔记',
    key: 'capa_long_text_toollist_title1',
    business: '视频',
    module: '内容消费/笔详',
    translations: languageSet.map(([language, copy]) => ({ language, copy })),
  },
  {
    title: '编辑',
    key: 'capa_long_text_toollist_title1',
    business: '个人页',
    module: '内容消费/笔详',
    translations: languageSet.slice(0, 5).map(([language, copy]) => ({ language, copy })),
  },
]
</script>
