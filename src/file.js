import React from 'react'
import Header from './Components/Header'
import Footer from './Footer'

const File = () => {
  return (
    <>
    <Header/>
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-2'></div>
        <div className='col-10'>
          <p>This is the file page</p>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  )
}

export default File