import React from 'react'
// import { IoCallOutline } from "react-icons/io5";
// import { IoIosMailUnread } from "react-icons/io";

const Footer = () => {
    return (
        <>
            <div className='d-none d-xl-block d-sm-none'>
                <div className='container footer'>
                    <div className='row'>
                        <div className='col-2'></div>
                        <div className='col-10 text-center'>
                        <p>© 2024 CBSLGROUP All rights reserved</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='d-block d-xl-none d-sm-block'>
                <div className='container '>
                    <div className='row'>
                        <div className='col-12 text-center'>
                            <p>© 2024 CBSLGROUP All rights reserved</p>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Footer