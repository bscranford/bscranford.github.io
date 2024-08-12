import './styles.css'
import tableData from './standings.json'

const crestsDir = require.context('../../../../public/images/team-crests', false);
function returnCrestSrc(crestFileName) {
    return crestsDir(`./${crestFileName}`).default.src;
}

export default function Epl() {
    return (
        <main>
            <header className="wrapper">
                <h1>EPL All Time Standings</h1>
            </header>
            <section className="standings-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Club</th>
                            <th>Matches</th>
                            <th className="desktop-only">Wins</th>
                            <th className="desktop-only">Draws</th>
                            <th className="desktop-only">Losses</th>
                            <th className="desktop-only">Goals For</th>
                            <th className="desktop-only">Goals Against</th>
                            <th className="desktop-only">Goal Difference</th>
                            <th>Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((club, index) => (
                            <tr key={index}>
                                <td>{club.rank}</td>
                                <td>
                                    <button popovertarget={index}>{club.team}</button>
                                </td>
                                <td>{club.matches}</td>
                                <td className="desktop-only">{club.wins}</td>
                                <td className="desktop-only">{club.draws}</td>
                                <td className="desktop-only">{club.losses}</td>
                                <td className="desktop-only">{club.goalsFor}</td>
                                <td className="desktop-only">{club.goalsAgainst}</td>
                                <td className="desktop-only">{club.goalDiff}</td>
                                <td>{club.points}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {tableData.map((club, index) => (
                    <div className="popover-div" key={index} id={index} popover="auto" style={{borderColor: club.colors[0]}}>
                        { /* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={returnCrestSrc(club.crest)} alt={`Club crest of ${club.team}`} />
                        <h2>{club.team} <a href={club.officialSite} target="_blank">🔗</a></h2>
                        <div className="stat-card-lockup">
                            <div className="stat-card">
                                <p className="stat-name">Location</p>
                                <p className="stat">{club.location}</p>
                            </div>
                            <div className="stat-card">
                                <p className="stat-name">Founded</p>
                                <p className="stat">{club.founded}</p>
                            </div>
                            <div className="stat-card">
                                <p className="stat-name">Colors</p>
                                {club.colors.map((color, index) => (
                                    <span className="dot" key={index} style={{backgroundColor: color}}></span>
                                ))}
                            </div>
                            <div className="stat-card">
                                <p className="stat-name">Nickname</p>
                                <p className="stat">{club.nickname}</p>
                            </div>
                        </div>
                        <div className="stat-list">
                            <p>Stadium: {club.stadium}</p>
                            <hr />
                            <p>Biggest Win: {club.biggestWin}</p>
                            <hr />
                            <p>Biggest Loss: {club.biggestLoss}</p>
                            <hr />
                            <p>Seasons in Top Division: {club.topFlightSeasons}</p>
                            <hr />
                            <p>Most Appearances: {club.appsLeader}</p>
                            <hr />
                            <p>Most Goals: {club.goalsLeader}</p>
                            <hr className="desktop-only" />
                            <p className="desktop-only">Did You Know?<br />{club.weirdFact}</p>
                        </div>
                        
                    </div>
                ))}
            </section>
        </main>
    );
}