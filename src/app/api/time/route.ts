import { NextResponse } from 'next/server';

export const revalidate = 0;

export async function GET() {
  try {
    const res = await fetch('https://jam.bmkg.go.id/JamServer.php', { 
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const text = await res.text();
    
    const match = text.match(/new Date\((.*?)\)/);
    if (match) {
      const args = match[1].split(',');
      const year = parseInt(args[0]);
      
      let monthRaw = args[1].trim();
      let month = 0;
      if (monthRaw.includes('-')) {
          const parts = monthRaw.split('-');
          month = parseInt(parts[0]) - parseInt(parts[1]);
      } else {
          month = parseInt(monthRaw);
      }
      
      const date = parseInt(args[2]);
      const hours = parseInt(args[3]);
      const minutes = parseInt(args[4]);
      const seconds = parseInt(args[5]);
      
      // BMKG returns WIB (UTC+7)
      const serverDateString = `${year}-${String(month+1).padStart(2, '0')}-${String(date).padStart(2, '0')}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}+07:00`;
      const timeMs = new Date(serverDateString).getTime();
      
      return NextResponse.json({ time: timeMs });
    }
    
    return NextResponse.json({ time: Date.now() });
  } catch (error) {
    console.error("BMKG Time Fetch Error:", error);
    return NextResponse.json({ time: Date.now() });
  }
}
