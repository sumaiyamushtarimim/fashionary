
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get('phone');
  
  // In a real app, you would fetch this from a secure config/env variable
  const apiKey = process.env.HOORIN_API_KEY || "example_api_key"; 

  if (!phone) {
    return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
  }

  const url = `https://dash.hoorin.com/api/courier/api?apiKey=${apiKey}&searchTerm=${phone}`;
  const sheetUrl = `https://dash.hoorin.com/api/courier/sheet?apiKey=${apiKey}&searchTerm=${phone}`;

  try {
    const [summaryRes, sheetRes] = await Promise.all([
      fetch(url, { cache: 'no-store' }), // Disable caching for fresh data
      fetch(sheetUrl, { cache: 'no-store' })
    ]);

    if (!summaryRes.ok || !sheetRes.ok) {
      console.error('Failed to fetch data from Hoorin API', { 
        summaryStatus: summaryRes.status, 
        sheetStatus: sheetRes.status 
      });
      return NextResponse.json({ error: 'Failed to fetch delivery report from external service.' }, { status: 502 });
    }

    const summaryData = await summaryRes.json();
    const sheetData = await sheetRes.json();

    const report = {
      Summaries: summaryData.Summaries,
      totalSummary: sheetData.totalSummary,
    };

    return NextResponse.json(report);
  } catch (error) {
    console.error('Internal server error while fetching delivery report:', error);
    return NextResponse.json({ error: 'An internal error occurred.' }, { status: 500 });
  }
}
