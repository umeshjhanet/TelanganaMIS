import React from 'react'
import Header from './Components/Header'
import ReactDatePicker from 'react-datepicker'

const Inventory = () => {
  return (
    <>
    <Header></Header>
       <div className='contianer-fluid'>
        <div className='row'>
            <div className='col-2'></div>
            <div className='col-10'>
             <ReactDatePicker/>
            </div>
        </div>
        
       </div>
        </>
  )
}

export default Inventory