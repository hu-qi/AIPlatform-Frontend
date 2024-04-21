// .cz-config.js
module.exports = {
    types: [
      { value: '🚀 add  ', name: 'add:  新的内容' },
      { value: '🐛 fix  ', name: 'fix:  修复一个Bug' },
      { value: '📝 docs  ', name: 'docs:  变更的只有文档' },
      { value: '💄 style  ', name: 'style:  空格, 分号等格式修复' },
      { value: '♻️ refactor  ', name: 'refactor:  代码重构，注意和特性、修复区分开' },
      { value: '⚡️ perf  ', name: 'perf:  提升性能' },
      { value: '✅ test  ', name: 'test:  添加一个测试' },
      { value: '🔨 ci  ', name: 'ci:  开发工具变动(构建、脚手架工具等)' },
      { value: '⏪ revert  ', name: 'revert:  代码回退' },
    ],
  
    // Specify the scopes for your particular project
    scopes: [],
    messages: {
      type: '选择一种你的提交类型: \n',
      cope: '选择一个 scope（可选）\n：',
      customScope: '请输入修改范围(可选): \n',
      subject: '短说明: \n',
      body: '长说明，使用 "|" 换行(可选)：\n',
      breaking: '非兼容性说明 (可选): \n',
      footer: '关联关闭的issue，例如：#31, #34(可选): \n',
      confirmCommit: '确定提交说明? \n',
    },
    // 跳过空的 scope
    skipEmptyScopes: true,
    skipQuestions: ['scopes', 'breaking', 'body', 'footer'],
    // 设置为 true，在 scope 选择的时候，会有 empty 和 custom 可以选择
    // 顾名思义，选择 empty 表示 scope 缺省，如果选择 custom，则可以自己输入信息
    allowCustomScopes: true,
    // 只有我们 type 选择了 feat 或者是 fix，才会询问我们 breaking message.
    allowBreakingChanges: ['feat', 'fix'],
  };