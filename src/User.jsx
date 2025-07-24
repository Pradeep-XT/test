import { useEffect, useRef } from "react";
import { useParams, useSearchParams  } from "react-router-dom";



function User(){
    
    const { id } = useParams()
    const [ searchParams ] = useSearchParams();


    const name = searchParams.get("name") || "Guest";
    const age = searchParams.get("age") || "99";


    return (
        <>        
        <h1>Hi User {id}</h1>
        <h1>THis is me {name}</h1>
        <h1>THis is me {age}</h1>

        </>

    )
}



export default User;
