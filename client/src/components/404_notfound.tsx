import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function NotFound_404() {
    return (
        <div className="relative flex flex-col md:flex-row items-center justify-center h-[70vh] bg-white overflow-hidden">
            {/* Hiệu ứng mưa */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {Array.from({ length: 250 }).map((_, i) => (
                    <span
                        key={i}
                        className="absolute w-px h-20 bg-blue-300 opacity-30 animate-rain"
                        style={{
                            // dùng số thứ tự để tạo vị trí giả lập ngẫu nhiên
                            left: `${(i * 7) % 100}%`,
                            top: `${(i * 3) % 100}%`,
                            animationDelay: `${(i * 0.1) % 2}s`,
                            animationDuration: `${1 + (i % 2)}s`,
                        }}
                    />
                ))}
            </div>

            {/* Nội dung text */}
            <div className="z-10 max-w-md text-center md:text-left px-6">
                <h1 className="text-4xl md:text-5xl font-bold">404 PAGE NOT FOUND</h1>
                <p className="mt-4 text-lg font-medium">Trang không tồn tại</p>
                <p className="mt-2 text-muted-foreground">Kiểm tra xem bạn đã nhập đúng địa chỉ chưa, quay lại trang trước đó hoặc thử sử dụng tìm kiếm của chúng tôi để tìm một cái gì đó cụ thể.</p>
                <Link href="/">
                    <Button className="mt-6 cursor-pointer">
                        <Home className="inline-flex mr-2" /> Về trang chủ
                    </Button>
                </Link>
            </div>

            {/*  hình ảnh */}
            <div className="z-10 mt-10 md:mt-0 md:ml-10">
                <Image src="/iron-man.jpg" alt="404" className="object-contain" width={400} height={400} />
            </div>

            {/* CSS animation */}
            <style>{`
        @keyframes rain {
          0% { transform: translateY(-100vh); opacity: 0; }
          30% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        .animate-rain {
          animation-name: rain;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
        }
      `}</style>
        </div>
    );
}
