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
        resolve({
          city: res.data.result.city,
          temperature: res.data.result.realtime.temperature,
          info: res.data.result.realtime.info
        })
      })
      .catch((err) => reject(err))
  })
}
function getLove() {
  return new Promise((resolve, reject) => {
    axios
      .get(
        "https://api.tianapi.com/saylove/index?key=1aa102707dc4608672ae60d074e67877"
      )
      .then((res) => {
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
        resolve(res.data.newslist[0].note);
      })
      .catch((err) => reject(err))
  })
}
function getHoliday() {
  return new Promise((resolve, reject) => {
    axios
      .get(
        "https://api.tianapi.com/jiejiari/index?key=1aa102707dc4608672ae60d074e67877"
      )
      .then((res) => {
        resolve({
          info: res.data.newslist[0].info,
          name: res.data.newslist[0].name,
          cnweekday: res.data.newslist[0].cnweekday,
          lunarmonth: res.data.newslist[0].lunarmonth,
          lunarday: res.data.newslist[0].lunarday
        });
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
  let holiday = await getHoliday()
  const listConfig = {
    data: {
      nowDate: {
        value: `????????? ${moment(new Date()).format('YYYY/MM/DD')} ${holiday.cnweekday}`,
        color: '#57E6E2',
      },
      lunarDate: {
        value: `??????${holiday.lunarmonth + holiday.lunarday} ${holiday.name ? holiday.name : holiday.info}`,
        color: '#993366',
      },
      saysDate: {
        value: '???????????????????????????????????????',
        color: '#FF6347',
      },
      city: {
        value: `${tianqiInfo.city}`,
        color: '#9CA2A0',
      },
      temperature: {
        value: `${tianqiInfo.temperature}???`,
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
        console.error('????????????', res.data)
        return
      }
      console.log('????????????-?????????????????????????????????')
    })
    .catch((err) => console.error('????????????', err))
}

start()
