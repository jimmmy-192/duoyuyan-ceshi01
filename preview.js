(function () {
  if (location.port === '5173') return
  const languages = [['中文繁体','rednote'],['英语','rednote'],['日语','rednote'],['韩语','rednote'],['西班牙语','rednote'],['法语','rednote'],['俄语','rednote'],['备注','这是一条翻译说明']]
  const changes = [{ key:'capa_long_text_toollist_title1', title:'小红书', version:'notes.1.0.16', remark:'这是一条翻译说明' }]
  const $ = (id) => document.getElementById(id)
  const notify = (message) => { const toast=$('previewToast'); toast.textContent=message; toast.classList.remove('hidden'); setTimeout(()=>toast.classList.add('hidden'),1800) }
  const open = (id) => $(id).classList.remove('hidden')
  const close = (id) => $(id).classList.add('hidden')
  const translations = (remark) => languages.map(([name,copy])=>`<div class="preview-translation"><span class="preview-lang">${name}</span><span>${name==='备注'?remark:copy}</span></div>`).join('')
  const render = () => {
    $('previewCount').textContent=String(changes.length)
    $('previewRows').innerHTML=changes.map((item,index)=>`<article class="preview-row"><div class="preview-cell"><div class="preview-copy-title"><span class="preview-tag">下线</span><strong>${item.title}</strong></div><code>${item.key}</code></div><div class="preview-cell preview-translations">${translations(item.remark)}</div><div class="preview-cell"><strong>${item.version||'所有版本'}</strong></div><div class="preview-cell"><button data-remove="${index}">移除</button></div></article>`).join('')
  }
  $('previewOfflineButton').onclick=()=>open('previewOfflineModal')
  $('previewBatchButton').onclick=()=>open('previewBatchModal')
  $('previewModuleButton').onclick=$('previewModuleButton2').onclick=()=>open('previewModuleModal')
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
