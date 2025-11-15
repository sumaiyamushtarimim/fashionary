
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get('phone');
  
  // In a real app, you would fetch this from a secure config/env variable
  const apiKey = process.env.HOORIN_API_KEY || "fc8c2dc2b03c34d15b7136"; 

  if (!phone) {
    return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
  }

  // Mock data for testing purposes
  if (phone === '01234567890') {
    const mockReport = {
        Summaries: {
            "Steadfast": {
                "Total Parcels": 218,
                "Delivered Parcels": 2,
                "Canceled Parcels": 216,
            },
            "RedX": {
                "Total Parcels": 0,
                "Delivered Parcels": 0,
                "Canceled Parcels": 0,
            },
            "Pathao": {
                "Total Delivery": 0,
                "Successful Delivery": 0,
                "Canceled Delivery": 0,
            },
            "Carrybee": {
                "Total Delivery": 0,
                "Successful Delivery": 0,
                "Canceled Delivery": 0,
            }
        },
        totalSummary: {
            "Total Parcels": 218,
            "Delivered Parcels": 2,
            "Canceled Parcels": 216,
        }
    };
    return NextResponse.json(mockReport);
  }

  const url = `https://dash.hoorin.com/api/courier/api?apiKey=${apiKey}&searchTerm=${phone}`;
  const sheetUrl = `https://dash.hoorin.com/api/courier/sheet?apiKey=${apiKey}&searchTerm=${phone}`;
  const headers = {
    'Referer': 'https://fixedplus.com.bd'
  };

  try {
    const [summaryRes, sheetRes] = await Promise.all([
      fetch(url, { cache: 'no-store', headers: headers }),
      fetch(sheetUrl, { cache: 'no-store', headers: headers })
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

    // Correctly combine the data from both API calls
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
