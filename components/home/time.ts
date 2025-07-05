// Fixed UTC and FIN time formatters
  const localTimeFormatter = new Intl.DateTimeFormat('en-FI', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit',
    hour12: false 
  });
  
  const localDateFormatter = new Intl.DateTimeFormat('en-FI', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });

  // UTC formatter - explicitly set timeZone to 'UTC'
  const utcTimeFormatter = new Intl.DateTimeFormat('en-FI', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit',
    hour12: false,
    timeZone: 'UTC'  // Explicit UTC timezone
  });
  
  const utcDateFormatter = new Intl.DateTimeFormat('en-FI', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    timeZone: 'UTC'  // Explicit UTC timezone
  });

  // Finnish time formatter - explicit timezone
  const finTimeFormatter = new Intl.DateTimeFormat('en-FI', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit',
    hour12: false,
    timeZone: 'Europe/Helsinki'  // Helsinki timezone
  });
  
  const finDateFormatter = new Intl.DateTimeFormat('en-FI', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    timeZone: 'Europe/Helsinki'  // Helsinki timezone
  });


  // Format values safely
  const formatSafe = (formatter: Intl.DateTimeFormat, date: Date) => {
    try {
      return formatter.format(date);
    } catch {
      return '--:--:--';
    }
  };





export const getlocalTime = (currentTime: Date): string => formatSafe(localTimeFormatter, currentTime);
export const getlocalDate = (currentTime: Date): string => formatSafe(localDateFormatter, currentTime);
export const getutcTime = (currentTime: Date): string => formatSafe(utcTimeFormatter, currentTime);
export const getutcDate = (currentTime: Date): string => formatSafe(utcDateFormatter, currentTime);
export const getfinishTime = (currentTime: Date): string => formatSafe(finTimeFormatter, currentTime);
export const getfinishDate = (currentTime: Date): string => formatSafe(finDateFormatter, currentTime);