import { NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';

export async function GET() {
  try {
    const response = await fetch('https://info.efnu.fi');
    const html = await response.text();

    const dom = new JSDOM(html);
    const document = dom.window.document;

    const notams = document.querySelector('.alert')?.textContent || 'No INFO found'; // adjust selector
    return NextResponse.json({ notams });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch NOTAMs' }, { status: 500 });
  }
}
