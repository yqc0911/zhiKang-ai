
import bannerImage from '../assets/bannerImg.png'

const Banner = () => {
    return (
        <div
            className="animate-fade-up w-full h-120 mb-3 bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: `url(${bannerImage})`,
                animationDuration: '1s',
            }}
        />
    )
}

export default Banner