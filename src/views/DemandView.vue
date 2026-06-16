<template>
  <main class="page">
    <header class="page-header">
      <div>
        <div class="breadcrumb">需求管理 / 新建需求 / 基本信息</div>
        <h1>新需求</h1>
        <p>添加需要下线的 KEY，确认变更后提交翻译需求。</p>
      </div>
      <div class="action-row">
        <Button type="light" @click="batchVisible = true">批量上传</Button>
        <Button type="primary" @click="offlineVisible = true">添加下线 KEY</Button>
      </div>
    </header>

    <section class="panel">
      <h2>基本信息</h2>
      <Form :model="demand" label-position="Top" :hide-required-mark="true">
        <div class="form-grid">
          <FormItem label="需求名称" name="name">
            <Input v-model="demand.name" />
          </FormItem>
          <FormItem label="业务线" name="business">
            <Select v-model="demand.business" :options="businessOptions" />
          </FormItem>
          <FormItem label="目标版本" name="version">
            <Select v-model="demand.version" :options="versionOptions" />
          </FormItem>
          <FormItem label="负责人" name="owner">
            <Input v-model="demand.owner" />
          </FormItem>
        </div>
      </Form>
    </section>

    <section class="panel change-panel">
      <div class="panel-header">
        <div>
          <h2>文案变更</h2>
          <p>共 {{ changes.length }} 条变更，提交后进入翻译确认流程。</p>
        </div>
        <Button type="light" @click="moduleVisible = true">编辑模块设置</Button>
      </div>

      <div class="change-table">
        <div class="table-head">
          <span>文案</span>
          <span>翻译内容</span>
          <span>下线版本</span>
          <span>操作</span>
        </div>
        <article v-for="(item, index) in changes" :key="item.id" class="change-row">
          <div class="copy-cell">
            <div class="copy-title"><span class="status-tag">下线</span><strong>{{ item.title }}</strong></div>
            <code>{{ item.key }}</code>
            <div class="ui-preview"><span></span><small>UI 图</small></div>
          </div>
          <div class="translation-cell">
            <div v-for="entry in languages" :key="entry.name" class="translation-row">
              <span class="language-tag">{{ entry.name }}</span>
              <span>{{ entry.name === '备注' ? item.remark : entry.copy }}</span>
            </div>
          </div>
          <div class="version-cell">{{ item.version || '所有版本' }}</div>
          <div class="operation-cell"><Button type="text" @click="removeChange(index)">移除</Button></div>
        </article>
        <div v-if="!changes.length" class="empty-state">暂无文案变更，请添加下线 KEY 或批量上传。</div>
      </div>
    </section>

    <footer class="page-footer">
      <Button type="light" @click="notify('草稿已保存')">保存草稿</Button>
      <Button type="primary" @click="notify('已提交翻译需求，等待确认文案变更')">提交翻译需求</Button>
    </footer>

    <div v-if="offlineVisible" class="modal-mask" @click.self="offlineVisible = false">
      <section class="modal offline-modal" role="dialog" aria-modal="true">
        <header class="modal-header"><h2>下线 KEY</h2><button class="close-button" @click="offlineVisible = false">×</button></header>
        <div class="modal-body">
          <Form :model="offline" label-position="Top" :hide-required-mark="true">
            <FormItem label="KEY *" name="key">
              <Select v-model="offline.key" :options="keyOptions" />
              <p class="field-help">选择已创建的 KEY，其他字段将自动回填且不可编辑。</p>
            </FormItem>
            <FormItem label="下线版本" name="version">
              <Select v-model="offline.version" :options="offlineVersionOptions" placeholder="请选择下线版本号" />
              <p class="field-help">若不填写，将会在所有版本下线。</p>
            </FormItem>
            <FormItem label="中文简体" name="title">
              <Input v-model="offline.title" readonly />
              <p class="field-help">中文文案书写规范可参考产品设计 C 端文案规范。</p>
            </FormItem>
            <FormItem label="备注（选填）" name="remark">
              <Input v-model="offline.remark" readonly />
              <p class="field-help">备注文案所在的 UI 元素位置或翻译要求。</p>
            </FormItem>
            <FormItem label="字符数限制（选填）" name="limit"><Input v-model="offline.limit" readonly /></FormItem>
            <FormItem label="UI 图（选填）">
              <div class="upload-preview"><div class="phone-shot"></div><span>支持 jpg/jpeg/png，大小不超过 20M</span></div>
            </FormItem>
          </Form>
        </div>
        <footer class="modal-footer"><Button type="text" @click="offlineVisible = false">取消</Button><Button type="primary" @click="addOffline">添加变更</Button></footer>
      </section>
    </div>

    <div v-if="batchVisible" class="modal-mask" @click.self="batchVisible = false">
      <section class="modal batch-modal" role="dialog" aria-modal="true">
        <header class="modal-header"><h2>批量上传</h2><button class="close-button" @click="batchVisible = false">×</button></header>
        <div class="modal-body batch-body">
          <div class="file-card"><strong>X</strong><div><b>文件名.xhs</b><span>316KB</span><small>上传成功</small></div><button>×</button></div>
          <div class="preview-table">
            <div class="preview-head"><span>文案</span><span>翻译内容</span><span>下线版本</span></div>
            <article v-for="row in previewRows" :key="row.key" class="preview-row">
              <div class="copy-cell"><div class="copy-title"><span class="status-tag">下线</span><strong>小红书</strong></div><code>{{ row.key }}</code><div class="ui-preview"><span></span><small>图片更新于 2026/01/12</small></div></div>
              <div class="translation-cell"><div v-for="entry in languages" :key="entry.name" class="translation-row"><span class="language-tag">{{ entry.name }}</span><span>{{ entry.copy }}</span></div></div>
              <div class="version-cell">notes.1.0.16</div>
            </article>
          </div>
        </div>
        <footer class="modal-footer split-footer"><span>共 <strong>1000</strong> 条</span><div class="action-row"><Button type="text" @click="batchVisible = false">取消</Button><Button type="primary" @click="confirmBatch">确定</Button></div></footer>
      </section>
    </div>

    <div v-if="moduleVisible" class="modal-mask" @click.self="moduleVisible = false">
      <section class="modal setting-modal" role="dialog" aria-modal="true">
        <header class="modal-header"><h2>编辑模块设置</h2><button class="close-button" @click="moduleVisible = false">×</button></header>
        <div class="modal-body">
          <Form :model="moduleSetting" label-position="Top" :hide-required-mark="true">
            <FormItem label="模块名称"><Input v-model="moduleSetting.name" /></FormItem>
            <FormItem label="默认下线版本"><Select v-model="moduleSetting.version" :options="versionOptions" /></FormItem>
          </Form>
        </div>
        <footer class="modal-footer"><Button type="text" @click="moduleVisible = false">取消</Button><Button type="primary" @click="saveModule">保存</Button></footer>
      </section>
    </div>

  </main>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { Button, Form2 as Form, FormItem2 as FormItem, Input, Select, toast2 as toast } from '@xhs/delight'

type ChangeItem = { id: number; key: string; title: string; version: string; remark: string }
const businessOptions = [{ name: '小红书', value: '小红书' }, { name: 'rednote', value: 'rednote' }]
const versionOptions = [{ name: 'notes.1.0.16', value: 'notes.1.0.16' }, { name: 'notes.1.0.17', value: 'notes.1.0.17' }]
const offlineVersionOptions = [{ name: '所有版本', value: '' }, ...versionOptions]
const keyOptions = [{ name: 'greennote', value: 'greennote' }, { name: 'capa_long_text_toollist_title1', value: 'capa_long_text_toollist_title1' }]
const languages = [{ name: '中文繁体', copy: 'rednote' }, { name: '英语', copy: 'rednote' }, { name: '日语', copy: 'rednote' }, { name: '韩语', copy: 'rednote' }, { name: '西班牙语', copy: 'rednote' }, { name: '法语', copy: 'rednote' }, { name: '俄语', copy: 'rednote' }, { name: '备注', copy: '这是一条翻译说明' }]
const previewRows = Array.from({ length: 4 }, (_, index) => ({ key: `capa_long_text_toollist_title${index + 1}` }))
const demand = reactive({ name: '小红书文案下线需求', business: '小红书', version: 'notes.1.0.16', owner: 'Jimmy' })
const offline = reactive({ key: 'greennote', title: '小绿书', version: '', remark: '标题文案，按现有翻译处理', limit: '12' })
const moduleSetting = reactive({ name: '模块1', version: 'notes.1.0.16' })
const changes = ref<ChangeItem[]>([{ id: 1, key: 'capa_long_text_toollist_title1', title: '小红书', version: 'notes.1.0.16', remark: '这是一条翻译说明' }])
const offlineVisible = ref(false)
const batchVisible = ref(false)
const moduleVisible = ref(false)

function notify(message: string) {
  toast.success({ content: message, duration: 2200 })
}
function prefillOffline() {
  const green = offline.key === 'greennote'
  offline.title = green ? '小绿书' : '小红书'
  offline.remark = green ? '标题文案，按现有翻译处理' : '这是一条翻译说明'
  offline.limit = green ? '12' : '16'
}
function addOffline() {
  changes.value.unshift({ id: Date.now(), key: offline.key, title: offline.title, version: offline.version, remark: offline.remark })
  offlineVisible.value = false
  notify('已添加变更，字段已按已有 KEY 预填')
}
function confirmBatch() {
  changes.value.push({ id: Date.now(), key: 'batch_import_key', title: '小红书', version: 'notes.1.0.16', remark: '批量上传导入' })
  batchVisible.value = false
  notify('批量上传内容已确认')
}
function removeChange(index: number) {
  changes.value.splice(index, 1)
  notify('已移除变更')
}
function saveModule() {
  moduleVisible.value = false
  notify('模块设置已保存')
}

watch(() => offline.key, prefillOffline)
</script>
