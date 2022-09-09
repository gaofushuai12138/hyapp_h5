module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    // '@vue/prettier',
    // 'plugin:prettier/recommended', // 添加 prettier 插件, 注意需要放到 plugin 最后一个
  ],

  // rules 里面的内容根据团队风格统一配置
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/multi-word-component-names': 0,
    'vue/no-v-model-argument': 0,
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
  },
}
