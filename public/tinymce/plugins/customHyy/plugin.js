;(function () {
  tinymce.PluginManager.add('customHyy', function (editor) {
    editor.ui.registry.addButton('custom_button', {
      text: 'custom_button',
      // icon: '',
      tooltip: '自定义',
      onAction: function () {
        // 上传文件
        editor.windowManager.openUrl({
          title: '上传附件',
          url: 'http://127.0.0.1:8029/article/attachments/', // 上传文件的后端接口地址
          width: 600,
          height: 400,
          buttons: [
            {
              type: 'cancel',
              text: '取消'
            }
          ],
          onMessage: function (api, message) {
            // 处理上传成功后的逻辑
            if (message.type === 'file-uploaded') {
              const { fileUrl, fileName } = message.data
              // 在编辑器中插入链接到上传的文件
              editor.insertContent(`<a href="${fileUrl}" target="_blank">${fileName}</a>`)
              api.close()
            }
          }
        })
      }
    })
  })
})()
