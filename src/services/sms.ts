// In a real app, this function would make an HTTP request to the MiM SMS API.
// The backend developer would replace the content of this function with actual API call logic.

export async function sendSms(mobileNumber: string, message: string): Promise<{
    statusCode: string;
    status: "Success" | "Failed";
    trxnId: string;
    responseResult: string;
}> {
    console.log('--- Sending SMS via Mock Service ---');
    console.log('To:', mobileNumber);
    console.log('Message:', message);
    console.log('------------------------------------');

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // For demonstration, we'll return a mock success response.
    // To test failure, you can change the status and responseResult.
    const mockSuccessResponse = {
        statusCode: "200",
        status: "Success" as const,
        trxnId: `MOCK_${Date.now()}`,
        responseResult: "SMS Send Successfuly",
    };

    /*
    // Example of a mock failure response based on the documentation
    const mockFailureResponse = {
        statusCode: "208",
        status: "Failed" as const,
        trxnId: `MOCK_${Date.now()}`,
        responseResult: "Invalid Sender ID",
    };
    */

    // A real implementation would look something like this:
    /*
    const response = await fetch('https://api.mimsms.com/api/SmsSending/SMS', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            UserName: process.env.NEXT_PUBLIC_MIM_SMS_USERNAME,
            Apikey: process.env.NEXT_PUBLIC_MIM_SMS_API_KEY,
            SenderName: process.env.NEXT_PUBLIC_MIM_SMS_SENDER_NAME,
            MobileNumber: mobileNumber,
            TransactionType: 'T', // Assuming Transactional
            Message: message,
        }),
    });
    return response.json();
    */

    return Promise.resolve(mockSuccessResponse);
}
