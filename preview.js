(function () {
  if (location.protocol !== 'file:' && ['127.0.0.1', 'localhost'].includes(location.hostname)) return
  const languages = [['中文繁体','rednote'],['英语','rednote'],['日语','rednote'],['韩语','rednote'],['西班牙语','rednote'],['法语','rednote'],['俄语','rednote'],['备注','这是一条翻译说明']]
  const changes = [{ key:'capa_long_text_toollist_title1', title:'小红书', version:'notes.1.0.16', remark:'这是一条翻译说明' }]
  const $ = (id) => document.getElementById(id)
  const notify = (message) => { const toast=$('previewToast'); toast.textContent=message; toast.classList.remove('hidden'); setTimeout(()=>toast.classList.add('hidden'),1800) }
  const open = (id) => $(id).classList.remove('hidden')
  const close = (id) => $(id).classList.add('hidden')
  const translations = (remark) => languages.map(([name,copy])=>`<div class="preview-translation"><span class="preview-lang">${name}</span><span>${name==='备注'?remark:copy}</span></div>`).join('')
  const longCopy = '这段文案很长，这段文案很长，这段文案很长，这段文案很长，这段文案很长，我文案很长，这段文案很长，这段文案很长，这段文案很长。'
  const copyRows = [
    { title:'小红书', key:'capa_long_text_toollist_title1', business:'很长的一个名字很长很长', module:'内容消费/笔详', translations:languages },
    { title:'图文笔记', key:'capa_long_text_toollist_title1', business:'笔记', module:'内容消费/笔详', translations:[['中文繁体',longCopy], ...languages.slice(1)] },
    { title:'视频笔记', key:'capa_long_text_toollist_title1', business:'视频', module:'内容消费/笔详', translations:languages },
    { title:'编辑', key:'capa_long_text_toollist_title1', business:'个人页', module:'内容消费/笔详', translations:languages.slice(0,5) }
  ]
  const render = () => {
    $('previewCount').textContent=String(changes.length)
    $('previewRows').innerHTML=changes.map((item,index)=>`<article class="preview-row"><div class="preview-cell"><div class="preview-copy-title"><span class="preview-tag">下线</span><strong>${item.title}</strong></div><code>${item.key}</code></div><div class="preview-cell preview-translations">${translations(item.remark)}</div><div class="preview-cell"><strong>${item.version||'所有版本'}</strong></div><div class="preview-cell"><button data-remove="${index}">移除</button></div></article>`).join('')
  }
  const renderCopySpace = () => {
    $('previewDemandNav').classList.remove('active')
    $('previewCopyNav').classList.add('active')
    $('previewAside').innerHTML = '<button class="active">文案总览</button><button>文案需求</button><button>集成发布</button><button>产品管理</button>'
    $('previewMain').innerHTML = `
      <section class="preview-copy-board">
        <header><h1>所有文案</h1></header>
        <div class="preview-copy-filters">
          <div class="preview-copy-search"><button>按文案</button><input placeholder="请输入"></div>
          <button>业务&nbsp;&nbsp;请选择</button>
          <button>项目模块&nbsp;&nbsp;请选择</button>
          <button class="preview-column-button">自定义列</button>
        </div>
        <section class="preview-copy-table">
          <div class="preview-copy-head"><span>文案</span><span>业务</span><span>项目模块</span><span>翻译内容</span></div>
          ${copyRows.map((item)=>`
            <article class="preview-copy-row">
              <div><strong>${item.title}</strong><code>${item.key}</code></div>
              <div class="preview-copy-link">${item.business}</div>
              <div class="preview-copy-link">${item.module}</div>
              <div class="preview-copy-translations">
                ${item.translations.map(([name,copy])=>`<p><span>${name}</span><b>${copy}</b></p>`).join('')}
              </div>
            </article>
          `).join('')}
        </section>
      </section>`
    document.querySelector('.preview-footer').classList.add('hidden')
  }
  $('previewOfflineButton').onclick=()=>open('previewOfflineModal')
  $('previewBatchButton').onclick=()=>open('previewBatchModal')
  $('previewModuleButton').onclick=$('previewModuleButton2').onclick=()=>open('previewModuleModal')
  $('previewCopyNav').onclick=renderCopySpace
  document.addEventListener('click',(event)=>{ const target=event.target; if(target.dataset.close) close(target.dataset.close); if(target.dataset.remove!==undefined){changes.splice(Number(target.dataset.remove),1);render();notify('已移除变更')}})
  $('previewKey').onchange=()=>{ const green=$('previewKey').value==='greennote'; $('previewTitle').value=green?'小绿书':'小红书'; $('previewRemark').value=green?'标题文案，按现有翻译处理':'这是一条翻译说明'; $('previewLimit').value=green?'12':'16' }
  $('previewAddOffline').onclick=()=>{changes.unshift({key:$('previewKey').value,title:$('previewTitle').value,version:$('previewVersion').value,remark:$('previewRemark').value});render();close('previewOfflineModal');notify('已添加变更')}
  $('previewBatchList').innerHTML=Array.from({length:4},(_,i)=>`<article class="preview-batch-item"><div><div class="preview-copy-title"><span class="preview-tag">下线</span><strong>小红书</strong></div><code>capa_long_text_toollist_title${i+1}</code></div><div>${translations('这是一条翻译说明')}</div><div><strong>notes.1.0.16</strong></div></article>`).join('')
  $('previewConfirmBatch').onclick=()=>{changes.push({key:'batch_import_key',title:'小红书',version:'notes.1.0.16',remark:'批量上传导入'});render();close('previewBatchModal');notify('批量上传内容已确认')}
  $('previewSaveModule').onclick=()=>{close('previewModuleModal');notify('模块设置已保存')}
  $('previewDraftButton').onclick=()=>notify('草稿已保存')
  $('previewSubmitButton').onclick=()=>notify('已提交翻译需求')
  render()
})()
