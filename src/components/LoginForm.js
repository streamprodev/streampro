import React from 'react';
import { StyledForm, StyledInput, StyledButton, StyledAlert, StyledLabel, StyledTextInput } from './FormComponents';
import axios from 'axios';

function LoginForm({ onSubmit, setBody, setTitle, errors, title, body }) {
    const [songTitle, setsongTitle] = React.useState(title);
    const [songBody, setsongBody] = React.useState(body);
    const [songBodyInvalid, setsongBodyInvalid] = React.useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        // validate songBody and set songBodyInvalid state accordingly
        if (songBody.length < 8) {
            setsongBodyInvalid(true);
        } else {
            setsongBodyInvalid(false);
        }
        onSubmit({ title: songTitle, body: songBody })

    }


    const songTitleEntered = (e) => {
        setsongTitle(e.target.value);
        setTitle(e.target.value)
    }

    const songBodyEntered = (e) => {
        setsongBody(e.target.value);
        setBody(e.target.value)
    }

    return (
        <StyledForm onSubmit={handleSubmit}>
            <StyledLabel>Song Title:{errors.title ? errors.title : ""}</StyledLabel>

            <StyledInput type="text" value={songTitle} onChange={e => songTitleEntered(e)} />

            <StyledLabel invalid={songBodyInvalid}>Song Body {errors.body ? errors.body : ""}</StyledLabel>


            <StyledTextInput type="songBody" value={songBody} onChange={(e) => songBodyEntered(e)} />

            {songBodyInvalid && <StyledAlert>songBody is invalid.</StyledAlert>}
            <StyledButton type="submit" disabled={(!songTitle || !songBody) ? true : false}>Save Song</StyledButton>
        </StyledForm>
    )
}

export default LoginForm;