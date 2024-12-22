import { readFile } from 'fs';
import * as SibApiV3Sdk from 'sib-api-v3-sdk';
const roles = {
  '2': 'route',
  '3': 'admin',
  '4': 'super',
};

export const Mailer = () => {
  let mailTemplate = '';

  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  const apiKey = defaultClient.authentications['api-key'];
  apiKey.apiKey = process.env.MAILER_API_KEY;
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  readFile(
    (__dirname + '/email-templates/email-invitation/index.html').replace(
      '/dist/',
      '/src/',
    ),
    (err, html) => {
      if (err) {
        console.log('err: ', err);
      }
      mailTemplate = html.toString();
    },
  );

  const sendEmail = (user) => {
    let link = '';
    if (user.role == '4') {
      link = 'https://admin.battery-manager.eu/auth/set-password/';
    }
    if (user.role == '2' || user.role == '3') {
      link = 'https://backoffice.battery-manager.eu/auth/set-password/';
    }
    const updatedTemplate = mailTemplate
      .replace('{{role}}', roles[user.role] || '')
      .replace('{{link}}', link + user.id);

    const emailCampaigns = new SibApiV3Sdk.CreateEmailCampaign();
    emailCampaigns.subject = 'Your invitation to Battery-Manager';
    emailCampaigns.sender = {
      name: 'Battery-Manager',
      email: 'noreply@battery-manager.eu',
    };
    emailCampaigns.htmlContent = updatedTemplate;
    emailCampaigns.to = [
      { email: user.email, name: `${user.firstName} ${user.lastName}` },
    ];
    apiInstance.sendTransacEmail(emailCampaigns).then(
      (data) => {
        console.log(
          'API called successfully. Returned data: ' + JSON.stringify(data),
        );
      },
      (error) => {
        console.error(error);
      },
    );
  };

  return {
    sendEmail,
  };
};
