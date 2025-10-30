import React from 'react'
import { IoLogOut } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const Header2 = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
      };
      const userLog = JSON.parse(localStorage.getItem('user'));
    const externalClient = () => {
        return (
            <>
                <div className='d-none d-xl-block d-lg-block d-md-none d-sm-none'>
                    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#4BC0C0' }}>
                        <div className="container-fluid" >
                            <div className='row header-image' style={{ boxShadow: '0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02)', width: '200px' }}>
                                <img src='logo.png' />
                            </div>
                            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                </ul>
                                <form className="d-flex">
                                    <button onClick={handleLogout} className="btn logout-btn" style={{ color: 'white', marginTop: '4px' }}><IoLogOut style={{ color: 'white', fontSize: '30px', marginRight: '10px' }} />LOGOUT</button>
                                </form>
                            </div>
                        </div>
                    </nav>
                </div>
                <div className='d-block d-xl-none d-lg-none d-md-block d-sm-block'>
                    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#4BC0C0' }}>
                        <div className="container-fluid" >
                            <div className='row header-image' style={{ boxShadow: '0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02)', width: '200px' }}>
                                <img src='logo.png' />
                            </div>
                            <form className="d-flex">
                                <button onClick={handleLogout} className="btn logout-btn" style={{ color: 'white', marginTop: '4px' }}><IoLogOut style={{ color: 'white', fontSize: '30px', marginRight: '10px' }} />LOGOUT</button>
                            </form>
                        </div>
                    </nav>
                </div>
            </>
        )
    }
    const isExternalClient = userLog && userLog.user_roles.includes("Client");
    return (
        <>
        { isExternalClient && externalClient()}
        </>
  )
}

export default Header2