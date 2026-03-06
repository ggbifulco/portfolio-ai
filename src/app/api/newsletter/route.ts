import { NextResponse } from 'next/server';
import { resend } from '@/lib/resend';

const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email non valida' },
        { status: 400 }
      );
    }

    if (!AUDIENCE_ID) {
      console.error('RESEND_AUDIENCE_ID non configurato');
      return NextResponse.json(
        { error: 'Errore di configurazione del server' },
        { status: 500 }
      );
    }

    // 1. Aggiungi il contatto all'Audience di Resend
    const contactRes = await resend.contacts.create({
      email: email,
      audienceId: AUDIENCE_ID,
    });

    if (contactRes.error) {
      // Se l'errore è perché l'utente esiste già, possiamo decidere se procedere o meno
      // Per semplicità, proseguiamo inviando comunque l'email di benvenuto
      console.warn('Errore creazione contatto (potrebbe già esistere):', contactRes.error);
    }

    // 2. Invia l'email di benvenuto
    const { data, error } = await resend.emails.send({
      from: 'Newsletter <newsletter@futureintelligence.space>',
      to: email,
      subject: 'Benvenuto nella Newsletter di Future Intelligence!',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h1 style="color: #990024; text-transform: uppercase; letter-spacing: 2px;">Grazie per esserti iscritto!</h1>
          <p>Siamo entusiasti di averti con noi. Da ora in poi riceverai gli ultimi aggiornamenti direttamente nella tua casella di posta.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #888; text-align: center;">
            © 2026 Giuseppe Gerardo Bifulco | Future Intelligence <br />
            Advanced Machine Learning Engineer
          </p>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
