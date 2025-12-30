import { ContactInfoApi } from "@/api/contacinfo.api";
import Introduce from "@/components/introduce";
import { ContactInfo } from "@/components/type";
import BannerCarousel from "@/components/banner-carousel";
import ProductCarousel from "@/components/product-carousel";
import { ProductApi } from "@/api/product.api";

export default async function Home() {
    const [contactRes, productRes] = await Promise.all([ContactInfoApi.getContactInfo(), ProductApi.getFeaturedProducts(10)]);
    const contactInfo: ContactInfo = contactRes.data;
    const products = productRes.data || [];

    return (
        <div>
            <BannerCarousel />
            <Introduce data={contactInfo} />
            <ProductCarousel slogan={contactInfo.companySlogan} products={products} />
        </div>
    );
}
