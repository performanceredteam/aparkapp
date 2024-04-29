import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AparkApp",
  description: "Aplicacón de Administración de Parqueaderos de Conjuntos",
};

export default function RootLayout({ children }) {
  return (

    <html lang="en">
      <head>
      <title>AparkApp</title>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet" />
      </head>
     
      
      <body className={inter.className}>{children}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js" async ></script>
      </body>
    </html>
  );


}
