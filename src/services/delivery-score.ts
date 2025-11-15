

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
    const apiKey = "example_api_key"; // In a real app, this would be fetched from a secure config
    const url = `https://dash.hoorin.com/api/courier/api?apiKey=${apiKey}&searchTerm=${phone}`;
    const sheetUrl = `https://dash.hoorin.com/api/courier/sheet?apiKey=${apiKey}&searchTerm=${phone}`;

    try {
        const [response, sheetResponse] = await Promise.all([
             fetch(url),
             fetch(sheetUrl)
        ]);
        
        if (!response.ok || !sheetResponse.ok) {
            console.error('Failed to fetch delivery report');
            return null;
        }
        
        const data = await response.json();
        const sheetData = await sheetResponse.json();

        return {
            Summaries: data.Summaries,
            totalSummary: sheetData.totalSummary,
        };

    } catch (error) {
        console.error("Error fetching delivery report:", error);
        return null;
    }
}
