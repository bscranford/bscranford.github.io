import Image from 'next/image';
import Link from 'next/link'
import Head from 'next/head'
import botwImg from '../../../public/images/project-previews/botw.png'
import eplImg from '../../../public/images/project-previews/epl-alltime.png'
import speciesImg from '../../../public/images/project-previews/threatened-species.png'
import '../../app/globals.css'
import '../../app/styles.css'
import './styles.css'

export default function Labs() {
    return (
        <main>
            <Head>
                <title>Brad Cranford - Projects</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
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
                            alt="Visual preview of Zelda: Breath of the Wild Compendium Project"
                        />
                        <Link href="/labs/hyrule">Zelda: BotW<br />Compendium</Link>
                    </li>
                    <li>
                        <Image
                            src={eplImg}
                            width={180}
                            height={120}
                            alt="Visual preview of EPL All Time Standings Project"
                        />
                        <Link href="/labs/epl-standings">EPL All Time<br />Standings</Link>
                    </li>
                    <li>
                        <Image
                            src={speciesImg}
                            width={180}
                            height={120}
                            alt="Visual preview of Threatened Species Project"
                        />
                        <Link href="/labs/threatened-species">Threatened<br />Species</Link>
                    </li>
                </ul>
            </section>
            <footer>
                <Link href="/">Home</Link>
            </footer>
        </main>
    );
}
