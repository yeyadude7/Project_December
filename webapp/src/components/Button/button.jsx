import React from 'react';

function Button(props) {
    return (
        props.active ? <button className="border-1 rounded-md pt-2 pb-2 pl-4 pr-4 mt-4 mb-4 bg-sky-600 text-white transition-all">{props.text}</button> : <button className="border-1 rounded-md pt-2 pb-2 pl-4 pr-4 mt-4 mb-4 bg-zinc-500 text-white transition-all">Continue</button>
    );
}

export default Button;