// import { useState } from 'react'
import { useState } from 'react'
import './App.css'
import { useEffect } from 'react'
import Swal from 'sweetalert2'

function App() {

  const [algorithms, setAlgorithms] = useState([
    {
      label: 'Linear Search',
      checked: true,
      timeComplexity: 'N/A'
    },
    {
      label: 'Binary Search',
      checked: true,
      timeComplexity: 'N/A'
    },
    {
      label: 'Jump Search',
      checked: true,
      timeComplexity: 'N/A'
    },
    {
      label: 'Ternary Search',
      checked: true,
      timeComplexity: 'N/A'
    },
  ])

  const [numbers, setNumbers] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const [findingIndex, setFindingIndex] = useState(null)

  const handleInputChange = (e) => {
    // const value = e.target.value;

    // // Split the input value by commas
    // const inputParts = value.split(',');

    // // Check if all parts are valid numbers or empty
    // const isValidInput = inputParts.every((part) => /^(\d+)?$/.test(part.trim()) || part.trim() === '');

    // if (isValidInput) {
    //   setInputValue(value);

    //   // Filter out empty strings and convert the valid parts to numbers
    //   const newNumbers = inputParts.filter((part) => part.trim() !== '').map((part) => parseInt(part.trim(), 10));

    //   // Update the state with the new array of numbers
    //   setNumbers(newNumbers);
    // }
    console.log(e.target.value);
    // setNumbers(e.target.value)

    setInputValue(e.target.value);
  };

  const handleCheckBox = (e, index) => {
    const tempAlgo = [...algorithms];

    tempAlgo[index] = { ...tempAlgo[index], checked: !tempAlgo[index].checked };

    setAlgorithms(tempAlgo);
  };


  const handleSearch = () => {

    setAlgorithms((prevAlgorithms) => {
      return prevAlgorithms.map((algorithm) => {
        return {
          ...algorithm,
          timeComplexity: "N/A",
        };
      });
    });

    // if (numbers.length < 1) return alert('Please provide a input string')
    if (!findingIndex) {

      Swal.fire({
        icon: "info",
        title: "Info",
        text: "Please provide a number to find!",
      });

      return
    }


    const algorithmObject = algorithms.reduce((acc, { label, checked }) => {
      acc[label] = checked;
      return acc;
    }, {});

    let data = {
      // inputString: numbers,
      inputString: Number(inputValue),
      findingElement: findingIndex,
      ...algorithmObject
    }
    console.log(data);




    const allUnchecked = algorithms.every((algorithm) => !algorithm.checked);

    if (allUnchecked) {
      Swal.fire({
        icon: "info",
        title: "Info",
        text: "Please check at least one algorithm!",
      });
      return
    }


    fetch("https://a605-2406-d00-cccf-7fd1-30f1-f42e-91c7-1b7b.ngrok-free.app", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(responseData => {
        console.log('Response from server:', responseData);

        if (
          (responseData.binary.index == -1) &&
          (responseData.jump.index == -1) &&
          (responseData.linear.index == -1) &&
          (responseData.ternary.index == -1)
        ) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Your selected number not found!",
          });

        } else {

          if (responseData.binary.index != -1) {
            setAlgorithms((prevAlgorithms) => {
              return prevAlgorithms.map((algorithm) => {
                if (algorithm.label === 'Binary Search') {
                  return {
                    ...algorithm,
                    timeComplexity: responseData.binary.searching_time.toFixed(2) + " µs",
                  };
                }
                return algorithm;
              });
            });
          }
          if (responseData.jump.index != -1) {
            setAlgorithms((prevAlgorithms) => {
              return prevAlgorithms.map((algorithm) => {
                if (algorithm.label === 'Jump Search') {
                  return {
                    ...algorithm,
                    timeComplexity: responseData.jump.searching_time.toFixed(2) + " µs",
                  };
                }
                return algorithm;
              });
            });
          }
          if (responseData.linear.index != -1) {
            setAlgorithms((prevAlgorithms) => {
              return prevAlgorithms.map((algorithm) => {
                if (algorithm.label === 'Linear Search') {
                  return {
                    ...algorithm,
                    timeComplexity: responseData.linear.searching_time.toFixed(2) + " µs",
                  };
                }
                return algorithm;
              });
            });
          }
          if (responseData.ternary.index != -1) {
            setAlgorithms((prevAlgorithms) => {
              return prevAlgorithms.map((algorithm) => {
                if (algorithm.label === 'Ternary Search') {
                  return {
                    ...algorithm,
                    timeComplexity: responseData.ternary.searching_time.toFixed(2) + " µs",
                  };
                }
                return algorithm;
              });
            });
          }
        }


      })
      .catch(error => {
        console.error('Error sending data:', error);
      });

  }


  return (
    <div className='h-screen w-screen flex flex-col'>
      <div className='inputBox flex-1 flex flex-col items-center gap-5 p-12'>

        <span className='text-2xl font-bold'>
          Time Complexity Comparison
        </span>
        <div className='flex flex-col gap-5'
          style={{ width: "50vw" }}>

          <div className='flex flex-col'>


            <label htmlFor="" className='text-sm font-bold text-gray-400'>
              Input Length
            </label>

            <input
              type="number"
              id="numberInput"
              value={inputValue}
              onChange={handleInputChange}
              // placeholder="Type numbers separated by commas"
              className='border border-slate-800 rounded p-3' />

            {/* <span className='text-xs text-red-500 font-bold'>
              Note: Input string should be comma seperated
            </span> */}
          </div>

          <div
            style={{
              // border: '1px solid red',
              width: "max-content",
              display: 'flex',
              flexDirection: 'column',
              gap: '5px'
            }}
          >
            <label htmlFor="" style={{
              fontSize: '15px',
              fontWeight: 'bold',
              color: 'darkgray'
            }}>
              Select a Number
            </label>

            <input type="number"
              style={{
                border: "1px solid black",
                borderRadius: "5px",
                padding: "10px",
              }}
              onChange={(e) => { setFindingIndex(Number(e.target.value)) }}
            />
          </div>
        </div>

        <div
          style={{
            // border: "1px solid"
          }}
        >
          {
            algorithms.map((item, index) => (
              <div
                key={index}
                style={{
                  // border: "1px solid",
                  width: '50vw'
                }}>
                <div
                  style={{
                    // border: '1px solid', 
                    display: 'flex',
                    gap: '10px'
                  }}
                >
                  <label htmlFor="binary"
                    style={{
                      // border: "1px solid green",
                      width: '150px'
                    }}
                  >
                    {item.label}
                  </label>
                  <input
                    id='binary'
                    type="checkbox"
                    checked={item.checked}
                    style={{ width: '18px', marginRight: '10px' }}
                    onChange={(e) => handleCheckBox(e, index)}
                  />

                  <div className='flex gap-4'>
                    <label >Time Elapsed:</label>
                    <span className='text-sm font-bold'>{item.timeComplexity}</span>
                  </div>
                </div>

              </div>
            ))
          }


        </div>
        <div
          style={{
            // border: '1px solid',
            width: '50vw'
          }}
        >
          <button
            className='btn bg-teal-500 text-white p-2 font-bold'
            style={{
              border: '1px solid',
              borderRadius: '5px',
              width: '10vw'
            }}
            onClick={handleSearch}
          >Search</button>
        </div>
      </div>
      {/* <div className="outputBox" style={{ flex: 1, border: '1px solid blue' }}></div> */}
    </div>
  )
}

export default App
