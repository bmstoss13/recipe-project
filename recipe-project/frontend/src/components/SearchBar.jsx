import React, {useState} from 'react';
import { FaSearch } from "react-icons/fa";
import '../styles/SearchBar.css';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(query);
    };

    return (
            <form onSubmit={handleSubmit} className="search-bar">
                <input 
                    type="text"
                    placeholder="Search recipes..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit"><FaSearch /></button>
            </form>
    );
};

export default SearchBar;