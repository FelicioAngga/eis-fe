export const formatDateTime = (dateString: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);

  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("id-ID", { month: "long" });
  const year = date.getFullYear();

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return `${day} ${month} ${year}, ${hours}:${minutes}:${seconds}`;
}

export const formatDateToTime = (dateString: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

export const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);

  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("id-ID", { month: "long" });
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

export const getDayOfWeek = (dateString: string): string  =>{
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

export const formatYearMonthDate = (isoString: string) => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const formatted = `${year}-${month}-${day}`;
  return formatted;
}