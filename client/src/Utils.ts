export class Utils {
    // need this because moment duration is not precise
    public static getDuration(totalMins: number) {
        const days = Math.floor(totalMins / (1440));
        const hours = Math.floor((totalMins - (days * 1440)) / 60);
        const mins = totalMins - (days * 1440) - (hours * 60);

        if (days) {
            return `${days}d ${hours}h ${mins}m`;
        }

        if (hours) {
            return `${hours}h ${mins}m`;
        }

        return `${mins}m`;
    }
}
