import styled from "styled-components";

export const StyledForm = styled.form`
  background-color: #121212;
  padding: 5px;
  border-radius: 5px;
`

export const StyledLabel = styled.label`
  display: block;
  text-align:left;
  margin-top: 24px;
  margin-bottom: 5px;
  margin-left: 25px;
  font-weight: 600;
  font-size: 14px;
  margin-bottom:8px;
  color: ${props => props.invalid ? 'red' : 'white'};
`
export const StyledLabelConnect = styled.label`
  display: block;
  text-align:left;
  margin-top: 24px;
  margin-bottom: 5px;
  margin-left: 19%;
  font-weight: 600;
  font-size: 14px;
  margin-bottom:8px;
  color: ${props => props.invalid ? 'red' : 'white'};
`

export const StyledInput = styled.input`
  width: 90%;
  height: 40px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  color: white;
  background:#15181C
`

export const StyledInputConnect = styled.input`
  width: 60%;
  height: 40px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  color: white;
  background:#15181C
`

export const StyledTextInput = styled.textarea`
 width: 90%;
  height: 25vh;
  padding: 8px;
  font-family:inherit;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  resize: none;
  color: white;
  background:#15181C;
`

export const StyledButton = styled.button`
  background-color: #FF3939;
  color: white;
  padding: 10px;
  margin-top: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
  }
  &:enabled {
    opacity: 1.0;
    cursor:pointer
  }
  width:70%;
  height: 63px;
  opacity: ${props => !props.enabled ? 0.5 : 1};
`

export const StyledAlert = styled.div`
  padding: 10px;
  background-color: #f44336;
  color: white;
  margin-top: 10px;
  border-radius: 5px;`



export const StyledTextInputURL = styled.div`
  display: flex;
  align-items: center;
  padding: 5px;
  width: 60%;
  border-radius: 5px;
  border: none;
  margin:auto;
  background-color:#15181C;
  justify-content: space-between; /* Added property */
`;

export const StyledInputURL = styled.input`
  border: none;
  outline: none;
  flex-grow: 1;
  width: 100%;
  height: 40px;
  padding: 10px;
  border-radius: 5px;
  color: white;
  background:#15181C;
`;

export const LogoWrapper2 = styled.div`
  margin-left: 10px; /* Adjusted margin */
`;

export const StyledBibleInput = styled.input`
  border: none;
  border-bottom: 1px solid #fff;
  outline: none;
  color:#fff;
  background:transparent;
  padding:0 0;
  margin:0;
  line-height: 1;
  width: ${(props) => props.inputwidth || '7.7px'};
  height:15px ; 
  align-self:flex-end;
  text-align:center
  font-size:10px;
  cursor: pointer;
`;
export const StyledBibleInputVerse = styled.input`
  border: none;
  border-bottom: 1px solid #fff;
  outline: none;
  color:#fff;
  background:transparent;
  padding:0 0;
  margin:0;
  line-height: 1;
  width: ${(props) => props.inputwidth || '7.7px'};
  height:15px ; 
  align-self:flex-end;
  text-align:center
  font-size:10px;
  cursor: pointer;
`;