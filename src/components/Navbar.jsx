import { useAuth0 } from "@auth0/auth0-react"
import { Link } from "react-router-dom";

const Navbar=()=>{
    const {user,loginWithRedirect, isAuthenticated,logout}=useAuth0();
    return(
        <>
<section className="navbar_sec">
    {isAuthenticated &&
    <>
      <p style={{cursor:"pointer"}}>{user?.name}</p>
   <Link to='/map-page'>   <p style={{cursor:"pointer"}}>Go To Map Page</p></Link>
      </>

    }
    {isAuthenticated?(
        <>
   <button onClick={()=>logout({returnTo:window.location.origin})}>Logout</button>

        
        </>
    ):<>
        <button onClick={()=>loginWithRedirect()}>Log in</button>
    
    </>}

</section>
        </>
    )
}
export default Navbar