import caret from "../../public/svg/caret-down.svg";
import Image from 'next/image';
import './styles.css';

export default function Home() {
    return (
        <>
            <a href="#main-content" className="skip-link">Skip to content</a>
            <main id="main-content">
                <header id="hero">
                    <h1>Brad Cranford</h1>
                    <Image src={caret.src} width={50} height={50} alt="" aria-hidden="true" />
                </header>
                <section className="content-wrapper" aria-labelledby="about-heading">
                    <h2 id="about-heading" className="sr-only">About</h2>
                    <p>I&apos;m a software engineer living in Washington, DC.</p>
                    <p>Feel free to reach out - I&apos;m always available to discuss new ideas and opportunities.</p>
                    <p>
                        Email:{' '}
                        <a href="mailto:brad.cranford@protonmail.com">brad.cranford@protonmail.com</a>
                    </p>
                </section>
            </main>
        </>
    );
}
