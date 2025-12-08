import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import NavBar from "@/components/layout/NavBar";
import { ThemeProvider } from "@/components/theme-provider";
import Container from "@/components/Container";
import { Toaster } from "@/components/ui/toaster";
import LocationFilterWrapper from "@/components/layout/LocationFilterWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Innfinite",
  description: "Explore More, Worry Less with Innfinite Bookings.",
  icons: { icon: "/hotel.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get publishable key from environment variable
  // Remove any quotes, whitespace, or invalid characters
  const publishableKey =
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim().replace(
      /^["']|["']$/g,
      ""
    ) || "";

  // Validate that the key exists and has the correct format
  if (!publishableKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY environment variable. " +
        "Please add it to your .env.local file: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_..."
    );
  }

  if (
    !publishableKey.startsWith("pk_test_") &&
    !publishableKey.startsWith("pk_live_")
  ) {
    throw new Error(
      "Invalid NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY format. " +
        'The key should start with "pk_test_" or "pk_live_". ' +
        "Please check your .env.local file."
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster />
            <main className="flex flex-col min-h-screen bg-background">
              <NavBar />
              <LocationFilterWrapper />
              <section className="flex-1">
                <Container>{children}</Container>
              </section>
            </main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
