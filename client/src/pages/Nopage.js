import React from "react";
import HeaderMenu from '../common/HeaderMenu';
const NoPage = () => {
    return (
      <div className="main-container">
        <div className="row clearfix">
          <div className="col-lg-12">
            <HeaderMenu/>
          </div>
        </div>
        <div className="row clearfix">
            <div className="col-lg-12">Error : 404 Page not found.</div>
        </div>      
      </div>
    )
}

export default NoPage;