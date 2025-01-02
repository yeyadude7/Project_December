import React, { useState } from 'react';

function FriendSearchBar({ items, searchBy }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = items.filter((item) => {
    const searchValue = item[searchBy].toLowerCase();
    return searchValue.includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
      />
      <ul>
        {filteredItems.map((item) => (
          <li key={item.id}>{item.name}</li> // Assuming each item has an 'id' and 'name' property
        ))}
      </ul>
    </div>
  );
}

export default FriendSearchBar;