import { useState, useEffect } from "react";
const KEY = 'aabfc447';

export function useMovies(query,callback){
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
    useEffect(
        function () {
         
          const controller = new AbortController();
    
          async function fetchMovies() {
            try {
              setIsLoading(true);
              setError('');
              //always reset error at the begining!!
              setError('');
              const res = await fetch(
                `https://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=${query}`,
                {signal: controller.signal},
              );
    
              //catch error
              //after the error is being thrown. react will not run the below code
              if (!res.ok)
                throw new Error('Something went wrong with fetching movies');
              const data = await res.json();
              //in React strict mode, effect will run twice, therefore when console.log(data), it will console twice
              //but in production ,it wont happened if remove the strictmode
              //for no movie record found
              if (data.Response === 'False') throw new Error('Movie not found');
    
              console.log(data);
              setMovies(data.Search);
              setError('');
    
              console.log(movies); //[],still state;
            } catch (err) {
              console.log(err.message);
              if (err.name !== 'AbortError') {
                setError(err.message);
              }
            } finally {
              //alway run at the end
              setIsLoading(false);
            }
          }
    
          //when query is empty, remove all movies from the array and also reset the error back to nothing
          if (!query.length) {
            setMovies([]);
            setError('');
            return;
          }
           callback?.()
          fetchMovies();
    
          //when there is query change, the controller will abort the current fetch request to prevent download unnesscary data
          return function () {
            controller.abort();
          };
        },
        [query],
      );

      return {movies,isLoading,error}
}
