import Ability from '../component/Ability'
import Banner from '../component/Banner'
import HomePage from '../component/HomePage'
import Footer from '../component/Footer'

const Layout = () => {
    return (
        <div className="min-h-screen bg-slate-50">
            <HomePage />
            <div className="mx-auto w-5/6 max-w-7xl py-4">
                <div className="bg-white">
                    <Banner />
                    <div className="page-fade-in bg-white px-6 py-8 md:px-10">
                        <Ability />
                    </div>
                </div>
                <div className="page-fade-in mt-8 rounded-[2rem] bg-white px-6 py-8 shadow-[0_20px_60px_rgba(15,23,42,0.05)] md:px-10">
                    <Ability titleContent="健康科普资讯" />
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Layout