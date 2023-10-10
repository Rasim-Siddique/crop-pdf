import { useAuth0 } from "@auth0/auth0-react"

const Navbar=()=>{
    const {user,loginWithRedirect, isAuthenticated,logout}=useAuth0();
    return(
        <>
<section className="navbar_sec">
    {isAuthenticated &&
      <p style={{marginRight:20}}>{user?.name}</p>
    }
    {!isAuthenticated?(
        <>
        
        <button onClick={()=>loginWithRedirect()}>Log in</button>
        </>
    ):<>
   <button onClick={()=>logout({returnTo:window.location.origin})}>Logout</button>
    
    </>}

</section>
        </>
    )
}
export default Navbar