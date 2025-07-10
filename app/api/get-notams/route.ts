import { NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';

export async function GET() {
  try {
    const response = await fetch('https://lentopaikat.fi/notam/notam.php?a=EFNU');
    const html = await response.text();

    const dom = new JSDOM(html);
    const document = dom.window.document;

    const notams = document.querySelector('pre')?.textContent || 'No NOTAMs found'; // adjust selector
    return NextResponse.json({ notams });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch NOTAMs' }, { status: 500 });
  }
}
