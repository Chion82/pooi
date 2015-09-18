import { Router } from 'express';
let router = Router();

router.get('/', (req, res) => {
  console.log(req.session);
  req.session.test = 'hello';
  res.end(`
    worker: ${ process.pid },
    session: ${ JSON.stringify(req.session) }
  `);
});

export default (app) => {
  app.use('/test', router);
};
