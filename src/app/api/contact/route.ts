import { NextResponse } from 'next/server';
import { resend } from '@/lib/resend';

export async function POST(req: Request) {
  try {
    const { name, company, message } = await req.json();

    if (!message || !name) {
      return NextResponse.json(
        { error: 'Nome e messaggio sono obbligatori' },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: 'Portfolio Contact <contact@futureintelligence.space>',
      to: 'bifulcogiuseppegerardo@gmail.com',
      subject: `Nuovo messaggio da ${name} (${company || 'No Company'})`,
      text: `Hai ricevuto un nuovo messaggio dal tuo portfolio:\n\nNome: ${name}\nAzienda: ${company || 'N/A'}\nMessaggio: ${message}`,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
