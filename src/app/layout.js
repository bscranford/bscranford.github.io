import './globals.css';

export const metadata = {
    title: "Brad Cranford",
    description: "The personal site of Brad Cranford",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}