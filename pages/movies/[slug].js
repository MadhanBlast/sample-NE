import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useFetchData from '@/hooks/useFetchData';
import { FaBookmark, FaCheck, FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
import { FaShareFromSquare } from 'react-icons/fa6';

export default function MoviesPost() {
    const router = useRouter();
    const { slug } = router.query;

    // Fetch data
    const { alldata, loading, error } = useFetchData(`/api/getmovies?slug=${slug}`);
    const { allmovie } = useFetchData('/api/getmovies');
    const publishedData = Array.isArray(alldata) ? alldata.filter(ab => ab.status === "publish") : [];
    
    // Dynamic size adjustments for the poster
    const smPosterStyles = {
        width: '200px', // Adjust width as needed
        height: 'auto', // Maintain aspect ratio
        borderRadius: '8px', // Optional styling for rounded corners
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Optional shadow effect
    };

    return (
        <>
            <Head>
                {/* Add dynamic title if needed */}
            </Head>
            <div>
                <div className="slideimagebx">
                    <img
                        src={alldata && alldata?.[0]?.bgposter}
                        alt="Background Poster"
                        loading="lazy"
                        style={{ width: '100%', height: 'auto' }} // Background image style
                    />
                </div>
                <div className="mainmoviebx">
                    


                    <div className='rightdata'>
                        <div className='movietitle'>
                            <h1>{alldata && alldata[0]?.slug.replaceAll('-', ' ').toUpperCase()}</h1>

                        </div>

                        <div className='moviedescription'>
                            <article className='movieinfo'>

                            <div className='name-photo'>
                            <img
                                src={alldata && alldata[0]?.smposter}
                                alt="Poster"
                                loading="lazy"
                                style={smPosterStyles} // Apply dynamic styles
                            /></div>

                                <table>
                                    <tbody>
                                        <tr className="white-row">
                                            <td >&#9642; Name:</td>
                                            <td >{alldata && alldata[0]?.title.replaceAll('-', ' ').toUpperCase()}</td>
                                        </tr>
                                        <tr className="white-row">
                                            <td>&#9642; Total Episodes:</td>
                                            <td >{alldata && alldata[0]?.episodes}</td>
                                        </tr>
                                        <tr className="white-row">
                                            <td>&#9642; Duration:</td>
                                            <td >{alldata && alldata[0]?.duration}</td>
                                        </tr>
                                        <tr className="white-row">
                                            <td >&#9642; Release Year:</td>
                                            <td className="white-row">{alldata && alldata[0]?.year}</td>
                                        </tr>
                                        <tr className="white-row">
                                            <td >&#9642; Genre:</td>
                                            <td >{alldata && alldata[0]?.genre.join(', ')}</td>
                                        </tr>
                                        <tr className="white-row">
                                            <td >&#9642; Language:</td>
                                            <td >{alldata && alldata[0]?.language}</td>
                                        </tr>
                                        <tr className="white-row">
                                            <td >&#9642; Subtitle:</td>
                                            <td >{alldata && alldata[0]?.subtitle}</td>
                                        </tr>
                                        <tr className="white-row">
                                            <td>&#9642; Size:</td>
                                            <td >{alldata && alldata[0]?.size}</td>
                                        </tr>
                                        <tr className="white-row">
                                            <td>&#9642; Quality:</td>
                                            <td >{alldata && alldata[0]?.quality}</td>
                                        </tr>

                                        <tr className="white-row">
                                            <td >&#9642; Format:</td>
                                            <td>MKV</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </article>
                            <article>
                                <div className='storyline'>
                                    <h3 style={{
                                        fontSize: '18px',
                                        borderBottom: '2px solid white',  /* Creates a white line below the text */
                                        paddingBottom: '5px',              /* Increases space between text and the line */
                                        marginBottom: '20px'               /* Increases space between the line and the paragraph */
                                    }}>
                                        SYNOPSIS :
                                    </h3>
                                    <p>{alldata && alldata[0]?.description}</p>
                                </div>

                            </article>
                            <section className='downloadsec'>
                                <h2>TG_DOWNLOADS</h2>

                                <div className='downloadlinks2'>
                                    {alldata && alldata[0]?.downloadlink['ep1'] && (
                                        <a target='_blank' href={alldata[0].downloadlink['ep1']}>EP01</a>
                                    )}
                                    {alldata && alldata[0]?.downloadlink['ep2'] && (
                                        <a target='_blank' href={alldata[0].downloadlink['ep2']}>EP02</a>
                                    )}
                                    {alldata && alldata[0]?.downloadlink['ep3'] && (
                                        <a target='_blank' href={alldata[0].downloadlink['ep3']}>EP03</a>
                                    )}
                                    {alldata && alldata[0]?.downloadlink['ep4'] && (
                                        <a target='_blank' href={alldata[0].downloadlink['ep4']}>EP04</a>
                                    )}
                                    {alldata && alldata[0]?.downloadlink['ep5'] && (
                                        <a target='_blank' href={alldata[0].downloadlink['ep5']}>EP05</a>
                                    )}
                                    {alldata && alldata[0]?.downloadlink['ep6'] && (
                                        <a target='_blank' href={alldata[0].downloadlink['ep6']}>EP06</a>
                                    )}
                                    {alldata && alldata[0]?.downloadlink['ep7'] && (
                                        <a target='_blank' href={alldata[0].downloadlink['ep7']}>EP07</a>
                                    )}
                                    {alldata && alldata[0]?.downloadlink['ep8'] && (
                                        <a target='_blank' href={alldata[0].downloadlink['ep8']}>EP08</a>
                                    )}
                                    {alldata && alldata[0]?.downloadlink['ep9'] && (
                                        <a target='_blank' href={alldata[0].downloadlink['ep9']}>EP09</a>
                                    )}
                                    {alldata && alldata[0]?.downloadlink['ep10'] && (
                                        <a target='_blank' href={alldata[0].downloadlink['ep10']}>EP10</a>
                                    )}
                                    {alldata && alldata[0]?.downloadlink['ep11'] && (
                                        <a target='_blank' href={alldata[0].downloadlink['ep11']}>EP11</a>
                                    )}
                                    {alldata && alldata[0]?.downloadlink['ep12'] && (
                                        <a target='_blank' href={alldata[0].downloadlink['ep12']}>EP12</a>
                                    )}
                                    {alldata && alldata[0]?.downloadlink['ep13'] && (
                                        <a target='_blank' href={alldata[0].downloadlink['ep13']}>EP13</a>
                                    )}
                                    {alldata && alldata[0]?.downloadlink['ep14'] && (
                                        <a target='_blank' href={alldata[0].downloadlink['ep14']}>EP14</a>
                                    )}
                                    {alldata && alldata[0]?.downloadlink['ep15'] && (
                                        <a target='_blank' href={alldata[0].downloadlink['ep15']}>EP15</a>
                                    )}
                                    {alldata && alldata[0]?.downloadlink['ep16'] && (
                                        <a target='_blank' href={alldata[0].downloadlink['ep16']}>EP16</a>
                                    )}
                                    {alldata && alldata[0]?.downloadlink['ep17'] && (
                                        <a target='_blank' href={alldata[0].downloadlink['ep17']}>EP17</a>
                                    )}
                                    {alldata && alldata[0]?.downloadlink['ep18'] && (
                                        <a target='_blank' href={alldata[0].downloadlink['ep18']}>EP18</a>
                                    )}
                                    {alldata && alldata[0]?.downloadlink['ep19'] && (
                                        <a target='_blank' href={alldata[0].downloadlink['ep19']}>EP19</a>
                                    )}
                                    {alldata && alldata[0]?.downloadlink['ep20'] && (
                                        <a target='_blank' href={alldata[0].downloadlink['ep20']}>EP20</a>
                                    )}
                                    {alldata && alldata[0]?.downloadlink['ep21'] && (
                                        <a target='_blank' href={alldata[0].downloadlink['ep21']}>EP21</a>
                                    )}
                                    {alldata && alldata[0]?.downloadlink['ep22'] && (
                                        <a target='_blank' href={alldata[0].downloadlink['ep22']}>EP22</a>
                                    )}
                                    {alldata && alldata[0]?.downloadlink['ep23'] && (
                                        <a target='_blank' href={alldata[0].downloadlink['ep23']}>EP23</a>
                                    )}
                                    {alldata && alldata[0]?.downloadlink['ep24'] && (
                                        <a target='_blank' href={alldata[0].downloadlink['ep24']}>EP24</a>
                                    )}
                                    {alldata && alldata[0]?.downloadlink['ep25'] && (
                                        <a target='_blank' href={alldata[0].downloadlink['ep25']}>EP25</a>
                                    )}
                                    {alldata && alldata[0]?.downloadlink['ep26'] && (
                                        <a target='_blank' href={alldata[0].downloadlink['ep26']}>EP26</a>
                                    )}
                                    {alldata && alldata[0]?.downloadlink['ep27'] && (
                                        <a target='_blank' href={alldata[0].downloadlink['ep27']}>EP27</a>
                                    )}
                                    {alldata && alldata[0]?.downloadlink['ep28'] && (
                                        <a target='_blank' href={alldata[0].downloadlink['ep28']}>EP28</a>
                                    )}
                                    {alldata && alldata[0]?.downloadlink['ep29'] && (
                                        <a target='_blank' href={alldata[0].downloadlink['ep29']}>EP29</a>
                                    )}
                                    {alldata && alldata[0]?.downloadlink['ep30'] && (
                                        <a target='_blank' href={alldata[0].downloadlink['ep30']}>EP30</a>
                                    )}
                                </div>
                                <div className='downloadlinks'>
                                    {alldata && alldata[0]?.downloadlink['480p'] && (
                                        <a target='_blank' href={alldata[0].downloadlink['480p']}>Batch Files 480p</a>
                                    )}
                                    {alldata && alldata[0]?.downloadlink['720p'] && (
                                        <a target='_blank' href={alldata[0].downloadlink['720p']}>Batch Files 720p</a>
                                    )}
                                    {alldata && alldata[0]?.downloadlink['1080p'] && (
                                        <a target='_blank' href={alldata[0].downloadlink['1080p']}>Batch Files 1080p</a>
                                    )}
                                    {alldata && alldata[0]?.downloadlink['4k'] && (
                                        <a target='_blank' href={alldata[0].downloadlink['4k']}>Batch Files 4K</a>
                                    )}
                                </div>

                            </section>

                        </div>
                    </div>
                    
                </div>
            </div>
        </>
    );
}
