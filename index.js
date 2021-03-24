#!/usr/bin/env node

const { program } = require('commander')
const pkg = require('./package.json')
const inquirer = require('inquirer')
const chalk = require('chalk')
const fs = require('fs')
const ora = require('ora')
const download = require('download-git-repo')
const path = require('path')

const templates = {
  'vite-react-app': {
    url: 'https://github.com/joriewong/vite-react-app',
    gitUrl: 'https://github.com:joriewong/vite-react-app#main',
    description: 'Vite 2.0 + React + Ant Design 开发环境',
  },
}

program
  .version(pkg.version)
  .option('-i, --init', '初始化项目')
  .option('-V, --version', '查看版本信息')
  .option('-l, --list', '查看模板列表')

program.parse(process.argv)

inquirer
  .prompt([
    {
      type: 'input',
      name: 'name',
      message: '请输入项目名称',
    },
    {
      type: 'input',
      name: 'description',
      message: '请输入项目简介',
    },
    {
      type: 'input',
      name: 'author',
      message: '请输入作者名称',
    },
    {
      type: 'list',
      name: 'template',
      message: '选择其中一作为项目模板',
      choices: [
        'vite-react-app (Vite 2.0 + React + Ant Design 开发环境)',
        'vite-react-app (Vite 2.0 + React + Ant Design 开发环境)',
      ],
    },
  ])
  .then((answer) => {
    const key = answer.template.split(' ')[0]
    console.log('选择', key)
    const url = templates[key].gitUrl
    initTemplate(answer, url);
  })

async function initTemplate(input, gitUrl) {
  console.log(
    chalk.bold.cyan("w-cli: ") + "will creating a new project starter"
  );
  const { name = '' } = input;

  try {
    await isNameExisted(name);
    await cloneTemplate(gitUrl, name);
    await renderTemplate(input);

    console.log(chalk.green("template download completed"));
    console.log(
      chalk.bold.cyan("w-cli: ") + "a new project starter is created"
    );
  } catch (error) {
    console.log(chalk.red(error));
  }
}

function isNameExisted(name) {
  return new Promise((resolve, reject) => {
    fs.readdir(process.cwd(), (err, data) => {
      if (err) {
        return reject(err)
      }
      if (data.includes(name)) {
        return reject(new Error(`${name} already exists !`))
      }
    })
    resolve()
  })
}

function cloneTemplate(url, name) {
  const spin = ora('clone template ......').start()

  return new Promise((resolve, reject) => {
    download(url, path.resolve(process.cwd(), name), { clone: true }, (err) => {
      if (err) {
        spin.fail()
        return reject(err)
      }
      spin.succeed()
      resolve()
    })
  })
}

function renderTemplate(input) {
  const { name = '', description = '', author = '' } = input
  const pkgPath = path.resolve(process.cwd(), name, 'package.json')
  const encoding = 'utf8'

  return new Promise((resolve, reject) => {
    fs.readFile(pkgPath, encoding, (err, data) => {
      if (err) {
        return reject(err)
      }
      let pkgJson = JSON.parse(data)
      pkgJson.name = name
      pkgJson.description = description
      pkgJson.author = author
      fs.writeFile(
        pkgPath,
        JSON.stringify(pkgJson, null, 2),
        encoding,
        (err, data) => {
          if (err) {
            return reject(err)
          }
          resolve()
        }
      )
    })
  })
}

// --list
if (program.opts() && program.opts().list) {
  Object.entries(templates).forEach(([key, tpl]) => {
    console.log(`${key} : ${tpl.description}`)
  })
}
