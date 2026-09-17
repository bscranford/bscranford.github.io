import './styles.css';
import * as d3 from 'd3'
import fullCountryList from '../threatened-species/countryList.json'
import geoJson from '../threatened-species/geo.json'
import useFetch from '@/app/hooks/useFetch';
import Head from 'next/head';
import { useState, useEffect, useCallback } from 'react';
import { useRef } from 'react';
import LoadingSpinner from './LoadingSpinner';

export default function ThreatenedSpecies() {
    // Set state and default values
    const [state, setState] = useState({
        country: "United States of America",
        countryCode: "US",
        selectedCountry: ''
    })


    // Get country's flag
    function getFlagEmoji(countryCode) {
        const codePoints = countryCode
            .toUpperCase()
            .split('')
            .map(char => 127397 + char.charCodeAt());
        return String.fromCodePoint(...codePoints);
    }

    // Fetch red list data
    const url = "https://apiv4.iucnredlist.org/api/v3/country/getspecies/" + state.countryCode;
    const { data, loading, error } = useFetch(url);

    // Get count of VU, EN, and CR species
    let vulnerableCount = 0;
    let endangeredCount = 0;
    let criticalCount = 0;
    if (data?.result) {
        data.result.forEach((item) => {
            if (item.category == "VU") {
                vulnerableCount++;
            } else if (item.category == "EN") {
                endangeredCount++;
            } else if (item.category == "CR") {
                criticalCount++;
            };
        });
    }

    // Return color based on count relative to avg
    const threatenedAvg = 181;
    const threatenedSpecies = vulnerableCount + endangeredCount + criticalCount;

    const updateColor = useCallback(() => {
        if (threatenedSpecies == 0) {
            return 'white';
        }
        else if (threatenedSpecies > threatenedAvg) {
            return 'darkred';
        } else if (threatenedSpecies == threatenedAvg) {
            return 'midnightblue';
        } else {
            return 'darkgreen';
        }
    }, [threatenedSpecies]);

    // Reference to the map container
    const svgRef = useRef(null);

    // Fit every selected country to the same map frame instead of using country-specific zoom values.
    useEffect(() => {
        const container = d3.select(svgRef.current);
        container.selectAll('svg').remove();

        const selectedFeature = geoJson.features.find((feature) => feature.properties.name === state.country);
        if (!selectedFeature) {
            return undefined;
        }

        const width = 800;
        const height = 450;
        const padding = 28;
        const countryMap = {
            type: 'FeatureCollection',
            features: [selectedFeature],
        };
        const projection = d3.geoMercator().fitExtent(
            [[padding, padding], [width - padding, height - padding]],
            countryMap,
        );
        const svgContainer = container
            .append('svg')
            .attr('viewBox', `0 0 ${width} ${height}`)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .attr('role', 'img')
            .attr('aria-label', `${state.country} outline`);

        svgContainer
            .append('path')
            .datum(selectedFeature)
            .attr('fill', updateColor())
            .attr('d', d3.geoPath().projection(projection))
            .style('stroke', 'none');

        return () => container.selectAll('svg').remove();
    }, [state.country, threatenedSpecies, updateColor]);

    // Country selection handling
    function updateCountryCode(object, value) {
        return Object.keys(object).find(key => object[key] === value);
    }

    const handleChange = (event) => {
        const newCountryCode = updateCountryCode(fullCountryList, event.target.value);
        setState({
            country: event.target.value,
            selectedCountry: event.target.value,
            countryCode: newCountryCode
        });
    };

    return (
        <main>
            <Head>
                <title>Brad Cranford - Threatened Species</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <header className="wrapper">
                <h1>Threatened Species</h1>
                <h2>How does your country stack up?</h2>
            </header>
            <section className="content-wrapper">

                <div className="select">
                    <select id="standard-select" onChange={handleChange} defaultValue="Select a country">
                        <option disabled={true}>Select a country</option>
                        {Object.values(fullCountryList).map((countryForList) => (
                            <option key={countryForList} value={countryForList}>
                                {countryForList}
                            </option>
                        ))}
                    </select>
                    <span className="focus"></span>
                </div>

                <div className="svgMap" ref={svgRef}></div>

                <h2 className="country-heading">{getFlagEmoji(state.countryCode)} {state.country}</h2>
                <div className="table-lockup">
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Vulnerable</th>
                                <th>Endangered</th>
                                <th>Critically Endangered</th>
                                <th>Threatened (Total)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Average</td>
                                <td>69</td>
                                <td>72</td>
                                <td>40</td>
                                <td>{threatenedAvg}</td>
                            </tr>
                            <tr>
                                <td>{state.country}</td>
                                <td>{vulnerableCount}</td>
                                <td>{endangeredCount}</td>
                                <td>{criticalCount}</td>
                                <td>{threatenedSpecies}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {loading &&
                    <div className="loading-state">
                        <LoadingSpinner />
                    </div>
                }

                {error && !loading &&
                    <p className="error-state" role="alert">
                        Species data is temporarily unavailable. The IUCN service is blocking this browser request; please try again later.
                    </p>
                }

                <small>Data provided by the <a href="https://www.iucnredlist.org/" target="_blank" rel="noreferrer noopener">IUCN Red List</a></small>
            </section>
        </main>
    );
}