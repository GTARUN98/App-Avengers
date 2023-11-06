import React from "react";
import {Box, Typography,Button} from '@mui/material'
import {useNavigate} from 'react-router-dom'

const Navigation = ({ web3Handler, account }) => {



    const navigate = useNavigate();
	const toNavigate = (e) =>{
         //console.log(e.target.attributes)
        //  console.log(e)
        var pathArray = window.location.pathname.split('/');

        const where = e.target.attributes["value"].value

        if(pathArray[pathArray.length -1]===where){
            window.location.reload()
        }else{
        console.log(where)
       navigate(`/${where}`)
        }
    }


    return (


	<Box style={{display:'flex',backgroundColor:'#4382e8'}}>
            <Typography style={{color:'white',padding:'15px',cursor:'pointer'}}>APP AVENGER</Typography>
            <Box id="main" style={{marginLeft:'auto',display:'flex'}}>
            <div className="nav-item"><Typography   onClick={toNavigate} value='' style={{marginRight:'15px',color:'white',cursor:'pointer',padding:'15px'}}>HomePage</Typography></div>
            <Typography   value='royaltyPolicy' onClick={toNavigate} style={{marginRight:'15px',color:'white',cursor:'pointer',padding:'15px'}}>Royalty Policy</Typography>
            <Typography   onClick={toNavigate} value='create' style={{marginRight:'15px',color:'white',cursor:'pointer',padding:'15px'}}>Create</Typography>
            <Typography   onClick={toNavigate} value='my-listed-items' style={{marginRight:'15px',color:'white',cursor:'pointer',padding:'15px'}}>Listed NFT's</Typography>
            <Typography   onClick={toNavigate} value='my-purchases' style={{marginRight:'15px',color:'white',cursor:'pointer',padding:'15px'}}>My Puchases</Typography>
            <Typography   style={{marginRight:'15px',color:'white',cursor:'pointer',padding:'15px'}}>
	
	{account ? (
                            <Typography
                                href={`https://etherscan.io/address/${account}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="button nav-button btn-sm mx-4">
                                <Typography style={{color:"white"}}>
                                    {account.slice(0, 5) + '...' + account.slice(38, 42)}
                                </Typography>

                            </Typography>
                        ) : (
                            <Typography onClick={web3Handler} variant="outline-light">Connect Wallet</Typography>
                        )}


	</Typography>

            
            </Box>
        </Box>
        
    )

}

export default Navigation;