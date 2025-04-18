import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(req, res) {
  try {
    await sendgrid.send({
      to: "andrep9711@gmail.com", // Your email where you'll receive emails
      from: "info@andrepichardo.com", // your website email address here
      subject: `[Message from Portfolio] : ${req.body.subject}`,
      text: `You've got a new mail from ${req.body.fullname}, their email is: ${req.body.email} \n\nMessage: ${req.body.message}`,
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html lang="en">
      <head>
        <meta charset="utf-8">      
        <title>The HTML5 Herald</title>
        <meta name="description" content="The HTML5 Herald">
        <meta name="author" content="SitePoint">
        <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
        <link rel="stylesheet" href="css/styles.css?v=1.0">
      </head>
      
      <body>
        <div class="img-container" style="display: flex;justify-content: center;align-items: center;border-radius: 5px;overflow: hidden; font-family: 'helvetica', 'ui-sans';">
        </div>
              <div class="container" style="margin-left: 20px;margin-right: 20px;">
                <h3>You've got a new mail from <u>${req.body.fullname}</u>, their email is: ✉️${req.body.email} </h3>
                <div style="font-size: 16px;">
                  <p>Message:</p>
                  <p>${req.body.message}</p>
                  <br>
                </div>
                <img src="https://andrepichardo.com/_next/static/media/AP-Logo2.6a1a928f.svg" class="logo-image" style="height: 50px;width: 50px;border-radius: 5px;overflow: hidden;">
                <p class="footer" style="font-size: 16px;padding-bottom: 20px;border-bottom: 1px solid #D1D5DB;">Regards<br>${req.body.fullname}<br></p>
              </div>
      </body>
      </html>`,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }

  return res.status(200).json({ status: "Message Sent!" });
}

export default sendEmail;
