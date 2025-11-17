const timeFormat = (minutes) => {
    // Guard: if no runtime provided or invalid, return placeholder
    if (minutes == null || minutes === '' || Number.isNaN(Number(minutes))) return 'N/A';

    const total = Number(minutes);
    if (total <= 0) return '0h 00m';

    const hours = Math.floor(total / 60);
    const minrem = total % 60;

    return `${hours}h ${minrem.toString().padStart(2, '0')}m`;
}

export default timeFormat;