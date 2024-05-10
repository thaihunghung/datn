import React, { useState } from 'react';

const AddRubric = ()=> {
    const [divs, setDivs] = useState([]);

    const addDiv = () => {
      const newDivs = [...divs, { id: divs.length }];
      setDivs(newDivs);
    };

    const removeDiv = (id) => {
      const filteredDivs = divs.filter((div) => div.id !== id);
      setDivs(filteredDivs);
    };

    return (
        <>
          <button onClick={addDiv}>Add Div</button>
            {divs.map((div) => (
              <div key={div.id}>
                <span>Div {div.id}</span>
                <button onClick={() => removeDiv(div.id)}>Remove</button>
              </div>
          ))}
        </>
      );
}

export default AddRubric;