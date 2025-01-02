import React from 'react';

import Tag from '../../components/Tag/tag.jsx';

// Profile card for users in friends page
function ProfileCard(props) {
    return (
      <div className="rounded-3xl overflow-hidden border-1 bg-white shadow-md w-1/3 max-sm:w-full max-md:w-3/5 relative">
        <div className="w-full">
          <div className="absolute right-2 top-2 flex gap-2">
            <Tag text={props.compatability + "%"} color="blue" />
            {props.leader === true ? <Tag text="Leader" color="yellow" /> : null}
          </div>
        </div>
        <div className={`w-full h-32 outline-none bg-[#${props.bannerColor}]`} href={props.profilePicture}></div>
        <div className="px-3 py-3">
          <div className="flex items-center justify-between gap-10">
            <p className="font-bold text-xl text-zinc-800">{props.name}</p>
            <Tag text={props.connections + " connections"} />
          </div>
          <p className="text-zinc-500">
            {props.major} '{props.graduationYear}
          </p>
          <p className="text-zinc-500 font-medium my-3">{props.classes}</p>
          <div className="flex gap-2">
            {props.interests.map((element, key) => {
              return <Tag text={element} key={key} />;
            })}
          </div>
        </div>
      </div>
    );
}

export default ProfileCard;