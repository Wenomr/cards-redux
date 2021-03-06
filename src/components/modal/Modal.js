import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { uploadPic, saveCard, toggleModal } from '../../actions'
import './Modal.css';

const Modal = () => {

    const buffer = useSelector(state => state.buffer);
    const show = useSelector(state => state.showModal);

    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [filled, setFilled] = useState(false);

    const fileInput = useRef(null);

    const dispatch = useDispatch();

    useEffect(() => {
        if (!buffer.img) {
            setFilled(false);
        }
    }, [ buffer ]);

    const uploadImage = (event) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.result) {
                dispatch(uploadPic(reader.result));
                setFilled(true);
            } else {
                alert();
            }
        }
        reader.readAsDataURL(event.target.files[0]);
    }

    const showImage = () => {
        if (!filled) {
            return(
                <div className="input-box"
                    onClick = {() => { fileInput.current.click() }}>
                    <i>FILE</i>
                    <span>select an image file to upload here</span>
                    <label>
                        <input type="file"
                        ref={fileInput}
                        id="myfile"
                        onChange = {(e) => uploadImage(e)}/>
                    </label>
                </div>
            )
        } else {
            let image = buffer.img;
            return (
                <div className="img-container">
                    <img className='image' src={image} alt='...'/>
                    <button className="img-btn"
                    onClick={() => {
                        setFilled(false);
                    }}>Delete</button>
                </div>
            )
        }
    }

    const saveNewCard = () => {
        
        let card = {
            id: null,
            title: title,
            desc: desc,
            image: buffer.img
        };

        if (!card.image || !card.title || !card.desc) {
            let alertMessage = '';
            if (!card.image) alertMessage = `${alertMessage} Choose image for your card!\n`;
            if (!card.title) alertMessage = `${alertMessage} Enter title for your card!\n`;
            if (!card.desc) alertMessage = `${alertMessage} Enter description for your card!\n`;
            alert(alertMessage);
        } else {
            setFilled(false);
            setDesc("");
            setTitle("");

            dispatch(saveCard(card));
        }
    }

    if (!show) {
        return null;
    } else {
        return (
            <div className='modal-container'>
                <div className="modal">
                    <div className='row end'>
                        <a  href = '!#'
                            className="top-button" 
                            onClick = {
                                (e) => { e.preventDefault();
                                dispatch(toggleModal()) 
                            }}>Close</a>
                    </div>
                    <div className="modal-info card-list">
                        <h1 className = "modal-header">Add new</h1>

                        {showImage()}

                        <div className="input-group">
                            <label className="label">Title</label>
                            <input className="modal-input input" 
                                placeholder="Enter title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value) }/>
                        </div>

                        <div className="input-group">
                            <label className="label">Description</label>
                            <textarea rows="3" className="modal-textarea input"
                                placeholder="Enter description"
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}/>
                        </div>

                        <div className='row center'>
                            <button 
                                className="button button-save"
                                onClick = {() => {saveNewCard()}}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Modal;