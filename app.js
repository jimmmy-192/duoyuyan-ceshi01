const languages = [
  ["中文繁体", "rednote"],
  ["英语", "rednote"],
  ["日语", "rednote"],
  ["韩语", "rednote"],
  ["西班牙语", "rednote"],
  ["法语", "rednote"],
  ["俄语", "rednote"],
  ["备注", "这是一条翻译说明"],
];

const changes = [
  {
    key: "capa_long_text_toollist_title1",
    title: "小红书",
    status: "下线",
    module: "模块1",
    version: "notes.1.0.16",
    remark: "这是一条翻译说明",
  },
];

const $ = (selector) => document.querySelector(selector);

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1800);
}

function openModal(id) {
  document.getElementById(id).classList.remove("hidden");
}

function closeModal(id) {
  document.getElementById(id).classList.add("hidden");
}

function renderChangeList() {
  const list = $("#changeList");
  if (!changes.length) {
    list.innerHTML = '<div class="empty-state">暂无文案变更，请先添加下线 KEY 或批量上传。</div>';
    return;
  }

  list.innerHTML = changes
    .map(
      (item) => `
        <article class="change-row">
          <div class="change-main">
            <div><span class="tag orange">${item.status}</span> ${item.title}</div>
            <div class="tag white">${item.key}</div>
            <span class="ui-thumb"></span>
          </div>
          <div class="change-translations">
            <div class="translations-grid">
              ${languages
                .map(([lang, copy]) => `<div class="lang"><span class="tag">${lang}</span></div><div class="copy">${copy}</div>`)
                .join("")}
            </div>
          </div>
          <div class="change-version">${item.version || "所有版本"}</div>
        </article>
      `,
    )
    .join("");
}

function renderPreviewTable() {
  const rows = Array.from({ length: 4 }, (_, index) => ({
    key: index === 0 ? "capa_long_text_toollist_title1" : `capa_long_text_toollist_title${index + 1}`,
    title: "小红书",
    version: "notes.1.0.16",
  }));

  $("#previewTable").innerHTML = `
    <div class="table-head">
      <div>文案 ↕</div>
      <div></div>
      <div>下线版本</div>
    </div>
    ${rows
      .map(
        (row) => `
          <article class="preview-row">
            <div class="preview-key">
              <div><span class="tag orange">下线</span> ${row.title}</div>
              <div class="tag white">${row.key}</div>
              <span class="ui-thumb"></span>
              <small>图片更新于 2026/01/12</small>
            </div>
            <div class="preview-copy">
              <div class="preview-lang-row">
                ${languages
                  .map(([lang, copy]) => `<div><span class="tag">${lang}</span></div><div>${copy}</div>`)
                  .join("")}
              </div>
            </div>
            <div class="preview-version">${row.version}<br />${row.version}</div>
          </article>
        `,
      )
      .join("")}
  `;
}

document.addEventListener("click", (event) => {
  const closeTarget = event.target.dataset.close;
  if (closeTarget) closeModal(closeTarget);
});

$("#openOffline").addEventListener("click", () => openModal("offlineModal"));
$("#openBatch").addEventListener("click", () => openModal("batchModal"));
$("#openModule").addEventListener("click", () => openModal("moduleModal"));

$("#keySelect").addEventListener("change", (event) => {
  const selected = event.target.value;
  $("#zhText").value = selected === "greennote" ? "小绿书" : "小红书";
});

$("#addChange").addEventListener("click", () => {
  changes.unshift({
    key: $("#keySelect").value,
    title: $("#zhText").value,
    status: "下线",
    module: "模块1",
    version: $("#versionSelect").value,
    remark: $("#remark").value,
  });
  renderChangeList();
  closeModal("offlineModal");
  showToast("已添加变更，字段已按已有 KEY 预填");
});

$("#confirmBatch").addEventListener("click", () => {
  changes.push({
    key: "batch_import_key",
    title: "小红书",
    status: "下线",
    module: "模块1",
    version: "notes.1.0.16",
    remark: "批量上传导入",
  });
  renderChangeList();
  closeModal("batchModal");
  showToast("批量上传内容已确认");
});

$("#saveModule").addEventListener("click", () => {
  closeModal("moduleModal");
  showToast("模块设置已保存");
});

$("#submitDemand").addEventListener("click", () => {
  showToast("已提交翻译需求，等待确认文案变更");
});

$("#uploadMock").addEventListener("click", () => {
  showToast("已选择 UI 图示例");
});

renderChangeList();
renderPreviewTable();
