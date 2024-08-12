import Image from 'next/image';
import Link from 'next/link'
import botwImg from '../../../public/images/project-previews/botw.png'
import eplImg from '../../../public/images/project-previews/epl-alltime.png'
import '../../app/globals.css'
import '../../app/styles.css'
import './styles.css'

export default function Labs() {
    return (
        <main>
            <header className="wrapper">
                <h1>Projects</h1>
            </header>
            <section className="content-wrapper">
                <ul className="projects-list">
                    <li>
                        <Image
                            src={botwImg}
                            width={180}
                            height={120}
                            alt="Placeholder image"
                        />
                        <Link href="/labs/hyrule">Zelda: BotW<br />Compendium</Link>
                    </li>
                    <li>
                        <Image
                            src={eplImg}
                            width={180}
                            height={120}
                            alt="Placeholder image"
                        />
                        <Link href="/labs/epl-standings">EPL All Time<br />Standings</Link>
                    </li>
                </ul>
            </section>
            <footer>
                <Link href="/">Home</Link>
            </footer>
        </main>
    );
}
