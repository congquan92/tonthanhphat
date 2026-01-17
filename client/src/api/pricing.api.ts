import axios from "axios";


export interface PricingItem {
    "Tên sản phẩm": string;
    "Giá": number;
    "Danh mục": string;
    "Đơn vị": string;
    "Độ dày": string;
    "Ghi chú": string;
    [key: string]: any; // Cho phép các cột động
}

export interface PricingResponse {
    success: boolean;
    data: PricingItem[];
    timestamp: string;
    count: number;
}

const GOOGLE_SHEETS_API_URL = process.env.NEXT_PUBLIC_PRICING_SHEET_URL || "";

export const PricingApi = {
    getAllPricing: async (): Promise<PricingResponse> => {
        try {
            if (!GOOGLE_SHEETS_API_URL) {
                console.warn("NEXT_PUBLIC_PRICING_SHEET_URL chưa được cấu hình");
                return {
                    success: false,
                    data: [],
                    timestamp: new Date().toISOString(),
                    count: 0,
                };
            }

            const response = await axios.get<PricingResponse>(GOOGLE_SHEETS_API_URL, {
                timeout: 10000, // 10s timeout
            });

            return response.data;
        } catch (error) {
            console.error("Lỗi khi fetch pricing data:", error);
            return {
                success: false,
                data: [],
                timestamp: new Date().toISOString(),
                count: 0,
            };
        }
    },
};
