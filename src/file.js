import React, { useEffect, useState } from 'react'
import Header from './Components/Header'
import Footer from './Footer'

const File = () => {
  const [blrData, setBLRData] = useState();
  useEffect(() => {
    const fetchData = () => {
      fetch("http://localhost:3001/users")
      .then(response => response.json())
      .then(data => setBLRData(data))
      .catch(error => console.error(error))
      console.log("Data",blrData);
      
    }
    fetchData();
    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, [])
  if(!blrData)
  return(
<>Loading...</>
    )
  return (
    <>
    <Header/>
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-2'></div>
        <div className='col-10'>
         <table className='table-bordered'>
          <thead>
            <tr>
              <th>Inventory Id</th>
              <th> Anchal Code</th>
           </tr>
          </thead>
          <tbody>
            {blrData.slice(0,10).map((elem,index)=>(
              <tr key={index}>
                <td>{elem.InventoryID}</td>
                <td>{elem.AnchalCode}</td>
            </tr>
            ))}
          </tbody>
         </table>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  )
}

export default File