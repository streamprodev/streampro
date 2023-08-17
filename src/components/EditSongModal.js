import React, { useState } from 'react';
import LoginForm from './LoginForm';
import { useSong } from '../context/SongContext';

const EditSongModal = () => {
    const { isEditModalOpen, closeModal, handleFormSubmitEdit, title, setTitle, body, setBody } = useSong()

    const [errors, setErrors] = useState({});


    const handleSubmit = (e) => {
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length === 0) {
            handleFormSubmitEdit({ title, body });
            setTitle('');
            setBody('');
            setErrors({});
            closeModal(1)
        } else {
            setErrors(validationErrors);
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!title.trim()) {
            errors.title = 'Title is required';
        }

        if (!body.trim()) {
            errors.body = 'Body is required';
        }

        return errors;
    };

    return (
        isEditModalOpen && (
            <div className="modal" style={{ display: 'block', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', zIndex: "10" }}>
                <div className="modal-content" style={{ background: '#121212', width: '60%', margin: '100px auto', padding: '20px' }}>
                    <span className="close" onClick={() => closeModal(1)} style={{ cursor: 'pointer', float: 'right', color: '#FFFFFF', fontSize: '24px' }} >
                        &times;
                    </span>
                    <h2 style={{ color: '#FFFFFF', textAlign: "left", fontSize: '12px', fontWeight: "500px" }}>Edit Song</h2>

                    <div style={{ paddingRight: '100px', paddingLeft: '100px', paddingTop: "70px" }}>
                        <LoginForm onSubmit={handleSubmit} setTitle={setTitle} setBody={setBody} errors={errors} title={title} body={body} />

                    </div>

                </div>
            </div>
        )
    );
};

export default EditSongModal;