import './styles.css';
import useCountry from '../../../app/hooks/useCountry';
import * as d3 from 'd3'
import geoJson from '../threatened-species/geo.json'
import geoJsonCentroid from '../threatened-species/geoCentroids.json'
import useFetch from '@/app/hooks/useFetch';
import Head from 'next/head';
import { useState, useEffect, useCallback } from 'react';
import { useRef } from 'react';
import LoadingSpinner from './LoadingSpinner';

export default function ThreatenedSpecies() {
    // Get the user's country from their browser
    let { detectedCountry, detectedCountryCode, fullCountryList, countryDetected } = useCountry();

    // If country can't be detected, set to first country
    if (countryDetected == false) {
        detectedCountry = "Afghanistan";
        detectedCountryCode = "AF"
    }

    // Set state and default values
    const [state, setState] = useState({
        country: detectedCountry,
        countryCode: detectedCountryCode,
        selectedCountry: ''
    })

    function getFlagEmoji(countryCode) {
        const codePoints = countryCode
          .toUpperCase()
          .split('')
          .map(char =>  127397 + char.charCodeAt());
        return String.fromCodePoint(...codePoints);
    }

    // Fetch red list data
    const url = "https://apiv3.iucnredlist.org/api/v3/country/getspecies/" + state.countryCode;
    const { data, loading, error } = useFetch(url + process.env.redListToken);

    if (error) {
        console.log(error);
    }

    // Get count of VU, EN, and CR species
    let vulnerableCount = 0;
    let endangeredCount = 0;
    let criticalCount = 0;
    if (data.result) {
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

    // Reference to svg to populate with map
    const svgRef = useRef(null);
    
    // Build country map
    const geoData = geoJson;
    useEffect(() => {
        let countryMap = {};
        let countryCenter = null;

        // Filter all geoData to return current country data
        countryMap.features = geoData.features.filter(function(d){
            return d.properties.name == state.country;
        })

        // Get zoom factor
        const scaleFactor = () => {
            if (countryMap.features[0].properties.zoom) {
                return (900 * countryMap.features[0].properties.zoom);
            } else {
                return 900;
            }
        }

        // Get centroid coordinates for current country
        geoJsonCentroid.features.forEach((feature) => {
            if (feature.properties["COUNTRY"] == state.country) {
                countryCenter = feature.geometry.coordinates;
            }
        })

        // Check that svg element has been rendered
        if (d3.select(svgRef.current)) {
            d3.select(".svgMap").selectAll('svg').remove();

            // Setup map and projection
            const projection = d3.geoMercator()
                .center(countryCenter)
                .scale(scaleFactor()) // "Zoom"
                .translate([ 400, 200 ]) // width and height / 2

            // Draw the map
            const svgContainer = d3.select(".svgMap")
                .append('svg')
                .attr('viewBox', '0 0 800 450')
            
            svgContainer.append("g")
                .selectAll("path")
                .data(countryMap.features)
                .enter()
                .append("path")
                .attr("fill", updateColor())
                .attr("d", d3.geoPath()
                    .projection(projection)
                )
                .style("stroke", "none")
        }
    }, [state.country, threatenedSpecies, geoData.features, updateColor]);

    // Manual country selection handling
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

                <div className="svgMap"></div>

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

                <small>Data provided by the <a href="https://www.iucnredlist.org/" target='_blank'>IUCN Red List</a></small>
            </section>
        </main>
    );
}