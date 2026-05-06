export default function formatPostDate(dateInput: Date | string | undefined): string{
    if (!dateInput) return "";
    
    const now = new Date();
    const date = new Date(dateInput);
  
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  
    const isSameDay =
      now.getFullYear() === date.getFullYear() &&
      now.getMonth() === date.getMonth() &&
      now.getDate() === date.getDate();

    if (isSameDay) {
      if (diffHours === 0) {
        if (diffMins <= 1) {
          return "Just now";
        }
        return `Posted ${diffMins}m ago`;
      }
      return `Posted ${diffHours}h ago`;
    }
  
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const yyyy = date.getFullYear();
    
    const time = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  
    return `${mm}/${dd}/${yyyy} | ${time}`;
  };