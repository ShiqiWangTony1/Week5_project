const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const json = require('koa-json');
const send = require('koa-send');
const stream = require('koa-stream');

const app = new Koa();
const router = new Router();

app.use(bodyParser());
app.use(json());

const users = [
    { username: 'user1', password: 'pass1' },
    { username: 'user2', password: 'pass2' }
];

router.post('/login', async (ctx) => {
    const { username, password } = ctx.request.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        ctx.body = { status: 0, msg: 'Success' };
    } else {
        ctx.body = { status: 1, msg: 'Username or Password error.' };
    }
});

router.post('/register', async (ctx) => {
    const { username, password } = ctx.request.body;
    const user = users.find(u => u.username === username);
    if (user) {
        ctx.body = { status: 1, msg: 'User Already Exist.' };
    } else {
        users.push({ username, password });
        ctx.body = { status: 0, msg: 'Success' };
    }
});

router.get('/stream/:track_id', async (ctx) => {
    const trackId = ctx.params.track_id;
    ctx.type = 'audio/mpeg';
    ctx.body = stream.file(`${__dirname}/tracks/${trackId}.mp3`);
});

app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
