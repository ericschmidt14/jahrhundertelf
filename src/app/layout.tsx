import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import type { Metadata } from "next";
import { Suspense } from "react";
import Footer from "./components/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "1. FCN Jahrhundert+25-Elf",
  description: "",
};

const theme = createTheme({
  fontFamily: "Glober Regular",
  headings: { fontFamily: "Glober ExtraBold" },
  primaryColor: "red",
  colors: {
    red: [
      "#fdecef",
      "#f5d6da",
      "#efa8b1",
      "#ea7884",
      "#e6515f",
      "#e33948",
      "#aa1124",
      "#c9222f",
      "#b41b29",
      "#9e1021",
    ],
  },
  defaultRadius: "0",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>
        <MantineProvider theme={theme} defaultColorScheme="dark">
          <Suspense>
            <main className="relative z-10 min-h-screen flex flex-col justify-between bg-[length:300%_300%] bg-gradient-to-r from-[#b3193e] via-[#aa1124] via-30% to-[#220407] bg-right">
              {children}
              <Footer />
            </main>
          </Suspense>
        </MantineProvider>
      </body>
    </html>
  );
}
