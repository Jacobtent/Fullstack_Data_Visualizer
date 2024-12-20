//
// Project 2
// Jacob Tennant
// 12/6/2024
//

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import './MenuBar.css';

// Menubar containing options for new, load, save as, and save file
function Menubar(props) {
  function handleButtonClick(action) {
    props.onSelect(action);
  };

  function handleMenuClick(action) {
    props.onMod(action);
  };

  // This is a menu bar with buttons for each of the file actions
  // Upon clicking, an event handler is specified through the return
  return (
    <AppBar 
    position="static"
    className="AppBar">
      <Toolbar>
        <Button sx={{ marginLeft: '2px' }} color="inherit" onClick={() => handleButtonClick('new')}>New</Button>
        <Button sx={{ marginLeft: '2px' }} color="inherit" onClick={() => handleButtonClick('load')}>Load</Button>
        <Button sx={{ marginLeft: '2px' }} color="inherit" onClick={() => handleButtonClick('save')}>Save</Button>
        <Button sx={{ marginLeft: '2px' }} color="inherit" onClick={() => handleButtonClick('saveAs')}>Save As</Button>
        <Button sx={{ marginLeft: '25px' }} color="inherit" onClick={() => handleMenuClick('cut')}>Cut</Button>
        <Button sx={{ marginLeft: '2px' }} color="inherit" onClick={() => handleMenuClick('copy')}>Copy</Button>
        <Button sx={{ marginLeft: '2px' }} color="inherit" onClick={() => handleMenuClick('paste')}>Paste</Button>
        <Button sx={{ marginLeft: '2px' }} color="inherit" onClick={() => handleMenuClick('undo')}>Undo</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Menubar;