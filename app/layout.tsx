import "@/styles/globals.scss";
import { ReactNode } from "react";
import { Noto_Sans_KR } from "next/font/google";

// Google Fonts 설정
const notoSans = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export const metadata = {
  title: "Movie App",
  description: "영화 트렌드를 한눈에 확인해보세요.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className={notoSans.className}>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
