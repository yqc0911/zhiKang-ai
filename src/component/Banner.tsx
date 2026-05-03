import React from 'react';
import { Carousel } from 'antd';

const contentStyle: React.CSSProperties = {
    margin: 0,
    height: '300px',
    color: '#fff',
    lineHeight: '300px',
    textAlign: 'center',
    background: '#364d79',
   
    
};

const Banner = () => {
    return (
        <>
            <Carousel autoplay={{ dotDuration: true }} autoplaySpeed={4000} className='mt-3'>
                <div>
                    <h3 style={contentStyle}>1</h3>
                </div>
                <div>
                    <h3 style={contentStyle}>2</h3>
                </div>
                <div>
                    <h3 style={contentStyle}>3</h3>
                </div>
                <div>
                    <h3 style={contentStyle}>4</h3>
                </div>
            </Carousel>

        </>
    )
}

export default Banner