import React from 'react';

function StickyNavbar() {
    return (
        <div className="fixed bottom-0 w-svw h-20 flex justify-center items-center border-t-1 border-zinc-200">
            <div className="w-full bg-white/80 gap-1 h-full flex justify-evenly backdrop-blur-md max-w-screen-md px-4">
                <NavbarButton text="Discover" href=""/>
                <NavbarButton text="Events" href="events"/>
                <div className="flex justify-center items-center">
                    <button className="pb-1 bg-highlight h-12 w-12 text-3xl rounded-full text-white hover:brightness-150 transition-all">+</button>
                </div>
                <NavbarButton text="Connect" href="connect"/>
                <NavbarButton text="Profile" href="mainprofile" />
            </div>
        </div>
    );
}

function NavbarButton(props) {
    const handleClick = () => {
        window.location.href = `/${props.href}`;
    };

    // Stylizes the button depending on if it is the active page
    const getTextStyles = () => {
        let commonStyles = "transition-all text-lg";
        
        if (window.location.pathname.split("/")[1] === props.href) {
            return commonStyles.concat(" text-highlight hover:brightness-150");
        } else {
            return commonStyles.concat(" text-zinc-800 hover:text-zinc-400");
        }
    }

    return (
        <button onClick={handleClick} className={getTextStyles()}>{props.text}</button>
    );
}

export default StickyNavbar;