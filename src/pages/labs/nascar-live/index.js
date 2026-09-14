import Head from 'next/head';
import { useEffect, useMemo, useRef, useState } from 'react';
import './styles.css';

const FEED_URL = 'https://cf.nascar.com/live/feeds/live-feed.json';
const CAR_BADGE_URL = 'https://cf.nascar.com/data/images/carbadges/1';
const STORAGE_KEY = 'nascar-live-settings';

const manufacturerLogos = {
    Chevrolet: {
        label: 'Chevrolet',
        url: 'https://www.nascar.com/wp-content/uploads/sites/7/2017/01/Chevy-Driver-Page-New-2-160x811-52x35.png',
    },
    Ford: {
        label: 'Ford',
        url: 'https://www.nascar.com/wp-content/uploads/sites/7/2024/04/10/Ford-Logo-1-62x35.png',
    },
    Toyota: {
        label: 'Toyota',
        url: 'https://www.nascar.com/wp-content/uploads/sites/7/2020/04/06/Toyota-35x35.png',
    },
};

const flagStateMap = {
    0: 'Green',
    1: 'Yellow',
    2: 'Red',
    3: 'White',
    4: 'Checkered',
    5: 'Black',
    6: 'Blue',
    7: 'Finish',
    9: 'Final lap',
    10: 'Caution',
    11: 'Caution',
    12: 'Pit road',
};

const flagStateColors = {
    0: '#22c55e',
    1: '#facc15',
    2: '#ef4444',
    3: '#e2e8f0',
    4: '#f97316',
    5: '#111827',
    6: '#60a5fa',
    7: '#c084fc',
    9: '#f59e0b',
    10: '#facc15',
    11: '#facc15',
    12: '#93c5fd',
};

const sizeOptions = {
    s: { label: 'S', multiplier: 1 },
    m: { label: 'M', multiplier: 1.5 },
    l: { label: 'L', multiplier: 2 },
};

const spacingOptions = {
    comfortable: { label: 'Comfortable' },
    dense: { label: 'Dense' },
    compact: { label: 'Compact' },
};

const delayOptions = [0, 5, 10, 15, 20, 25, 30];

function formatClock(totalSeconds) {
    if (typeof totalSeconds !== 'number' || !Number.isFinite(totalSeconds)) {
        return '--';
    }

    const safeTotal = Math.max(0, totalSeconds);
    const hours = Math.floor(safeTotal / 3600);
    const minutes = Math.floor((safeTotal % 3600) / 60);
    const seconds = Math.floor(safeTotal % 60);

    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function formatLapTime(value) {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
        return '--';
    }

    return value.toFixed(3);
}

function getFlagLabel(flagState) {
    return flagStateMap[flagState] ?? `Flag ${flagState ?? 'N/A'}`;
}

function getVehicleName(vehicle) {
    const driver = vehicle?.driver;
    if (!driver) {
        return `Car ${vehicle?.vehicle_number ?? '--'}`;
    }

    return driver.full_name || `${driver.first_name || ''} ${driver.last_name || ''}`.trim() || `Car ${vehicle?.vehicle_number ?? '--'}`;
}

function getManufacturerLogo(manufacturer) {
    const normalizedManufacturer = String(manufacturer ?? '').toLowerCase();

    if (normalizedManufacturer === 'chv' || normalizedManufacturer === 'chevy' || normalizedManufacturer === 'chevrolet') {
        return manufacturerLogos.Chevrolet;
    }

    if (normalizedManufacturer === 'ford' || normalizedManufacturer === 'frd') {
        return manufacturerLogos.Ford;
    }

    if (normalizedManufacturer === 'toyo' || normalizedManufacturer === 'toyota' || normalizedManufacturer === 'tyt') {
        return manufacturerLogos.Toyota;
    }

    return null;
}

function NascarCarBadge({ carNumber, manufacturer }) {
    const [imageFailed, setImageFailed] = useState(false);
    const [manufacturerImageFailed, setManufacturerImageFailed] = useState(false);
    const normalizedNumber = String(carNumber ?? '--').trim();
    const hasNumber = normalizedNumber !== '--' && normalizedNumber !== '';
    const manufacturerLogo = getManufacturerLogo(manufacturer);

    useEffect(() => {
        setImageFailed(false);
        setManufacturerImageFailed(false);
    }, [normalizedNumber, manufacturerLogo?.url]);

    return (
        <span className="car-badge">
            <span className="car-number-image">
                {hasNumber && !imageFailed ? (
                    <img
                        src={`${CAR_BADGE_URL}/${encodeURIComponent(normalizedNumber)}.png`}
                        alt={`Car ${normalizedNumber}`}
                        onError={() => setImageFailed(true)}
                    />
                ) : (
                    <span className="car-number-fallback">{normalizedNumber}</span>
                )}
            </span>
            <span className="car-badge-divider" aria-hidden="true">|</span>
            {manufacturerLogo && !manufacturerImageFailed ? (
                <img
                    className="manufacturer-logo"
                    src={manufacturerLogo.url}
                    alt={`${manufacturerLogo.label} manufacturer logo`}
                    onError={() => setManufacturerImageFailed(true)}
                />
            ) : (
                <span className="manufacturer-fallback">{manufacturerLogo?.label ?? 'Unknown'}</span>
            )}
        </span>
    );
}

function getLapsLed(vehicle) {
    const led = Array.isArray(vehicle?.laps_led) ? vehicle.laps_led : [];

    return led.reduce((total, segment) => {
        const startLap = Number(segment?.start_lap ?? 0);
        const endLap = Number(segment?.end_lap ?? 0);
        return total + Math.max(0, endLap - startLap + 1);
    }, 0);
}

function getAveragePitStopTime(vehicle) {
    const stops = Array.isArray(vehicle?.pit_stops) ? vehicle.pit_stops : [];
    const validStops = stops.filter((stop) => {
        const inTime = Number(stop?.pit_in_elapsed_time ?? 0);
        const outTime = Number(stop?.pit_out_elapsed_time ?? 0);
        return Number.isFinite(inTime) && Number.isFinite(outTime) && outTime > inTime;
    });

    if (!validStops.length) {
        return null;
    }

    const total = validStops.reduce((sum, stop) => {
        return sum + (Number(stop.pit_out_elapsed_time) - Number(stop.pit_in_elapsed_time));
    }, 0);

    return total / validStops.length;
}

function getFastestVehicle(vehicles) {
    return vehicles.reduce((fastest, vehicle) => {
        const lapTime = Number(vehicle?.best_lap_time);

        if (!Number.isFinite(lapTime)) {
            return fastest;
        }

        return !fastest || lapTime < Number(fastest.best_lap_time) ? vehicle : fastest;
    }, null);
}

function formatPositionGap(value) {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
        return '--';
    }

    if (value <= 0) {
        return 'Leader';
    }

    return `${value} pos`;
}

function getPositionChange(vehicle) {
    const startPosition = Number(vehicle?.start_position ?? vehicle?.running_position ?? 0);
    const currentPosition = Number(vehicle?.running_position ?? vehicle?.start_position ?? 0);

    if (!Number.isFinite(startPosition) || !Number.isFinite(currentPosition)) {
        return 0;
    }

    return startPosition - currentPosition;
}

function getPositionTrend(vehicle) {
    const change = getPositionChange(vehicle);

    if (change > 0) {
        return { label: 'Gaining', direction: 'gaining', value: `+${change}` };
    }

    if (change < 0) {
        return { label: 'Falling', direction: 'falling', value: `${change}` };
    }

    return { label: 'Even', direction: 'even', value: '0' };
}

function getTrackLabel(feed) {
    if (!feed) {
        return 'Track';
    }

    return feed.track?.name || feed.track_name || feed.track?.short_name || feed.track_short_name || 'Track';
}

function getStageLabel(feed) {
    const stage = feed?.stage;

    if (typeof stage === 'string' || typeof stage === 'number') {
        return stage;
    }

    if (!stage || typeof stage !== 'object') {
        return feed?.stage_name || feed?.stage_label || null;
    }

    return stage.name || stage.stage_name || stage.stage_num || stage.stage_number || stage.number || null;
}

export default function NascarLive() {
    const [settings, setSettings] = useState({ size: 's', spacing: 'comfortable', delay: 0 });
    const [feed, setFeed] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [flagFlashKey, setFlagFlashKey] = useState(0);
    const [isFlagFlashing, setIsFlagFlashing] = useState(false);
    const previousFlagState = useRef(null);

    useEffect(() => {
        try {
            const saved = window.localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                setSettings((current) => ({
                    size: sizeOptions[parsed.size] ? parsed.size : current.size,
                    spacing: spacingOptions[parsed.spacing] ? parsed.spacing : current.spacing,
                    delay: delayOptions.includes(Number(parsed.delay)) ? Number(parsed.delay) : current.delay,
                }));
            }
        } catch (err) {
            console.warn('Could not restore NASCAR settings', err);
        }
    }, []);

    useEffect(() => {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }, [settings]);

    useEffect(() => {
        const nextFlagState = feed?.flag_state;

        if (nextFlagState == null) {
            return undefined;
        }

        if (previousFlagState.current !== null && previousFlagState.current !== nextFlagState) {
            setFlagFlashKey((current) => current + 1);
            setIsFlagFlashing(true);

            const timeoutId = setTimeout(() => setIsFlagFlashing(false), 1800);
            previousFlagState.current = nextFlagState;

            return () => clearTimeout(timeoutId);
        }

        previousFlagState.current = nextFlagState;
        return undefined;
    }, [feed?.flag_state]);

    useEffect(() => {
        let isActive = true;
        let intervalId;
        let timeoutId;

        const fetchFeed = async () => {
            try {
                const response = await fetch(FEED_URL, { cache: 'no-store' });
                if (!response.ok) {
                    throw new Error(`Live feed request failed with status ${response.status}`);
                }

                const json = await response.json();
                if (!isActive) {
                    return;
                }

                const applyDelay = () => {
                    setFeed(json);
                    setError('');
                    setLoading(false);
                };

                if (settings.delay > 0) {
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(applyDelay, settings.delay * 1000);
                    return;
                }

                applyDelay();
            } catch (err) {
                if (isActive) {
                    setError(err.message || 'Unable to load the live NASCAR feed.');
                    setLoading(false);
                }
            }
        };

        fetchFeed();
        intervalId = setInterval(fetchFeed, 15000);

        return () => {
            isActive = false;
            clearInterval(intervalId);
            clearTimeout(timeoutId);
        };
    }, [settings.delay]);

    const sortedVehicles = useMemo(() => {
        if (!feed?.vehicles) {
            return [];
        }

        return [...feed.vehicles].sort((a, b) => (a.running_position ?? 999) - (b.running_position ?? 999));
    }, [feed]);

    const leader = sortedVehicles[0] ?? null;
    const fastestVehicle = useMemo(() => getFastestVehicle(sortedVehicles), [sortedVehicles]);
    const raceProgress = feed?.laps_in_race ? ((feed.lap_number ?? 0) / feed.laps_in_race) * 100 : 0;
    const currentStage = getStageLabel(feed);
    const progressLabel = [
        currentStage ? `Stage ${currentStage}` : null,
        feed?.lap_number != null && feed?.laps_in_race ? `Lap ${feed.lap_number}/${feed.laps_in_race}` : null,
        `${Math.min(100, Math.max(0, raceProgress)).toFixed(0)}% complete`,
    ].filter(Boolean).join(' • ');
    const trackLabel = getTrackLabel(feed);

    return (
        <>
            <main className={`nascar-page spacing-${settings.spacing}`} style={{ '--font-scale': sizeOptions[settings.size].multiplier }}>
                <Head>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                </Head>

                {(loading && !feed) || error ? (
                    <section className="status-banner" aria-live="polite">
                        {loading && !feed ? 'Loading live NASCAR data...' : error}
                    </section>
                ) : null}

                {feed && (
                    <>
                        <section className="summary-grid" aria-label="Race summary">
                            <article className="data-card fastest-card">
                                <span className="label centered-label">Fastest lap</span>
                                {fastestVehicle ? (
                                    <div className="fastest-driver">
                                        <NascarCarBadge carNumber={fastestVehicle.vehicle_number} />
                                        <div className="fastest-driver-info">
                                            <strong>{getVehicleName(fastestVehicle)}</strong>
                                            <span>
                                                Lap {fastestVehicle.best_lap ?? '--'} •{' '}
                                                {formatLapTime(fastestVehicle.best_lap_time)}s
                                                {fastestVehicle.best_lap_speed ? ` • ${fastestVehicle.best_lap_speed.toFixed(1)} mph` : ''}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <strong>--</strong>
                                )}
                            </article>
                            <article className="data-card track-card">
                                <span className="label centered-label">Track</span>
                                <div className="lap-card-body">
                                    <strong>{trackLabel}</strong>
                                </div>
                            </article>
                            <div className="data-card settings-card">
                                <span className="label centered-label">Settings</span>
                                <label className="delay-picker" htmlFor="broadcast-delay">
                                    <span>Delay</span>
                                    <select
                                        id="broadcast-delay"
                                        value={settings.delay}
                                        onChange={(event) => setSettings((current) => ({ ...current, delay: Number(event.target.value) }))}
                                    >
                                        {delayOptions.map((value) => (
                                            <option key={value} value={value}>{value === 0 ? 'Live' : `${value}s`}</option>
                                        ))}
                                    </select>
                                </label>

                                <div className="settings-group">
                                    <label className="settings-label" htmlFor="font-size">Font</label>
                                    <select
                                        id="font-size"
                                        value={settings.size}
                                        onChange={(event) => setSettings((current) => ({ ...current, size: event.target.value }))}
                                    >
                                        {Object.entries(sizeOptions).map(([key, option]) => (
                                            <option
                                                key={key}
                                                value={key}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="settings-group">
                                    <label className="settings-label" htmlFor="table-spacing">Spacing</label>
                                    <select
                                        id="table-spacing"
                                        value={settings.spacing}
                                        onChange={(event) => setSettings((current) => ({ ...current, spacing: event.target.value }))}
                                    >
                                        {Object.entries(spacingOptions).map(([key, option]) => (
                                            <option
                                                key={key}
                                                value={key}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </section>

                        <section className="table-card" aria-label="Race standings table">
                            <div className="table-header race-progress-header" aria-label="Race progress and stage status">
                                <div className="race-progress-meta">
                                    <strong>{progressLabel}</strong>
                                </div>
                                <div className="progress-track" aria-label="Race progress bar">
                                    <span
                                        key={flagFlashKey}
                                        className={`progress-fill${isFlagFlashing ? ' flag-changing' : ''}`}
                                        style={{
                                            width: `${Math.min(100, Math.max(0, raceProgress))}%`,
                                            '--flag-color': flagStateColors[feed.flag_state] ?? '#94a3b8',
                                            backgroundColor: flagStateColors[feed.flag_state] ?? '#94a3b8',
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="table-wrap">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Pos</th>
                                            <th>Car</th>
                                            <th>Driver</th>
                                            <th>Trend</th>
                                            <th>Laps</th>
                                            <th>Avg</th>
                                            <th>Avg pos</th>
                                            <th>Led</th>
                                            <th>Pit avg</th>
                                            <th>Last lap</th>
                                            <th>Best lap</th>
                                            <th>Passes</th>
                                            <th>Gap</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sortedVehicles.map((vehicle) => {
                                            const vehiclePitAvg = getAveragePitStopTime(vehicle);
                                            const vehicleGap = leader ? formatPositionGap((leader.running_position ?? 1) - (vehicle.running_position ?? 999)) : '--';
                                            const trend = getPositionTrend(vehicle);

                                            return (
                                                <tr key={`${vehicle.vehicle_number}-${vehicle.driver?.driver_id ?? 'row'}`}>
                                                    <td className="position-value">{vehicle.running_position ?? '--'}</td>
                                                    <td className="car-number-cell">
                                                        <NascarCarBadge
                                                            carNumber={vehicle.vehicle_number}
                                                            manufacturer={vehicle.vehicle_manufacturer}
                                                        />
                                                    </td>
                                                    <td className="driver-name-cell">{getVehicleName(vehicle)}</td>
                                                    <td className={`trend-cell ${trend.direction}`} aria-label={`${trend.label} by ${Math.abs(getPositionChange(vehicle))} positions`}>
                                                        <span className="trend-indicator">{trend.direction === 'gaining' ? '▲' : trend.direction === 'falling' ? '▼' : '•'}</span>
                                                        <span>{trend.value}</span>
                                                    </td>
                                                    <td>{vehicle.laps_completed ?? '--'}</td>
                                                    <td>{vehicle.average_speed ? `${vehicle.average_speed.toFixed(1)} mph` : '--'}</td>
                                                    <td>{vehicle.average_running_position ? vehicle.average_running_position.toFixed(1) : '--'}</td>
                                                    <td>{getLapsLed(vehicle)}</td>
                                                    <td>{vehiclePitAvg ? `${vehiclePitAvg.toFixed(1)}s` : '--'}</td>
                                                    <td>{vehicle.last_lap_time ? `${formatLapTime(vehicle.last_lap_time)}s` : '--'}</td>
                                                    <td>{vehicle.best_lap_time ? `${formatLapTime(vehicle.best_lap_time)}s` : '--'}</td>
                                                    <td>{vehicle.passes_made ?? '--'}</td>
                                                    <td>{vehicleGap}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </>
                )}
            </main>
        </>
    );
}
