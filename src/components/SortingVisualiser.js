import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const ArrayContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  height: 200px;
  margin-bottom: 20px;
  background-color: #f2f2f2;
`;

const ArrayBar = styled.div`
  width: 10px;
  margin: 0 1px;
  background-color: ${({ ishighlighted }) =>
    ishighlighted ? 'green' : '#007bff'};
  height: ${({ value }) => `${value}px`};
`;


const SortingVisualizer = () => {
  const [array, setArray] = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const arrayContainerRef = useRef(null);
  const [numItems, setNumItems] = useState(50);

  useEffect(() => {
    resetArray();
  }, []);

  const resetArray = () => {
    // Generate a new random array
    const newArray = [];
    for (let i = 0; i < numItems; i++) {
      newArray.push(getRandomInt(5, 200));
    }
    setIsSorting(false);
    setArray(newArray);
  };

  const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const bubbleSort = async () => {
    const arr = [...array];
    const n = arr.length;
    setIsSorting(true);

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        // Highlight the items being compared
        setArray((prevArray) => {
          const updatedArray = prevArray.map((item, index) => {
            if (index === j || index === j + 1) {
              return { value: item.value, ishighlighted: true };
            } else {
              return item;
            }
          });
          return updatedArray;
        });

        await sleep(5); // Delay between each step 

        if (arr[j] > arr[j + 1]) {
          // Swap the elements
          let temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          setArray([...arr]); // Update the array state
        }

        // Remove the highlighting after the comparison
        setArray((prevArray) => {
          const updatedArray = prevArray.map((item, index) => {
            if (index === j || index === j + 1) {
              return { value: item.value, ishighlighted: false };
            } else {
              return item;
            }
          });
          return updatedArray;
        });
      }
    }
    setIsSorting(false);
  };

  const insertionSort = async () => {
    const arr = [...array];
    const n = arr.length;
    setIsSorting(true);

    for (let i = 1; i < n; i++) {
      const key = arr[i];
      let j = i - 1;

      while (j >= 0 && arr[j] > key) {
        arr[j + 1] = arr[j];
        j--;

        await sleep(10); 

        setArray([...arr]); // Update the array state after each swap
      }

      arr[j + 1] = key;
      setArray([...arr]); // Update the array state after each comparison
    }
    setIsSorting(false);
  };

  const mergeSort = async (arr) => {
    const n = arr.length;

    if (n <= 1) {
      return arr;
    }

    const mid = Math.floor(n / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);

    const sortedLeft = await mergeSort(left);
    const sortedRight = await mergeSort(right);

    return merge(sortedLeft, sortedRight);
  };

  const merge = async (left, right) => {
    const mergedArray = [];
    let i = 0;
    let j = 0;

    while (i < left.length && j < right.length) {
       

      if (left[i] < right[j]) {
        mergedArray.push(left[i]);
        i++;
      } else {
        mergedArray.push(right[j]);
        j++;
      }

      await sleep(20); 
      setArray([...mergedArray, ...left.slice(i), ...right.slice(j)]); 
    }

     

    return [...mergedArray, ...left.slice(i), ...right.slice(j)];
  };

  const mergeSortHandler = async () => {
    setIsSorting(true);
    const sortedArray = await mergeSort(array);
    setArray(sortedArray);
    setIsSorting(false);
  };

  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  const handleNumItemsChange = (e) => {

    const { value } = e.target;
    
    setNumItems(Number(value));
    resetArray();
  };
  return (
    <div>
      <ArrayContainer>
        {array.map((item, idx) => (
          <ArrayBar
            key={idx}
            ishighlighted={item.ishighlighted}
            style={{ height: `${item}px` }}
          />
        ))}
      </ArrayContainer>

      
      <button onClick={resetArray} disabled={isSorting}>Reset Array</button>
      <button onClick={bubbleSort} disabled={isSorting}>Bubble Sort</button>
      <button onClick={insertionSort} disabled={isSorting}>  Insertion Sort </button>
      <button onClick={mergeSortHandler} disabled={isSorting}>        Merge Sort      </button>



      <div>
        <label htmlFor="numItems">Number of Items:</label>
        <input
          type="range"
          id="numItems"
          name="numItems"
          min="1"
          max='100'
          value={numItems}
          onChange={handleNumItemsChange}
          disabled={isSorting}
        />
      </div>

    </div>
  );
};

export default SortingVisualizer;
