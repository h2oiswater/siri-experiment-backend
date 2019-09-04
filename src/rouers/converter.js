const Router = require('koa-router')
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const AipSpeech = require("baidu-aip-sdk").speech;
// 百度语音应用后台中的`API Key`和`Secret Key`
const client = new AipSpeech(17166438, 'zUrZfoUQ5f8ZbLjc5H0cNQXH', 'IL1Cuw3oUPWRtHPsGw2ZG0iAZBlUcxzi');

const converterRouter = new Router({
  prefix: '/converter'
})

converterRouter.post('/m4a', async (ctx, next) => {
  let voiceBase64 = Buffer.from('');
  let command = ffmpeg(ctx.request.files.files.path)
    .noVideo()
    .inputFormat('m4a')
    .audioCodec('pcm_s16le')
    .audioBitrate(16)
    .audioFrequency(16000)
    .audioChannels(1)
    .format('s16le')
    .on('error', function (err) {
      console.log('An error occurred: ' + err.message);
    })
    .on('end', function () {
      console.log('success');
    });
  let ffstream = command.pipe();

  const audio2TextApi = new Promise((resolve, reject) => {
    ffstream.on('data', function (chunk) {
      voiceBase64 = Buffer.concat([voiceBase64, Buffer.from(chunk)]);
      // console.log('ffmpeg just wrote ' + chunk.length + ' bytes');
    });
    ffstream.on('end', function () {
      console.log('data ' + voiceBase64.length + ' bytes');
      client.recognize(voiceBase64, 'pcm', 16000).then(function (result) {
        console.log('Recognize success: ' + JSON.stringify(result));
        console.log(result.result.join(''));
        resolve(result.result.join(''))
      }, function (err) {
        console.log('Recognize error: ' + err.message);
        reject(err)
      });
    });
  })

  try {
    const result = await audio2TextApi
    console.log('convert success');
    ctx.body = {
      data: result
    };
  } catch (e) {
    console.log('convert error');
    console.log(e.message);
    ctx.status = 400
    ctx.body = {
      message: e.message
    }
  }
})

converterRouter.post('/async', (ctx, next) => {

})

module.exports = converterRouter