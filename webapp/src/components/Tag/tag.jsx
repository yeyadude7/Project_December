import React from 'react';

// Small tag used in profiles
function Tag(props) {
    const getColors = () => {
        switch (props.color) {
            case "yellow":
                return "bg-yellow-400 text-white";
            case "blue":
                return "bg-sky-500 text-white";
            default:
                return "bg-zinc-200 text-zinc-700";
        }
    };  

    return (
        props.placeholder ? <p className="rounded-xl w-[64px] h-[20px] bg-zinc-200 animate-pulse"></p> :
        <p className={getColors() + " text-sm px-2 rounded-xl w-fit"}>{props.text}</p>
    );
}

export default Tag;