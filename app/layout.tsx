import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Interactive ODE Simulation Dashboard",
  description: "Explore dynamical systems like the Lorenz attractor and Lotka-Volterra predator-prey model through real-time, interactive visualizations. Adjust parameters and initial conditions to observe how they affect system behavior.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
