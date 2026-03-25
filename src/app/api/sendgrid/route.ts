import { NextRequest, NextResponse } from 'next/server';
import sendgrid from '@sendgrid/mail';

sendgrid.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    await sendgrid.send({
      to: 'andre.pichardo@outlook.com',
      from: 'contact@andrepichardo.com',
      replyTo: body.email,
      subject: `[Message from Portfolio] : ${body.subject}`,
      text: `You've got a new mail from ${body.fullname}, their email is: ${body.email} \n\nMessage: ${body.message}`,
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>Portfolio Contact</title>
        <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
      </head>
      <body>
        <div class="img-container" style="display: flex;justify-content: center;align-items: center;border-radius: 5px;overflow: hidden; font-family: 'helvetica', 'ui-sans';">
        </div>
              <div class="container" style="margin-left: 20px;margin-right: 20px;">
                <h3>You've got a new mail from <u>${body.fullname}</u>, their email is: ✉️${body.email} </h3>
                <div style="font-size: 16px;">
                  <p>Message:</p>
                  <p>${body.message}</p>
                  <br>
                </div>
                <img src="https://andrepichardo.com/_next/static/media/AP-Logo2.6a1a928f.svg" class="logo-image" style="height: 50px;width: 50px;border-radius: 5px;overflow: hidden;">
                <p class="footer" style="font-size: 16px;padding-bottom: 20px;border-bottom: 1px solid #D1D5DB;">Regards<br>${body.fullname}<br></p>
              </div>
      </body>
      </html>`,
    });

    return NextResponse.json({ status: 'Message Sent!' });
  } catch (error: unknown) {
    const err = error as { statusCode?: number; message?: string };
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 },
    );
  }
}
