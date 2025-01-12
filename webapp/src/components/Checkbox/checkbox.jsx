import React from 'react';

function Checkbox(props) {
    return (
        <div onClick={props.handleClick} className={"border-1 rounded-xl h-fit cursor-pointer transition-all duration-200 flex flex-col justify-center items-center pt-3 pb-3 pl-3 pr-3 " + (props.active ? "border-sky-600 bg-sky-100" : "")}>
            <input className={"cursor-pointer border-none text-black " + (props.description ? "text-xl" : "")} type="button" name={props.name} value={props.displayName}/>
            {props.description ? <p className="cursor-pointer text-sm text-zinc-600">{props.description}</p> : null}
        </div>
    );
}

export default Checkbox;