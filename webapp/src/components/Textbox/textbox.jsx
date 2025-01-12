import React from 'react';

function Textbox(props) {
    return (
        <div className="flex flex-col mb-1 w-full gap-1">
            <label className="text-xl font-bold" htmlFor={props.name}>{props.label}</label>
            <p className="text-sm text-zinc-600 mb-2">{props.description}</p>
            <input type="text" className="border-1 rounded-md pt-[0.6rem] pb-[0.6rem] pl-[1rem] pr-[1rem] active:border-sky-600" id={props.name} name={props.name} onChange={props.onChange}></input>
        </div>
    );
}

export default Textbox;