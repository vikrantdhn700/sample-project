import React from "react";
import HeaderMenu from './HeaderMenu';
export const MainLayout = ({children}) => {
    return(
        <>
        <div className="container">
        <div className="row clearfix">
            <div className="col-lg-12">
                <HeaderMenu/> 
                <div className="card chat-app">
                    {children}
                </div>
            </div>
        </div>
        </div>
        </>
    )
}

