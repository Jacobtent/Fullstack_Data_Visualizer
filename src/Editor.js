//
// Project 2
// Jacob Tennant
// 12/6/2024
//
import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Tooltip } from 'react-tooltip';
import './Editor.css';
import { Card, CardContent, Box, Typography } from '@mui/material';

function Editor(props) {
    const [keyName, setKeyName] = useState(['key']); // Example default
    const [valueName, setValueName] = useState(['value']); // Example default
    // Add a specified year and population to the graph
    function handleAddPoint() {
        // Handle correct naming of keys
        if (props.data.length > 0) {
            setKeyName(Object.keys(props.data[0])[0]);
            setValueName(Object.keys(props.data[0])[1]);
        }

        // Read in new values and convert to JSON object
        const dataPointYear = prompt("Enter the key: ");
        const dataPointPopulation = prompt("Enter the value: ");
        const newDataPoint = {
            [keyName]: dataPointYear,
            [valueName]: parseFloat(dataPointPopulation, 10)
        };

        // If the numbers are valid, concatenate the new point to data
        if (!isNaN(newDataPoint[valueName]) && dataPointYear.trim() !== "") {
            const newData = [...props.data, newDataPoint];
            props.onClick(newData);
        }

        // If the numbers are invalid, send error message
        else {
            alert("Invalid input. Please enter valid numbers");
        }
    }

    // Delete the desired year from the graph
    function handleDeletePoint() {
        // Read in year to remove
        const year = prompt("Point to remove: ");

        // Filter out the corresponding year
        const newData = props.data.filter((item) => item[keyName] !== year);
        props.onClick(newData);
    }

    // Function to modify a data point
    function handleModifyPoint() {
        // Prompt for the year to modify
        const yearToModify = prompt("Enter the key of the data point to modify: ");

        // Check if the year exists in the data
        const existingPoint = props.data.find(item => item[keyName] === yearToModify);
        if (!existingPoint) {
            alert("Key not found. Please enter a valid key.");
            return;
        }

        // Prompt for new population value
        const newPopulation = prompt("Enter the new value: ");
        const newPopulationParsed = parseFloat(newPopulation, 10);

        // Check if the new population value is valid
        if (isNaN(newPopulationParsed)) {
            alert("Invalid input. Please enter a valid number for the value.");
            return;
        }

        // Create a new data array with the modified value
        const newData = [];
        // Loop through existing data
        for (let i = 0; i < props.data.length; i++) {
            const item = props.data[i];
            // If a match is found, add the modified point
            if (item[keyName] === yearToModify) {
                newData.push({ [keyName]: yearToModify, [valueName]: newPopulationParsed });
            } 
            // If no match is found, add the existing point
            else {
                newData.push(item);
            }
        }

        // Update the data using the provided callback
        props.onClick(newData);
    }

    // Function to map datapoints as they are added to data
    function Population(props) {
        return (
          <div>
            <Box
            sx={{ p: 2, border: '1px dashed grey' }}>
                <p>{props.key1}: {props.year} -- {props.key2}: {props.population}</p>
            </Box>
          </div>
        );
      }

    // This contains a card with a title, containing the three buttons and the existing data points
    // Each of the buttons' clicking executes a corresponding command to edit the data points
    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                    Editor
                </Typography>
                <Stack direction="row"
                className="stack">
                    <Tooltip id="add-tooltip" />
                    <Tooltip id="delete-tooltip" />
                    <Tooltip id="modify-tooltip" />
                    <Button
                        className="AddButton"
                        data-tooltip-id="add-tooltip"
                        data-tooltip-html="Add a datapoint to the current graph"
                        data-tooltip-place="top-start"
                        onClick={handleAddPoint}>
                            Add Data Point
                    </Button>
                    <Button
                        className="DeleteButton"
                        data-tooltip-id="delete-tooltip"
                        data-tooltip-html="Delete a datapoint from the current graph"
                        data-tooltip-place="top-start"
                        onClick={handleDeletePoint}>
                            Delete Data Point
                    </Button>
                    <Button
                        className="ModifyButton"
                        data-tooltip-id="modify-tooltip"
                        data-tooltip-html="Modify a datapoint from the current graph"
                        data-tooltip-place="top-start"
                        onClick={handleModifyPoint}>
                            Modify Data Point
                    </Button>
                </Stack>
                <Stack>
                    {props.data.map(item => (
                        <Population key1={[keyName]} key2={valueName} year={Object.values(item)[0]} population={Object.values(item)[1]} />
                    ))}
                </Stack>
            </CardContent>
        </Card>
    );
};

export default Editor;