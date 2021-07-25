const http = require('http');
const Koa = require('koa');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');
const app = new Koa();
const koaBody = require('koa-body');
const koaStatic = require('koa-static');


const public = path.join(__dirname, '/public');

app.use( koaBody({
  urlencoded: true,
  multipart: true
}));

app.use( koaStatic(public));

const arrImg = [];

app.use( async (ctx) => {

  let data = null;
  let file = null;
  if (ctx.method === 'GET') {
      data = ctx.request.query;
  } else if (ctx.method === 'POST') {
      data = ctx.request.body;
      file = ctx.request.files.file;
  }

  const { method, fileId } = data;

  ctx.response.set({
    'Access-Control-Allow-Origin': '*',
  })
  
  switch (method) {
    case 'addImage':
    //     const arr = controller.getAllTickets();
    const link = await new Promise((resolve, reject) => {
      const oldPath = file.path;
      const fileName = uuid.v4();
      const newPath = path.join(public, fileName);

      const callback = (error) => reject(error);

      const readStream = fs.createReadStream(oldPath);
      const writeStream = fs.createWriteStream(newPath);

      readStream.on('error', callback);
      writeStream.on('error', callback);

      writeStream.on('close', () => {
        fs.unlink(oldPath, callback);
        console.log('close');
        resolve(fileName);
      });

      readStream.pipe(writeStream);
    });

    arrImg.push(link);

    ctx.response.body = link;
    ctx.response.status = 200;
    return;

    case 'getAllImages' :
      ctx.response.body = arrImg;
      ctx.response.status = 200;
      return;  

    case 'deleteImage':
      fs.unlink(`${public}/${fileId}`, (err) => {
        if (err) {
          throw err;
        }
        console.log('deleted');
      });
      arrImg.splice(arrImg.findIndex( item => item === fileId ), 1);
      ctx.response.body = true;
      ctx.response.status = 200;
      return;

    default:
      ctx.response.status = 404;
      return;
  }
});

const port = process.env.PORT || 7070;

const server = http.createServer(app.callback()).listen(port);