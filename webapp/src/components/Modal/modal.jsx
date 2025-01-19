import React from 'react';

function Modal(props) {
    return (
        !props.show ? null :
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center">
            <div className="relative bg-white w-[800px] h-fit rounded-xl shadow-lg">
                <div className="text-3xl flex justify-start border-b-1 p-4">
                    <h1>{props.title}</h1>
                    <button className="text-xl absolute top-2 right-4" onClick={props.handleClose}>X</button>
                </div>
                <div className="p-4 flex justify-center">
                    {props.children}
                </div>
            </div>
        </div>
    );
}

export default Modal;