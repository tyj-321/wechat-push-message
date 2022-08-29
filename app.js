const { params } = require('./src/config/config')
const getToken = require('./src/getToken/index')
const sendMessage = require('./src/sendMessage/index')
var axios = require('axios')
const moment = require('moment')
function getTianqi() {
  return new Promise((resolve, reject) => {
    axios
      .get(
        'https://apis.juhe.cn/simpleWeather/query?city=%E5%BE%B7%E9%98%B3&key=69eb436a80a9a1fc15cbe4ac3c84f0c4'
      )
      .then((res) => {
        console.log(res)
        resolve({
          city: res.data.result.city,
          temperature: res.data.result.realtime.temperature,
          info: res.data.result.realtime.info
        })
          .catch((err) => reject(err))
      })
  })
}
function getLove() {
  return new Promise((resolve, reject) => {
    axios
      .get(
        "https://api.tianapi.com/saylove/index?key=1aa102707dc4608672ae60d074e67877"
      )
      .then((res) => {
        console.log(res.data.newslist[0].content)
        resolve(res.data.newslist[0].content);
      })
      .catch((err) => reject(err))
  })
}
function getNote() {
  return new Promise((resolve, reject) => {
    axios
      .get(
        "https://api.tianapi.com/everyday/index?key=1aa102707dc4608672ae60d074e67877"
      )
      .then((res) => {
        console.log(res.data.newslist[0].note)
        resolve(res.data.newslist[0].note);
      })
      .catch((err) => reject(err))
  })
}




async function start() {
  let access_token

  try {
    access_token = await getToken(params)
  } catch (error) {
    console.log(error)
    process.exit(0)
  }
  let tianqiInfo = await getTianqi()
  let text = await getLove()
  let note = await getNote()
  const listConfig = {
    data: {
      nowDate: {
        value: `今天是 ${moment(new Date()).format('YYYY/MM/DD')}`,
        color: '#57E6E2',
      },
      city: {
        value: `${tianqiInfo.city}`,
        color: '#9CA2A0',
      },
      temperature: {
        value: `${tianqiInfo.temperature}℃`,
        color: '#ff9999',
      },
      info: {
        value: `${tianqiInfo.info}`,
        color: '#0000EE',
      },
      loveDate: {
        value: `${moment(new Date()).diff(moment('2022/2/3'), 'days')}`,
        color: '#FF34B3',
      },
      txt: {
        value: `${text}`,
        color: '#3C4244',
      },
      note: {
        value: `${note}`,
        color: '#EEB422',
      }
    },
  }

  sendMessage({
    ...params,
    access_token,
    ...listConfig,
  })
    .then((res) => {
      if (res.data && res.data.errcode) {
        console.error('发送失败', res.data)
        return
      }
      console.log('发送成功-请在微信上查看对应消息')
    })
    .catch((err) => console.error('发送失败', err))
}

start()
