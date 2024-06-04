import {useState, useEffect, useRef} from 'react';
import StarRating from './StarRating';
import { useMovies } from './useMovies';
import { useLocalStorageState } from './useLocalStorageState';
import { useKey } from './useKey';
import { Search } from './Search';


const tempMovieData = [
  {
    imdbID: 'tt1375666',
    Title: 'Inception',
    Year: '2010',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
  },
  {
    imdbID: 'tt0133093',
    Title: 'The Matrix',
    Year: '1999',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
  },
  {
    imdbID: 'tt6751668',
    Title: 'Parasite',
    Year: '2019',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg',
  },
];

const tempWatchedData = [
  {
    imdbID: 'tt1375666',
    Title: 'Inception',
    Year: '2010',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: 'tt0088763',
    Title: 'Back to the Future',
    Year: '1985',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const KEY = 'aabfc447';

const average = arr =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {

  //to fatch data asap when App mount
  //dont setstate in the top level of render logic!!
  // const [watched, setWatched] = useState(function(){
  //   const storedValue = localStorage.getItem("watched");
  //   return JSON.parse(storedValue)
  // });
  const tempQuery = 'interstellar';
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  //get the state by destructing the return of useMovies
  const {movies,isLoading,error}=useMovies(query,handleCloseMovies)
  const [watched,setWatched] = useLocalStorageState([],"watched")



  // useEffect(function () {
  //   console.log('After Initial render');
  // }, []);

  // useEffect(function () {
  //   console.log('After Every Render');
  // });

  // console.log('During render');

  useEffect(
    function () {
      console.log(`query:\n${query}`);
    },
    [query],
  );

  function handleSelectMovie(id) {
    setSelectedId(selectedId => (id === selectedId ? null : id));
  }

  function handleCloseMovies() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched(watched => [...watched, movie]);
  }

  function handleDeletedWatched(id) {
    setWatched(watched => watched.filter(movie => movie.imdbID !== id));
  }

  const clearQuery = () => {
    console.log('Clearing...\n');
    setQuery('');
  }
 
  //eachtime watched movies list is updated. save the data in localstorage


  // it will keep fetching data from the api because setting state in render logic will immediately cause component to re-render itself and then run the function again, fetch again then setMovie again --- infinity loop!!

  //useEffect

  //the function will only be executed on mount(first render) when using [] as dependency in useEffect
  //side effect is basically any interation between a React component and the world outside the component. also think of as a side as code that acually does something, for example Data fetching

  //side effect should not be render logic, we can build side effect in :
  //1. eventHandler: onClick, onSubmit
  //2. useEffect: need to write some code need to be executed when component initial render , and Effect allow us to write code that will run at different moment: mount,re-render, or unmount. used to keep a component synchronized with some external system

  // useEffect(function () {
  //   fetch(``)
  //     .then(res => res.json())
  //     .then(data => {
  //       console.log(data);
  //       setMovies(data.Search);
  //     });
  // }, []);

  //dependency of effect are always props and state




  useEffect(function () {
    document.addEventListener('keydown', function (e) {
      if (e.code === 'Escape') {
        handleCloseMovies();
        console.log('closing');
      }
    });
  }, [ ]);
  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} clearQuery={clearQuery} />
        <NumResult movies={movies} />
      </NavBar>

      <Main>
        {/* building compostive component by passing element as props  */}
        {/* <Box element={<MovieList movies={movies} />} />
        <Box
          element={
            <>
              <WatchSummary watched={watched} />
              <WatchedMovieList watched={watched} />
            </>
          }
        /> */}

        {/* building compostive compoent by passing element as children */}
        <Box>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
          {/* three exclusive condition */}
          {isLoading && <Loader />}

          {!isLoading && !error && (
            <MovieList movies={movies} onselectedMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovies}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onDeleteWatched={handleDeletedWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
};

function Loader() {
  return <p className="loader"> Loading </p>;
}

function ErrorMessage({message}) {
  return <p className="error">{message}</p>;
}

function NavBar({children}) {
  return <nav className="nav-bar">{children}</nav>;
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function NumResult({movies}) {
  return (
    <p className="num-results">
      Found <strong>{movies?.length}</strong> results
    </p>
  );
}





// function NumResults({ movies }) {
//   return (
//     <p className="num-results">
//       Found <strong>{movies.length}</strong> results
//     </p>
//   );
// }

    // useEffect(function(){
    //  inputEl.current.focus()
    // },[])


    //  useKey("Enter", function () {
    //   function callback(e){
    //     // if input element is already focus. don;t do anything
    //      if(document.activeElement === inputEl.current) return;
    //      if(e.code === 'Enter') {
    //        inputEl.current.focus();
    //        setQuery("")
    //      }
    //    }
     
    //     // add event listener to dom
    //    document.addEventListener("keydown",callback);
 
    //    //each initial render, execute the below the event listener
    //    return function (){
    //      document.addEventListener("keydown",callback);
    //    }
    //  });

    
    // useEffect(
    //   function () {
    //     document.addEventListener('keydown', function (e) {
    //       if (e.code === 'Enter') {
    //         inputEl.current.focus()
    //       }
    //     });
    //   },
    //   [],
    // );

    // useEffect((function(){
    //   //create a function that when press Enter, input element will be focus and clear query
    //   function callback(e){
    //    // if input element is already focus. don;t do anything
    //     if(document.activeElement === inputEl.current) return;
    //     if(e.code === 'Enter'){
    //       inputEl.current.focus()
    //       setQuery("")
    //     }
    //   }
    
    //    // add event listener to dom
    //   document.addEventListener("keydown",callback);

    //   //each initial render, execute the below the event listener
    //   return function (){
    //     document.addEventListener("keydown",callback);
    //   }

    // }),[])
      
function Main({children}) {
  return <main className="main">{children}</main>;
}

function Box({children}) {
  const [isOpen1, setIsOpen1] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen1(open => !open)}>
        {isOpen1 ? '–' : '+'}
      </button>
      {isOpen1 && children}
    </div>
  );
}

function MovieList({movies, onselectedMovie, handleCloseMovies}) {
  return (
    <ul className="list list-movies">
      {movies?.map(movie => (
        <Movie
          movie={movie}
          onselectedMovie={onselectedMovie}
          key={movie.imdbID}
          onCloseMovie={handleCloseMovies}
        />
      ))}
    </ul>
  );
}

function Movie({movie, onselectedMovie}) {
  return (
    <li onClick={() => onselectedMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

// function WatchBox({children}) {
//   const [isOpen2, setIsOpen2] = useState(true);

//   return (
//     <div className="box">
//       <button className="btn-toggle" onClick={() => setIsOpen2(open => !open)}>
//         {isOpen2 ? '–' : '+'}
//       </button>
//       {isOpen2 && children}
//     </div>
//   );
// }

function WatchSummary({watched}) {
  const avgImdbRating = average(watched.map(movie => movie.imdbRating)).toFixed(
    0,
  );
  const avgUserRating = average(watched.map(movie => movie.userRating)).toFixed(
    0,
  );
  const avgRuntime = average(watched.map(movie => movie.runtime)).toFixed(0);
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMovieList({watched, onDeleteWatched}) {
  return (
    <ul className="list">
      {watched.map(movie => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
}

function WatchedMovie({movie, onDeleteWatched}) {
  console.log(movie.runtime);

  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => {
            onDeleteWatched(movie.imdbID);
          }}>
          X
        </button>
      </div>
    </li>
  );
}

function MovieDetails({selectedId, onCloseMovie, onAddWatched, watched}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState('');


  const countRef = useRef(0)

  useEffect(function(){
    if(userRating){
      countRef.current = countRef.current + 1;
    }
   
  },[userRating])
  const isWatched = watched.map(watch => watch.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(
    movie => movie.imdbID === selectedId,
  )?.userRating;
  console.log(watchedUserRating);
  //destructing
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
    
  } = movie;

  console.log(runtime);

  function handleAdd() {
    console.log(watched);
    const newWatchedMoviews = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(' ').at(0)),
      userRating: Number(userRating),
      countRatingDecisions: countRef.current,
    };

    // my methond to check whether the selected movies is already in the watchedmovieslist:
    if (watched.length > 0) {
      const added = watched.some(watch => {
        console.log(watch.imdbID);
        return watch.imdbID === newWatchedMoviews.imdbID;
        // if (watch.imdbID === newWatchedMoviews.imdbID) {
        //   return true;
        // } else {
        //   return false;
        // }
      });
      console.log(added);
      if (added) {
        onCloseMovie();
      } else {
        onAddWatched(newWatchedMoviews);
      }
    } else {
    onAddWatched(newWatchedMoviews);
    onCloseMovie();
    }
  }

  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        console.log(selectedId);
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`,
        );
        const data = await res.json();
        console.log(data);
        setMovie(data);
        setIsLoading(false);
      }
      getMovieDetails();
    },

    [selectedId],
  );

  //update website title based on the movie title
  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      //clean up function is a return function of effect
      //when click the movie again, the the selectedID will back to null than title is unmount, than will clean up.
      //clean up function run only when the componemt is unmounted
      return function () {
        document.title = 'usePopcorn';
        console.log(title); //sitll return the title because of closure, a closere means a function will always remember all the variables that were present at the time and the place data function was created
      };
    },
    [title],
  );
  useKey('Escape',onCloseMovie)
  //i comment the below code because the error caused by node version, it function well
  // useEffect(
  //   function () {
  //     document.addEventListener('keydown', function (e) {
  //       if (e.code === 'Escape') {
  //         onCloseMovie();
  //         console.log('closing');
  //       }
  //     });
  //   },
  //   [onCloseMovie],
  // );

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="details">
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${title}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating}
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />

                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>You rated this movie {watchedUserRating} 🌟</p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
          {/* <StarRating maxRating={10} /> */}
          {/* {selectedId} */}
        </div>
      )}
    </>
  );
}
