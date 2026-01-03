import { useState, useEffect } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw } from "lucide-react";
import Image from "next/image";
import { BannerApi, type Banner, type CreateBannerInput } from "@/api/banner.api";
import { toast } from "sonner";

interface BannerDialogProps {
    isOpen: boolean;
    onClose: () => void;
    banner: Banner | null;
    banners: Banner[];
    onSuccess: () => void;
}

export function BannerDialog({ isOpen, onClose, banner, banners, onSuccess }: BannerDialogProps) {
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<string>("");
    const [previewImage, setPreviewImage] = useState<string>("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [formData, setFormData] = useState<CreateBannerInput>({
        imageUrl: "",
        alt: "",
        order: 1,
        isActive: true,
    });

    // Set initial data when dialog opens
    useEffect(() => {
        if (isOpen) {
            if (banner) {
                // Editing existing banner
                setFormData({
                    imageUrl: banner.imageUrl,
                    alt: banner.alt,
                    order: banner.order,
                    isActive: banner.isActive,
                });
                setPreviewImage(banner.imageUrl);
                setSelectedFile(null);
            } else {
                // Creating new banner
                const nextOrder = getNextOrder();
                setFormData({
                    imageUrl: "",
                    alt: "",
                    order: nextOrder,
                    isActive: true,
                });
                setPreviewImage("");
                setSelectedFile(null);
            }
        }
    }, [isOpen, banner]);

    const getNextOrder = () => {
        if (banners.length === 0) return 1;
        const maxOrder = Math.max(...banners.map((b) => b.order));
        return maxOrder + 1;
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Vui lòng chọn file ảnh");
            return;
        }

        // Create local preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result as string);
            setSelectedFile(file);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async () => {
        if (!selectedFile && !formData.imageUrl) {
            toast.error("Vui lòng chọn ảnh");
            return;
        }
        if (!formData.alt) {
            toast.error("Vui lòng điền alt text");
            return;
        }

        try {
            setUploadingImage(true);

            // Upload image first if new file selected
            let imageUrl = formData.imageUrl;
            let publicId = formData.publicId;
            if (selectedFile) {
                setUploadProgress("Đang upload ảnh lên Cloudinary...");
                const uploadResult = await BannerApi.uploadImageFromFile(selectedFile);
                imageUrl = uploadResult.data.url;
                publicId = uploadResult.data.publicId;
                setUploadProgress(banner ? "Upload ảnh thành công, đang cập nhật banner..." : "Upload ảnh thành công, đang tạo banner...");
            }

            // Create or update banner
            if (banner) {
                await BannerApi.updateBanner(banner.id, {
                    ...formData,
                    imageUrl,
                    publicId,
                });
                toast.success("Cập nhật banner thành công");
            } else {
                await BannerApi.createBanner({
                    ...formData,
                    imageUrl,
                    publicId,
                });
                toast.success("Tạo banner thành công");
            }

            onSuccess();
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || (banner ? "Không thể cập nhật banner" : "Không thể tạo banner"));
        } finally {
            setUploadingImage(false);
            setUploadProgress("");
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="rounded-2xl max-w-lg">
                <AlertDialogHeader>
                    <AlertDialogTitle>{banner ? "Chỉnh sửa banner" : "Thêm banner mới"}</AlertDialogTitle>
                    <AlertDialogDescription>Điền thông tin banner. Order phải là số unique (không trùng).</AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-4 py-4">
                    {/* Image Upload */}
                    <div className="space-y-2">
                        <Label>Ảnh banner*</Label>
                        {previewImage && (
                            <div className="relative h-32 w-full overflow-hidden rounded-lg bg-slate-100 mb-2">
                                <Image src={previewImage} alt="Preview" fill className="object-cover" sizes="400px" />
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} className="flex-1" />
                            {uploadingImage && <RefreshCw className="h-4 w-4 animate-spin" />}
                        </div>
                        <p className="text-xs text-slate-500">
                            Khuyến nghị: Upload ảnh tối thiểu <strong>2560x1440px</strong> để hiển thị sắc nét trên desktop
                        </p>
                        <p className="text-xs text-slate-500">Ảnh sẽ được upload khi bạn bấm {banner ? "Cập nhật" : "Tạo banner"}</p>
                    </div>

                    {/* Alt Text */}
                    <div className="space-y-2">
                        <Label htmlFor="alt">Alt Text*</Label>
                        <Input id="alt" value={formData.alt} onChange={(e) => setFormData({ ...formData, alt: e.target.value })} placeholder="Mô tả banner..." disabled={uploadingImage} />
                    </div>

                    {/* Order */}
                    <div className="space-y-2">
                        <Label htmlFor="order">Thứ tự hiển thị* (unique)</Label>
                        <Input id="order" type="number" min="1" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })} disabled={uploadingImage} />
                        <p className="text-xs text-slate-500">
                            Order hiện có:{" "}
                            {banners
                                .filter((b) => b.id !== banner?.id)
                                .map((b) => b.order)
                                .join(", ") || "Không có"}
                        </p>
                    </div>

                    {/* Active */}
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="active" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="h-4 w-4" disabled={uploadingImage} />
                        <Label htmlFor="active" className="cursor-pointer">
                            Hiển thị banner
                        </Label>
                    </div>
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={uploadingImage} className="rounded-xl">
                        Hủy
                    </AlertDialogCancel>
                    <AlertDialogAction disabled={uploadingImage} onClick={handleSubmit} className="rounded-xl bg-blue-500 text-white hover:bg-blue-600">
                        {uploadingImage ? (
                            <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                {uploadProgress || "Đang xử lý..."}
                            </>
                        ) : (
                            <>{banner ? "Cập nhật" : "Tạo banner"}</>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
