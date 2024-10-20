import React from 'react';

import { banner } from '../../assets/'

function Home() {
  return (
    <>
      <div className="container-fullid">
        <img src={ banner } className="img-fluid" alt="Banner Image" />
      </div>
      
      <div className="container justify-content-center pt-3">
        <h2 className="text-center colortextyellow">Welcome to the PuglifeHouse.</h2>
        <h4 className="text-center colortextbrown">
          A pug that will fill your life with unconditional love and joy.
        </h4>
      </div>
    </>
  );
}

export default Home;
