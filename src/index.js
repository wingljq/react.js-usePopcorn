import React from 'react';
import {useState} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import StarRating from './StarRating';
// function Test() {
//   const [movieRating, setMovieRating] = useState(0);
//   return (
//     <div>
//       <StarRating color="blue" maxRating={10} onSetRating={setMovieRating} />
//       <p> This movies was rated {movieRating} star</p>
//     </div>
//   );
// }

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRating
      maxRating={10}
      message={[
        'Terrible',
        'Bad',
        'Not too Bad',
        'Okay',
        'Fair',
        'Good',
        'Very Good',
        'Great',
        'Excellent',
        'Masterpiece',
      ]}
    />
    <StarRating size={24} color="red" className="test" defaultRating={3} />
    <Test /> */}
    {/* <StarRating /> */}
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
