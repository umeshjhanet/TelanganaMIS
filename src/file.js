import React from 'react'
import Header from './Components/Header'
import Footer from './Footer'

const File = () => {
  return (
    <>
    <Header/>
    <div className='container-fluid'>
        <div className='row'>
        <div className='col-lg-2 col-md-2 '></div>
        <div className='col-lg-10 col-md-9 col-sm-12'>
        <div className='row mt-4 me-1'>
              <div className='card' style={{ padding: '5px', backgroundColor: '#4BC0C0' }}>
                <h6 className='text-center' style={{ color: 'white' }}>Mis Report/Last Upload File</h6>
              </div>
            </div>
        </div>
        </div>
    </div>
    <Footer/>
    </>
  )
}

export default File