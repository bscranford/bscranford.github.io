import caret from "../../public/svg/caret-down.svg";
import Image from 'next/image'

export default function Home() {
    return (
        <main>
            <header id="hero">
                <h1>Brad<br />Cran<br />ford</h1>
                <Image src={caret.src} width={50} height={50} alt="Downward facing caret" />
            </header>
            <section className="content-wrapper">
                <p>I&apos;m a software engineer living in Washington, DC.</p>
                <p>Feel free to reach out - I&apos;m always available to discuss new ideas and opportunities.</p>
                <p>Email: brad.cranford@protonmail.com</p>
            </section>
        </main>
    );
}
