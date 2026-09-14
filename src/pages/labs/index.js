import Image from 'next/image';
import Link from 'next/link'
import Head from 'next/head'
import botwImg from '../../../public/images/project-previews/botw.png'
import eplImg from '../../../public/images/project-previews/epl-alltime.png'
import speciesImg from '../../../public/images/project-previews/threatened-species.png'
import nascarImg from '../../../public/images/project-previews/nascar-live.png'
import '../../app/globals.css'
import '../../app/styles.css'
import './styles.css'

export default function Labs() {
    return (
        <>
            <main>
                <Head>
                    <title>Brad Cranford - Projects</title>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                </Head>
                <header className="wrapper">
                    <h1>Projects</h1>
                </header>
                <section className="content-wrapper" aria-labelledby="projects-heading">
                    <h2 id="projects-heading" className="sr-only">Project list</h2>
                    <ul className="projects-list">
                        <li>
                            <article>
                                <Image
                                    src={botwImg}
                                    width={180}
                                    height={120}
                                    alt="Visual preview of Zelda: Breath of the Wild Compendium Project"
                                />
                                <Link href="/labs/hyrule" aria-label="Open Zelda Breath of the Wild Compendium project">Zelda: BotW<br />Compendium</Link>
                            </article>
                        </li>
                        <li>
                            <article>
                                <Image
                                    src={eplImg}
                                    width={180}
                                    height={120}
                                    alt="Visual preview of EPL All Time Standings Project"
                                />
                                <Link href="/labs/epl-standings" aria-label="Open EPL all-time standings project">EPL All Time<br />Standings</Link>
                            </article>
                        </li>
                        <li>
                            <article>
                                <Image
                                    src={speciesImg}
                                    width={180}
                                    height={120}
                                    alt="Visual preview of Threatened Species Project"
                                />
                                <Link href="/labs/threatened-species" aria-label="Open threatened species project">Threatened<br />Species</Link>
                            </article>
                        </li>
                        <li>
                            <article>
                                <Image
                                    src={nascarImg}
                                    width={180}
                                    height={120}
                                    alt="Visual preview of NASCAR Live dashboard"
                                />
                                <Link href="/labs/nascar-live" aria-label="Open NASCAR Live dashboard">NASCAR<br />Live</Link>
                            </article>
                        </li>
                    </ul>
                </section>
            </main>
            <footer>
                <Link href="/">Home</Link>
            </footer>
        </>
    );
}
