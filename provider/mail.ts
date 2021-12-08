const mail = require('@sendgrid/mail');
mail.setApiKey(process.env.SENDGRID_API_KEY)

const senderEmail: string = process.env.SENDGRID_SENDER_EMAIL
const clientEmails: string[] = process.env.SENDGRID_CLIENT_EMAILS.split(',')
const templateId:string = process.env.SENDGRID_TEMPLATE_ID || ''

export const sendReport = async function(result: any) {
  try {
    const res = await mail.send(
      {
        to: clientEmails,
        from: senderEmail,
        templateId: templateId,
        dynamicTemplateData: {
          report_date: (new Date()).toISOString().split('T')[0],
          report_by: 'Function App',
          ...result
        }
      }
      
    )
    return res
  } catch(e) {
    return e
  }
}