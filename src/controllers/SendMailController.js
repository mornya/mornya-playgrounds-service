import Mailer from 'utils/Mailer';
import BaseController from 'controllers/BaseController';

export default class SendMailController extends BaseController {
  constructor(router) {
    super();

    this.router = router;
    this.router.post('/sendMail', this.sendMail);
  }

  sendMail = (req, res) => {
    Mailer.send(req.body.mailForm)
      .then((/*result*/) => this.sendResponse(res))
      .catch((err) => this.sendResponseError(res, this.responseCodes.MAILER_FAIL, err));
  };
}
