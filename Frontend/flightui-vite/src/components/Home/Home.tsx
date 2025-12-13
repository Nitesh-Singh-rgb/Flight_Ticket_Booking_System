import { useEffect } from 'react'

import video from '../../assets/video.mp4'
import aeroplane from '../../assets/aeroplane.webp'

import Aos from 'aos'
import 'aos/dist/aos.css'
import Search from '../Search/Search';
import Lounge from '../Lounge/Lounge';
import Info from '../Info/Info';
import Support from '../Support/Support';
import Travelers from '../Travelers/Travelers'

const Home = () => {

    useEffect(() => {
        Aos.init({ duration: 2000 })
    }, [])

    return (
        <>
            <div className='home flex container'>

                <div className="mainText">
                    <h1 data-aos='fade-up' data-aos-duration='2500' >Start Planning Your Next Trip With Us</h1>
                </div>

                <div className="homeImages flex">

                    <div className="videoDiv">
                        <video src={video} autoPlay muted loop className='video'></video>
                    </div>

                    <img src={aeroplane} className='plane' />
                </div>
            </div>
            <Search />
            <Support />
            <Info />
            <Lounge />
            <Travelers />
        </>
    )
}

export default Home
