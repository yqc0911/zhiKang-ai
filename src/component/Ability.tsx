//核心功能区域开发
import { Card } from 'antd';

const { Meta } = Card;

interface AbilityProps {
    titleContent?: string;
}

const Ability = ({ titleContent = '核心功能' }: AbilityProps) => {
    return (
        <div className="mx-auto mt-8">
            <div className="title font-bold text-center tracking-[.5rem]">
                {titleContent}
            </div>
            <div className="abilityBox flex justify-between mt-8 mb-8">
                {/* 标签一 */}
                <Card
                    className='w-[280px] h-[164px] overflow-hidden'
                    hoverable
                    cover={
                        <img
                            className="h-[100px] w-full object-cover"
                            draggable={false}
                            alt="example"
                            src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                        />
                    }
                >
                    <Meta title="Europe Street beat" description="www.instagram.com" />
                </Card>
                {/* 标签二 */}
                <Card
                    className='w-[280px] h-[164px] overflow-hidden'
                    hoverable
                    cover={
                        <img
                            className="h-[100px] w-full object-cover"
                            draggable={false}
                            alt="example"
                            src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                        />
                    }
                >
                    <Meta title="Europe Street beat" description="www.instagram.com" />
                </Card>
                {/* 标签三 */}
                <Card
                    className='w-[280px] h-[164px] overflow-hidden'
                    hoverable
                    cover={
                        <img
                            className="h-[100px] w-full object-cover"
                            draggable={false}
                            alt="example"
                            src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                        />
                    }
                >
                    <Meta title="Europe Street beat" description="www.instagram.com" />
                </Card>

                {/* 标签四 */}
                <Card
                    className='w-[280px] h-[164px] overflow-hidden'
                    hoverable
                    cover={
                        <img
                            className="h-[100px] w-full object-cover"
                            draggable={false}
                            alt="example"
                            src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                        />
                    }
                >
                    <Meta title="Europe Street beat" description="www.instagram.com" />
                </Card>

            </div>
        </div>
    )
}

export default Ability