
const formatDateTime = (date) => {
    const formattedDateTime = new Date(date).toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
    return formattedDateTime;
};

export default formatDateTime;