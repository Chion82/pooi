import { Router } from 'express';
let router = Router();
import auth from '../helpers/auth';

router.post('/auth', async (req, res) => {
  let result = await auth(req.body.username, req.body.password);
  res.json(result);
});

export default (app) => {
  app.use('/api', router);
};
