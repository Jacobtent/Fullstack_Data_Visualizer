//
// Project 2
// Jacob Tennant
// 12/6/2024
//
import React, { useState, useEffect } from 'react';
import './App.css';
import Editor from './Editor.js';
import MenuBar from './MenuBar.js';
import { Box, Container } from "@mui/system";
import Item from './Item.js';
import axios from 'axios';
import { BarChart, PieChart, ScatterChart } from '@mui/x-charts';

function App() {
  const [data, setData] = useState([]); // Example default
  const [dataName, setDataName] = useState('Untitled Dataset'); // Dataset name
  const [isInitialized, setIsInitialized] = useState(false); // Track initialization
  const [xName, setxName] = useState('x axis');
  const [yName, setyName] = useState('y axis');
  // Arrays for clipboard, currently selected points, and undo
  const [clipboard, setClipboard] = useState([]);
  const [selectedPoints, setSelectedPoints] = useState([]);
  const [history, setHistory] = useState([]);

  // Fetch data from the database on component initialization
  useEffect(() => {
    if (!isInitialized) {
        // Set the component as initialized
        setIsInitialized(true);
        // Set the document title
        document.title = 'Project 2: jacobtent97';
    }
  }, [isInitialized]);

  // Handle File Interactions
  function loadSave(saveSelect) {
    // If new, reset current dataset to empty
    if (saveSelect === 'new') {
      setData([]);
      setDataName('Untitled Dataset');   
      setHistory([]);   
    }

    // Handle the load command
    else if (saveSelect === 'load') {
      console.log('fetching file...');
      // Take in the specified file name
      const datasetName = prompt('Enter the name of the dataset to load: ');
      // Send get request through axios to findByName route
      axios.get(`http://localhost:3000/db/findByName/${datasetName}`)
        .then((res) => {
          // If there is a dataset, update name and data
          if (res.data) {
            console.log("Fetched datasets: ", res.data);
            const loadedData = res.data.dataset.data;
            setData(loadedData);
            setDataName(res.data.dataset.title);
            setHistory([]);
            updateAxes(loadedData);
          }
          // Else, report not found
          else {
            console.error('Dataset not found.');
          }
        })
        .catch((err) => console.error('Error loading dataset', err));
    }

    // Handle the save command
    else if (saveSelect === 'save') {
      // Create a dataset object from name and data
      setDataName(prompt('Enter a new name for the dataset: '));
      const dataset = { fileName: dataName, dataset: { title: dataName, data: data} };
      // Send axios post request to the backend with the new dataset object
      axios.post('http://localhost:3000/db/save', dataset)
        .then((res) => {
          alert('Data saved successfully.');
          console.log('Save response: ', res.data);
        })
        .catch((err) => console.err('Error saving dataset: ', err));
    }

    // Handle the saveAs command
    else if (saveSelect === 'saveAs') {
      // Get specified name for new dataset
      setDataName(prompt('Enter a new name for the dataset: '));
      const newDatasetName = prompt('Enter a new name for the file: ');
      if (newDatasetName) {
        // If valid, update name and send axios post request with new dataset
        setDataName(newDatasetName);
        const dataset = { fileName: newDatasetName, dataset: { title: dataName, data: data} };
        axios.post('http://localhost:3000/db/save', dataset)
          .then((res) => {
            alert('Data saved successfully.');
            console.log('Save As response: ', res.data);
          })
          .catch((err) => console.error('Error saving dataset', err));
      }
    }
  }

  // Function that handles save, load, save as, new
  function handleSelect(action) {
    loadSave(action);
  }

  function handleSetData(newData) {
    const newHistory = [...history, data];
    setHistory(newHistory);
    setData(newData);
    
  }

  // Function that handles the updating of axes
  function updateAxes(updatedData) {
    if (updatedData.length > 0) {
      setxName(Object.keys(updatedData[0])[0]);
      setyName(Object.keys(updatedData[0])[1]);
    } else {
      setxName('x axis');
      setyName('y axis');
    }
  }

  // Function that handles cut, copy, paste, undo
  function handleModPoint(action) {
    // Make new history with current data
    const newHistory = [...history, data];
    console.log(data);

    // Handle cut function: set clipboard to selected points
    //  remove selected points from data
    //  clear selected points
    if (action === 'cut') {
      setClipboard([...selectedPoints]);
      setData(data.filter((_, index) => !selectedPoints.includes(index)));
      setSelectedPoints([]);
      // Update history with new history
      setHistory(newHistory); 
    }

    // Handle copy function: add selected points to clipboard
    else if (action === 'copy') {
      // Empty clipboard before appending to avoid duplicates
      setClipboard([...selectedPoints]);
    }

    // Handle paste function: add clipboard to data
    else if (action === 'paste') {
      const newData = [...data];
      // setData([...data, ...clipboard.map(index => data[index])]);
      for (const index in clipboard) {
        if (history[history.length - 1][index]) {
          newData.push(history[history.length - 1][index]);
        }
      }
      setData(newData);
      setSelectedPoints([]);
      // Update history with new history
      setHistory(newHistory); 
    }

    // Handle undo function: revert data to previous, set
    else if (action === 'undo') {
      if (history.length > 0) {
        // Get the last saved state of history list and set data
        setData(history[history.length - 1]);
        // Remove last entry in history
        setHistory(history.slice(0, -1));
      }
      setSelectedPoints([]);
    }
  }

  // Select a point with the corresponding ID
  function handleSelectPoint(id) {
    // If the point is selected already, remove it from the list
    const isSelected = selectedPoints.includes(id);
    if (isSelected) {
      setSelectedPoints(selectedPoints.filter((point) => point !== id));
    }

    // Append point to selected points list
    else {
      setSelectedPoints([...selectedPoints, id]);
    }
    console.log(data);
  }

  // Function to determine color of point
  function getPointColor(id) {
    // If included, return red. Else, return blue
    return selectedPoints.includes(id) ? 'red' : 'blue';
  }

  // Gets the given key to a function
  function getPointKey(id) {
    return Object.values(data[id])[0];
  }

  return (
    <div className="App">
      <MenuBar onSelect={handleSelect} onMod={handleModPoint} />
      <Container className="App" sx={{ padding: 0, margin: 0, maxWidth: 'none', width: '100%', maxHeight: '100%' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', width: '100vw', height: '100vh' }}>
          <Item>
            <Editor onClick={handleSetData} data={data} />
          </Item>
          <Item>
            <BarChart
              xAxis={[{ 
                scaleType: 'band',
                data: data.map((_, index) => index),
                label: xName,
                colorMap: {
                  type: "ordinal",
                  colors: data.map((_, index) => getPointColor(index))
                } 
              }]}
              yAxis={[{ label: yName }]}
              series={[{ 
                data: data.map((point) => Object.values(point)[1])
              }]}
              width={1000}
              height={800}
              onItemClick={(_, d) => handleSelectPoint(d.dataIndex)}
              barLabel={(point) => getPointKey(point.dataIndex)}
              // sx={{ bgcolor: 'white', width: '100%', height: '100%' }}
              >
              </BarChart>
          </Item>
          <Item>
            <PieChart
              series={[{
                data: data.map((point, index) => ({
                  id: Object.values(point)[0],
                  value: Object.values(point)[1],
                  color: getPointColor(index)
                })),
                arcLabel: (point) => `${point.id}`
              },
              ]}
              width={1000}
              height={800}
              onItemClick={(_, d) => handleSelectPoint(d.dataIndex)}
              >
            </PieChart>
          </Item>
          <Item>
            <ScatterChart
              series={[{
                data: data.map((point, index) => ({
                  x: index,
                  y: Object.values(point)[1],
                })),
                // colors: data.map((point, index) => getPointColor(index))
              }
                ,]}
                yAxis={[{ label: yName, tickInterval: 1, }]}
                xAxis={[{ 
                  label: xName, 
                  colorMap: {
                    type: "ordinal",
                    colors: data.map((_, index) => getPointColor(index))
                  }  
                }]}
                width={1000}
                height={800}
                onItemClick={(_, d) => handleSelectPoint(d.dataIndex)}
              >
            </ScatterChart>
          </Item>
        </Box>
      </Container>
    </div>
  );
}

export default App;
