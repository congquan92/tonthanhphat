import Image from "next/image";

export default function LoadingCustom() {
    return (
        <div className="min-h-[70vh]">
            <div className="flex flex-col items-center justify-center gap-3">
                {/* GIF Animation */}
                <div className="relative w-48 h-48 md:w-64 md:h-64">
                    <Image src="/loading.gif" alt="Loading..." fill className="object-contain" priority />
                </div>

                {/* Cả chữ và chấm đều rung cùng nhau */}
                <div className="loader"></div>
            </div>

            <style>{`
        .loader {
          width: fit-content;
          font-weight: bold;
          font-family: monospace;
          font-size: 30px;
          text-shadow: 
            0 0 0 rgb(255 0 0), 
            0 0 0 rgb(0 255 0), 
            0 0 0 rgb(0 0 255);
          animation: glitch-animation 1s infinite cubic-bezier(0.5,-2000,0.5,2000);
        }

        .loader:before {
          content: "Đang tải...";
          animation: dots-running 1.5s steps(4, end) infinite;
        }

        @keyframes glitch-animation {
          25%, 100% {
            text-shadow: 
              0.03px -0.01px 0.01px rgb(255 0 0), 
              0.02px 0.02px 0 rgb(0 255 0), 
              -0.02px 0.02px 0 rgb(0 0 255);
          }
        }

        @keyframes dots-running {
          0%, 20% { content: "Đang tải"; }
          40% { content: "Đang tải."; }
          60% { content: "Đang tải.."; }
          80%, 100% { content: "Đang tải..."; }
        }
      `}</style>
        </div>
    );
}
