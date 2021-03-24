#!/usr/bin/env node

const { program } = require('commander')
const pkg = require('./package.json')
const templates = {
  'vite-react-app': {
    url: 'https://github.com/joriewong/vite-react-app',
    downloadUrl: 'https://github.com/joriewong/vite-react-app#main',
    description: 'Vite 2.0 + React + Ant Design 开发环境',
  },
}

program
  .version(pkg.version)
  .option('-i, --init', '初始化项目')
  .option('-V, --version', '查看版本信息')
  .option('-l, --list', '查看模板列表')

program.parse(process.argv)

if (program.opts() && program.opts().list) {
  Object.entries(templates).forEach(([name, tpl]) => {
    console.log(`${name} : ${tpl.description}`)
  })
}
