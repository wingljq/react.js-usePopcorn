import { useRef } from 'react';
import { useKey } from './useKey';

export function Search({ query, setQuery, clearQuery }) {

    //useRef
    const inputEl = useRef(null);
    // useKey("Enter", function () {
    //   if (document.activeElement === inputEl.current) return;
    //   inputEl.current.focus();
    //   setQuery("");
    // });

    useKey("Enter", function () {

      // if input element is already focus. don;t do anything
      if(document.activeElement === inputEl.current) return;

        console.log(`Hi, you HIT 'Enter' :D\n`);
        inputEl.current.focus();
        setQuery('');
    
      }


  )
  
    return (
      <input
        className="search"
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={
            //(e) => console.log(`e.target.value: ${e.target.value}`)
            (e) => setQuery(e.target.value)
        }
    //    onKeyDown={ (e) =>  {
    //         if (e.code === 'Enter') {
    //             setQuery('')
    //         } 
    //     }}
        ref={inputEl}
        />
      );
};