const http = require('http');
const Koa = require('koa');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');

const public = path.join(__dirname, '/public');

const app = new Koa();
const koaBody = require('koa-body');

app.use( koaBody({
  urlencoded: true,
  multipart: true
}));

const arrImg = [];

const port = process.env.PORT || 7070;

app.use( ctx => {

  let data = null;
  if (ctx.method === 'GET') {
      data = ctx.request.query;
  } else if (ctx.method === 'POST') {
      data = ctx.request.body;
  }

  const { method, id } = data;

  console.log('data: ', data);
  // console.log('data: ', data)

  ctx.response.set({
    'Access-Control-Allow-Origin': '*',
  })

  switch (method) {
    // case 'addImage':
    //     const arr = controller.getAllTickets();

    //     ctx.response.status = 200;
    //     return;

    // case 'deleteImage':
    //   const arr = controller.getAllTickets();

    //   ctx.response.status = 200;
    //   return;

    default:
        ctx.response.status = 404;
        return;
  }
});

const server = http.createServer(app.callback()).listen(port);