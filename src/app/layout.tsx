import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TasteSpec AI | Cultural-to-Constraint Autonomous Execution Engine",
  description:
    "Powered by Qloo v2/insights & /search Taste Graph API + Deterministic Constraint Critic.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
