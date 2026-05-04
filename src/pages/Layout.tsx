//页面排版组件

//引入HomePage组件
import Ability from "../component/Ability"
import Banner from "../component/Banner"
import HomePage from "./HomePage"

const Layout = () => {
    return (
        <>
            <div className="w-5/6 mx-auto">
                <HomePage />
                <Banner />
                <Ability />
                <Ability titleContent="健康科普资讯" />
            </div>
        </>
    )
}

export default Layout