import React from 'react';

function Tile(props) {
    let inner;
    let extraStyles;

    switch(props.type) {
        case "text":
            inner = <p className="text-wrap">{props.text}</p>
            extraStyles = "bg-zinc-200";
            break;
        case "link":
            inner = <a className="w-full h-full block flex items-center justify-center" href={props.link}><p>{props.text}</p></a>
            extraStyles = "bg-sky-200 hover:bg-sky-300 transition-all";
            break;
    }

    return (
        <div className={`w-24 h-24 rounded-lg text-wrap truncate flex justify-center items-center text-center ${extraStyles}`}>
            {inner}
        </div>
    );
}

export default Tile;