import React, { useEffect, useState } from "react";
import AddReviewForm from "./AddReviewForm.jsx";
import { useParams } from "react-router-dom";
import Modal from "./Modal.jsx";
import  './AppIns.css'
import {useSelector} from "react-redux";
export default function InstructorDetails() {
    const { id } = useParams();
    const [instructor, setInstructor] = useState(null);
    const  {user}  = useSelector(state => state.profile);
    const [modalOpen, setModalOpen] = useState(false);


    useEffect(() => {
        console.log(user);
        fetch(`http://localhost:4000/api/instructors/${id}`)
            .then(res => res.json())
            .then(data => setInstructor(data));
    }, [id]);

    if (!instructor) return <p>Loading...</p>;

    return (
        <div className="container"  style={{background:"grey"}}>
            <span className={"badge badge-primary"}>me   @ email {user?.email}    <button
                className="open-modal-btn btn btn-info"
                onClick={() => setModalOpen(true)}
            >
                Add Review +
            </button></span>

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
                <AddReviewForm instructorId={id} />
            </Modal>


            <h2>{instructor.firstName} {instructor.lastName}  <img src={instructor.image} className={"rounded"} height={25}  width={30}/>  </h2>
            <p>Rating: ⭐ {instructor.rating.toFixed(1)}</p>
            <h3>Reviews:</h3>
            {instructor.reviews.length > 0 ? (
                instructor.reviews.map(r => (

                    <div key={r._id} className={"justify-content-center"}>

                        <strong>{r.user?.firstName} {r.user?.lastName}  <img src={instructor.image} className={"rounded"} height={25}  width={30}/>  </strong>
                        <p>⭐ {r.rating} - {r.comment}</p>
                    </div>
                ))
            ) : (
                <p>No reviews yet</p>
            )}

        </div>
    );
}
