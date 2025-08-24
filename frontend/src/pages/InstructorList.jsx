import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import  './AppIns.css'
export default function InstructorList() {
    const [instructors, setInstructors] = useState([]);

    useEffect(() => {
        fetch("http://localhost:4000/api/instructors")
            .then(res => res.json())
            .then(data => setInstructors(data));
    }, []);

    return (
        <div className={'container'}  style={{background:"grey"}}>
            <h2>Instructors</h2>
            <ul>

                {instructors.length >0 ? instructors.map(inst => (
                    <li key={inst._id}>
                        <Link to={`/dashboard/instructor/${inst._id}`}>
                            {inst.firstName} {inst.lastName} <img src={inst.image} className={"round "} height={20} width={20} /> - ⭐ {inst.rating.toFixed(1)}
                        </Link>
                    </li>
                )) :  <p>no instructor </p>}
            </ul>
        </div>
    );
}
