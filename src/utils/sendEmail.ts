interface ISendEmailParams {
  from: string,
  to: string[],
  subject: string,
  text: string,
  html: string,
}

export async function sendEmail({}: ISendEmailParams) {}
