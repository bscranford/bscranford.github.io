import {Tabs, Tab} from "@nextui-org/tabs";
import Head from 'next/head';
import useFetch from '../../../app/hooks/useFetch';
import './styles.css';

export default function Hyrule() {
    // Fetch compendium data
    const { data, loading, error } = useFetch('https://botw-compendium.herokuapp.com/api/v3/compendium/all?game=2');
    if (loading) return <div className="content-wrapper">Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    // Set list of item categories
    const categories = ["creatures", "equipment", "materials", "monsters", "treasure"];

    // Seperate items into categories    
    function separateCategoryLists() {
        let restructuredData = [];
        categories.forEach((category) => {
            const categoryList = data["data"].filter(item => item.category == category);
            restructuredData[category] = categoryList;
        })
        return restructuredData;
    }

    // Return markup for each categories items
    function buildItemMarkup(category) {
        const data = separateCategoryLists();
        return (
            <ul>
                {data[category].map((item, index) => (
                    <li key={index} id={item.id}>
                        <div>
                            <p className='item-name'>Name: {item.name.toUpperCase()}</p>
                            <p>Description: {item.description}</p>
                            <p>Common Locations: {JSON.stringify(item.common_locations, (key, value) => value === null ? "None Listed" : value, ' ').replace(/]|[[]/g, '').replace(/"/g, '')}</p>
                        </div>
                        { /* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image} alt="Image"/>
                    </li>
                ))}
            </ul>
        );
    }

    return (
        <main>
            <Head>
                <title>Brad Cranford - Tears of the Kingdom Compendium</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <header className="wrapper">
                <h1>Tears of the Kingdom<br />Compendium</h1>
            </header>
            <section className="content-wrapper">
                <Tabs aria-label="Categories">
                    {categories.map(category => {
                        return (
                            <Tab key={category} title={category.toUpperCase()}>
                                {buildItemMarkup(category)}
                            </Tab>
                        )
                    })}
                </Tabs>
            </section>
        </main>
    );
}