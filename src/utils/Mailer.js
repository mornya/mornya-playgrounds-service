import mailer from 'nodemailer';

/**
 * {
 *   from: 'Administrator <admin@email.com>'
 *   to: 'test1@email.com, test2@email.com',
 *   subject: 'Untitled',
 *   text: 평문 메일 본문
 *   html: HTML형식 메일 본문
 *   attachments: [
 *     {
 *       fileName: '파일명',
 *       streamSource: fs.createReadStream(파일명),
 *     }
 *   ],
 * @type {{from: string, to: string, subject: string, html: string, attachments: *[]}}
 */
const defaultMailerData = {
  from: 'Administrator <admin@email.com>',
  to: 'test@email.com',
  subject: 'Untitled',
  html: ``,
};

function send(mailForm) {
  const {
    MAILER_SERVICE,
    MAILER_USER,
    MAILER_CLIENT_ID,
    MAILER_CLIENT_SECRET,
    MAILER_REFRESH_TOKEN,
    MAILER_ACCESS_TOKEN,
    MAILER_EXPIRES
  } = process.env;
  const smtpTransport = mailer.createTransport({
    service: MAILER_SERVICE,
    auth: {
      type: 'OAuth2',
      user: MAILER_USER,
      clientId: MAILER_CLIENT_ID,
      clientSecret: MAILER_CLIENT_SECRET,
      refreshToken: MAILER_REFRESH_TOKEN,
      accessToken: MAILER_ACCESS_TOKEN,
      expires: MAILER_EXPIRES,
    },
  });
  const data = { ...defaultMailerData, ...mailForm };

  return new Promise((resolve, reject) => {
    smtpTransport.sendMail(data, (err, res) => {
      smtpTransport.close();
      err ? reject(err) : resolve(res);
    });
  });
}

export default {
  send,
};
