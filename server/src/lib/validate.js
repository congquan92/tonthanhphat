import { z } from "zod";

//  Contact info
const SocialLinkSchema = z.object({
    platform: z.string().min(1, "Nền tảng không được để trống"),
    url: z.string().url("Link không hợp lệ"),
    icon: z.string().optional(),
});

const AddressSchema = z.object({
    type: z.string().min(1, "Loại địa chỉ không được để trống"),
    address: z.string().min(1, "Địa chỉ không được để trống"),
});

export const ValidateContactInfo = z.object({
    companyName: z.string().min(1, "Tên công ty không được để trống"),
    companyShortName: z.string().optional(),
    companyTagline: z.string().optional(),
    companySlogan: z.string().optional(),
    companyDescription: z.string().optional(),
    companyEmail: z.string().email("Email không hợp lệ").optional(),
    companyPhone: z.array(z.string().min(10, "Số điện thoại không hợp lệ")).optional(),
    socialLinks: z.array(SocialLinkSchema).optional(),
    addresses: z.array(AddressSchema).optional(),
});
