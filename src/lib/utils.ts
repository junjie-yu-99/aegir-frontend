import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Montserrat, Unna, Roboto } from "next/font/google";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export const unna = Unna({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

export const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});