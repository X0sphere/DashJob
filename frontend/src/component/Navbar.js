import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import axios from 'axios';
import isAuth, { userType } from "../lib/isAuth";
import logo from "../img/Screenshot 2024-05-08 220513.png";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  logo: {
    width: 150, // Adjust width as needed
    height: 'auto', // Maintain aspect ratio
    marginRight: theme.spacing(1), // Adjust margin as needed
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    fontFamily: 'Reklame Script Medium, cursive',
    flexGrow: 1,
    fontSize: 37,
  },
  loginSignupContainer: {
    marginLeft: 'auto',
  },
}));

const Navbar = () => {
  const classes = useStyles();
  const history = useHistory();
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const formData = new FormData();
      formData.append("pdf_content", selectedFile);
      formData.append("job_description", "Sample Job Description");
      formData.append("prompt", "Enter your prompt here");

      axios.post('http://localhost:5001/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(response => {
        console.log('Analysis response:', response.data);
        alert('File analyzed successfully!');
      })
      .catch(error => {
        console.error('Analysis error:', error);
        alert('Failed to analyze the file.');
      });
    }
  };

  const handleAnalyzeClick = () => {
    document.getElementById('fileInput').click();
  };

  return (
    <AppBar position="fixed" style={{ backgroundColor: '#000000' }}>
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
        <img src={logo} alt="Logo" className={classes.logo} />
          {/* <b>DashJob </b> */}
        </Typography>
        <div className={classes.loginSignupContainer}>
          {!isAuth() && (
            <>
              <Button color="inherit" onClick={() => history.push("/login")}>
                Login
              </Button>
              <Button color="inherit" onClick={() => history.push("/signup")}>
                Signup
              </Button>
            </>
          )}
        </div>
        {isAuth() && (
          <>
            <Button color="inherit" onClick={() => history.push("/home")}>
              Jobs
            </Button>
            <Button color="inherit" onClick={() => history.push("/analyze")}>
                Analyze
            </Button>
            {userType() === "recruiter" ? (
              <>
                <Button color="inherit" onClick={() => history.push("/addjob")}>
                  Add Jobs
                </Button>
                <Button color="inherit" onClick={() => history.push("/myjobs")}>
                  My Jobs
                </Button>
                <Button color="inherit" onClick={() => history.push("/employees")}>
                  Employees
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" onClick={() => history.push("/applications")}>
                  Applications
                </Button>
              </>
            )}
            <Button color="inherit" onClick={() => history.push("/profile")}>
              Profile
            </Button>
            <Button color="inherit" onClick={() => history.push("/logout")}>
              Logout
            </Button>
          </>
        )}
        <input
          type="file"
          id="fileInput"
          style={{ display: 'none' }}
          onChange={handleFileChange}
          accept=".pdf"
        />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
