import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Super AI Chat",
  description: "Premium multi-model AI chat, comparison, and super mode.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="appHeader">
          <div className="container">
            <h1>Super AI</h1>
            <nav>
              <a href="/">Chat</a>
              <a href="/compare">Compare</a>
            </nav>
          </div>
        </header>
        <main className="container">{children}</main>
        <footer className="appFooter">
          <div className="container">? {new Date().getFullYear()} Super AI</div>
        </footer>
      </body>
    </html>
  );
}
