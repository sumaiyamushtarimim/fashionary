

export type CourierSummary = {
    "Total Parcels"?: number;
    "Delivered Parcels"?: number;
    "Canceled Parcels"?: number;
    "Total Delivery"?: number;
    "Successful Delivery"?: number;
    "Canceled Delivery"?: number;
    Details?: any[];
};

export type DeliveryReport = {
    Summaries: {
        Steadfast: CourierSummary;
        RedX: CourierSummary;
        Pathao: CourierSummary;
        [key: string]: CourierSummary;
    };
    totalSummary: {
        "Total Parcels": number;
        "Delivered Parcels": number;
        "Canceled Parcels": number;
    };
};

export async function getDeliveryReport(phone: string): Promise<DeliveryReport | null> {
    try {
        const response = await fetch(`/api/delivery-report?phone=${phone}`);

        if (!response.ok) {
            console.error('Failed to fetch delivery report from internal API');
            return null;
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error fetching delivery report:", error);
        return null;
    }
}
