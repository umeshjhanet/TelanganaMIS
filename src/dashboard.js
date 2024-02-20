import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCol, CCardHeader, CRow } from '@coreui/react'
import { CChartBar,CChartDoughnut,CChartLine,CChartPie,CChartPolarArea,CChartRadar} from '@coreui/react-chartjs'
import Header from './Components/Header';

import './App.css';
import Footer from './Footer';

const Dashboard = () => {
  const [data2,setData2] = useState();

  const random = () => Math.round(Math.random() * 100)

  let API = "http://ip-api.com/json/42.108.26.152"
  const fetchAPIData = async(url) => {
    try {
      const res = await fetch(url);
      const data = await res.json();
      // console.log(data);
      // console.log(data.city);
      setData2(data);
    }
    catch (error) {
      console.log(error);
    }
  }
  
  useEffect((data) => {
    fetchAPIData(API);
    
  }, [])
  // console.log("actual data", data2.city)
  return (
    <>
    <Header/>
      <div className='container-fluid'>
      <div className='row'>
        <div className='col-lg-2'></div>
        <div className='col-lg-10'>
        <div className='container-fluid'>
        <div className='row'>
          <p className='mt-1 fw-bold' style={{ color: '#4BC0C0', fontSize: '20px' }}>Dashboard</p>
        </div>
        <div className='row'>
          <div className='col-md-6 col-sm-12'>
            <CCard className="mb-4" style={{ marginLeft: '0px', marginRight: '0px' }}>
              <h4 className='ms-1'>Cumulative Report</h4>
              <h5 className='ms-1'>All Location: Files</h5>
              <CCardBody>
                <CChartBar
                  data={{
                    labels: ['Export pdf', 'Client QA Pending', 'Client QA', 'CBSL QA', 'Scanned', 'Recieved'],
                    datasets: [
                      {
                        label: 'No. of Files',
                        backgroundColor: '#f87979',
                        data: [2054, 11260, 187, 11447, 304442, 328307],
                      },
                    ],
                  }}
                  labels="months"
                />
              </CCardBody>
            </CCard>
          </div>
          <div className='col-md-6 col-sm-12' >
            <CCard className="mb-4" style={{ marginLeft: '0px', marginRight: '0px' }}>
            <h4 className='ms-1'>Cumulative Report</h4>
              <h5 className='ms-1'>All Location: Images</h5>
              <CCardBody>
                <CChartBar
                  data={{
                    labels: ['Export pdf', 'Client QA Pending', 'Client QA', 'CBSL QA', 'Scanned'],
                    datasets: [
                      {
                        label: 'No. of Images',
                        backgroundColor: '#E78895',
                        data: [214276, 798357, 47440, 845797, 53353729],
                      },
                    ],
                  }}
                  labels="months"
                />
              </CCardBody>
            </CCard>
          </div>
        </div>
        <div className='row'>
          <div className='table-card'>
            <div className='row'>
              <div className='card' style={{ padding: '5px', backgroundColor: '#4BC0C0' }}>
                <h6 className='text-center' style={{ color: 'white' }}>PROJECT UPDATE OF SCANNING AND DIGITIZATION OF CASE RECORDS FOR DISTRICT COURT OF UTTAR PRADESH</h6>
              </div>
            </div>
            <div className='row mt-5 ms-2 me-2' style={{overflowX:'auto'}}>
              <table class="table table-hover table-bordered table-responsive data-table" >
                <thead style={{ color: '#4BC0C0' }}>
                  <tr>
                    <th rowspan="2">Sr. No.</th>
                    <th rowspan="2">Location</th>
                    <th colspan="2">Scanned (04-02-2024)</th>
                    <th colspan="2">Scanned (05-02-2024)</th>
                    <th colspan="2">Scanned (06-02-2024)</th>
                    <th colspan="2">Cumulative till date</th>
                    <th rowspan="2">Remarks</th>
                  </tr>
                  <tr>
                    <th>Files</th>
                    <th>Images</th>
                    <th>Files</th>
                    <th>Images</th>
                    <th>Files</th>
                    <th>Images</th>
                    <th>Files</th>
                    <th>Images</th>
                  </tr>
                </thead>
                <tbody style={{ color: 'gray' }}><tr>
                  <td>1</td>
                  <td>Agra District Court</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                  <td>11,974</td>
                  <td>3,668,877</td>
                  <td></td>
                </tr>
                  <tr>
                    <td>2</td>
                    <td>Allahabad District Court</td>
                    <td>7</td>
                    <td>1,258</td>
                    <td>3,104</td>
                    <td>206,489</td>
                    <td>0</td>
                    <td>0</td>
                    <td>138,277</td>
                    <td>23,529,570</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>Bagpat District Court</td>
                    <td>0</td>
                    <td>0</td>
                    <td>18</td>
                    <td>4,128</td>
                    <td>0</td>
                    <td>0</td>
                    <td>2,045</td>
                    <td>287,496</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>Bareilly District Court</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>21,104</td>
                    <td>2,780,750</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td>Chandauli District Court</td>
                    <td>0</td>
                    <td>0</td>
                    <td>17</td>
                    <td>2,040</td>
                    <td>0</td>
                    <td>0</td>
                    <td>1,090</td>
                    <td>105,090</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>6</td>
                    <td>Etah District Court</td>
                    <td>0</td>
                    <td>0</td>
                    <td>628</td>
                    <td>89,123</td>
                    <td>0</td>
                    <td>0</td>
                    <td>1,935</td>
                    <td>255,579</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>7</td>
                    <td>Gautam Buddha Nagar District Court</td>
                    <td>0</td>
                    <td>0</td>
                    <td>222</td>
                    <td>23,678</td>
                    <td>0</td>
                    <td>0</td>
                    <td>13,337</td>
                    <td>1,948,024</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>8</td>
                    <td>Ghaziabad District Court</td>
                    <td>138</td>
                    <td>34,533</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>20,416</td>
                    <td>3,077,606</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>9</td>
                    <td>Kanpur Dehat District Court</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>12,946</td>
                    <td>2,776,294</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>10</td>
                    <td>Kanpur Nagar District Court</td>
                    <td>0</td>
                    <td>0</td>
                    <td>743</td>
                    <td>200,250</td>
                    <td>0</td>
                    <td>0</td>
                    <td>6,837</td>
                    <td>1,633,888</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>11</td>
                    <td>Kasganj District Court</td>
                    <td>0</td>
                    <td>0</td>
                    <td>65</td>
                    <td>10,949</td>
                    <td>0</td>
                    <td>0</td>
                    <td>343</td>
                    <td>59,464</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>12</td>
                    <td>Kaushambi District Court</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>763</td>
                    <td>116,711</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>13</td>
                    <td>Lalitpur District Court</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>2,347</td>
                    <td>283,086</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>14</td>
                    <td>Lucknow District Court</td>
                    <td>0</td>
                    <td>0</td>
                    <td>534</td>
                    <td>53,178</td>
                    <td>0</td>
                    <td>0</td>
                    <td>13,086</td>
                    <td>2,964,812</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>15</td>
                    <td>Meerut District Court</td>
                    <td>50</td>
                    <td>16,634</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>6,647</td>
                    <td>2,517,910</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>16</td>
                    <td>Rae Bareli District Court</td>
                    <td>0</td>
                    <td>0</td>
                    <td>319</td>
                    <td>40,328</td>
                    <td>0</td>
                    <td>0</td>
                    <td>30,347</td>
                    <td>4,535,681</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>17</td>
                    <td>Shravasti District Court</td>
                    <td>0</td>
                    <td>0</td>
                    <td>192</td>
                    <td>24,656</td>
                    <td>0</td>
                    <td>0</td>
                    <td>2,655</td>
                    <td>150,887</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>18</td>
                    <td>Siddharthnagar  District Court</td>
                    <td>0</td>
                    <td>0</td>
                    <td>286</td>
                    <td>31,999</td>
                    <td>0</td>
                    <td>0</td>
                    <td>18,293</td>
                    <td>2,662,004</td>
                    <td></td>
                  </tr>
                  <tr style={{ color: 'black' }}>
                    <td colspan="2"><strong>Total</strong></td>
                    <td><strong>195</strong></td>
                    <td><strong>52,425</strong></td>
                    <td><strong>6,128</strong></td>
                    <td><strong>686,818</strong></td>
                    <td><strong>0</strong></td>
                    <td><strong>0</strong></td>
                    <td><strong>304,442</strong></td>
                    <td><strong>53,353,729</strong></td>
                    <td></td>
                  </tr>
                </tbody>

              </table>
            </div>
             
          </div>
        </div>
        {/* <div className='row'>
        <h4>IP Address Details:</h4>
          <table className='table-bordered' style={{width:'400px'}}>
            <thead>
              <tr>
                <th>City:</th>
                <td>{data2.city}</td>
              </tr>
              <tr>
                <th> Country:</th>
                <td>{data2.country}</td>
              </tr>
              <tr>
                <th>Country Code:</th>
                <td>{data2.countryCode}</td>
              </tr>
              <tr>
                <th> ISP:</th>
                <td>{data2.isp}</td>
              </tr>
              <tr>
                <th>Query:</th>
                <td>{data2.query}</td>
              </tr>
              <tr>
                <th>Region:</th>
                <td>{data2.region}</td>
              </tr>
              <tr>
                <th>Region Name:</th>
                <td>{data2.regionName}</td>
              </tr>
              <tr>
                <th>Timezone: </th>
                <td>{data2.timezone}</td>
              </tr>
            </thead>
          </table>
          
        </div> */}
      </div>
      
        </div>
      </div>
      </div>
     <Footer/>
    </>
  )
}

export default Dashboard
