import { ContactInfoApi } from "@/api/contacinfo.api";
import Introduce from "@/components/introduce";
import { ContactInfo } from "@/components/type";
import BannerCarousel from "@/components/banner-carousel";
import ProductFet from "@/components/product-fet";
import { ProductApi } from "@/api/product.api";
import { BannerApi } from "@/api/banner.api";

export default async function Home() {
    const [contactRes, productRes, bannerRes] = await Promise.all([ContactInfoApi.getContactInfo(), ProductApi.getFeaturedProducts(10), BannerApi.getAllBanners()]);
    const contactInfo: ContactInfo = contactRes.data;
    const products = productRes.data || [];
    const banners = bannerRes.data || [];

    return (
        <div>
            <BannerCarousel banners={banners} />
            <Introduce data={contactInfo} />
            <ProductFet slogan={contactInfo.companySlogan} products={products} />
        </div>
    );
}
