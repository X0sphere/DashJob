import React, { useState } from 'react';
import axios from 'axios';
import {
    Button, Grid, Typography, Paper, TextField,
    FormControl, InputLabel, Select, MenuItem,
    CircularProgress, Box
} from '@material-ui/core';

function ResumeAnalyzer() {
    const [file, setFile] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [promptType, setPromptType] = useState('about_resume');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [resumeUrl, setResumeUrl] = useState('');

    const handleFileChange = event => {
        setFile(event.target.files[0]);
    };

    const handleJobDescriptionChange = event => {
        setJobDescription(event.target.value);
    };

    const handlePromptChange = event => {
        setPromptType(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('pdf_content', file);
        formData.append('job_description', jobDescription);
        formData.append('prompt_type', promptType);
        // formData.append('userId', userId); 
        setIsLoading(true);
    
        try {
            const response = await axios.post('http://localhost:5001/analyze', formData);
            setResponse(response.data.response);
            setResumeUrl(response.data.resumeUrl || '');
            alert('Analysis successful!');
        } catch (error) {
            // Initialize a default error message
            let errorMessage = 'An unexpected error occurred.';
    
            // Check if the error is an Axios error with a response
            if (error.response) {
                // Check if `statusText` exists on the response object
                const { status, statusText } = error.response;
    
                // Build a more specific error message
                errorMessage = `Request failed with status ${status}: ${statusText || 'Unknown error'}`;
            } else if (error.message) {
                // Handle cases where only a general error message is available
                errorMessage = `Request error: ${error.message}`;
            }
    
            console.error('Error:', error);
            alert(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };
    

    return (
        <Grid container item direction="column" alignItems="center" style={{ padding: "30px", minHeight: "93vh" }}>
            <Grid item>
                <Typography variant="h2" component="h1" gutterBottom>
                    <b>Analyze Resume</b>
                </Typography>
            </Grid>
            <Paper style={{ padding: "20px", width: "80%" }}>
                <form onSubmit={handleSubmit}>
                    <Grid item xs={12} style={{ marginBottom: "20px" }}>
                        <TextField
                            type="file"
                            fullWidth
                            onChange={handleFileChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} style={{ marginBottom: "20px" }}>
                        <TextField
                            label="Job Description"
                            multiline
                            rows={4}
                            fullWidth
                            value={jobDescription}
                            onChange={handleJobDescriptionChange}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} style={{ marginBottom: "20px" }}>
                        <FormControl fullWidth>
                            <InputLabel>Choose Prompt</InputLabel>
                            <Select
                                value={promptType}
                                onChange={handlePromptChange}
                                label="Choose Prompt"
                            >
                                <MenuItem value="about_resume">About the Resume</MenuItem>
                                <MenuItem value="improve_skills">Improve Skills</MenuItem>
                                <MenuItem value="keywords_missing">Keywords Missing</MenuItem>
                                <MenuItem value="percentage_match">Percentage Match</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
                        {isLoading ? <CircularProgress size={24} /> : "Analyze"}
                    </Button>
                </form>
                {response && (
                    <Box mt={2}>
                        <Typography variant="h6">Analysis Result:</Typography>
                        <Typography>{response}</Typography>
                    </Box>
                )}
                {resumeUrl && (
                    <Box mt={2}>
                        <Typography variant="h6">Download Analyzed Resume:</Typography>
                        <a href={resumeUrl} download>Click here to download</a>
                    </Box>
                )}
            </Paper>
        </Grid>
    );
}

export default ResumeAnalyzer;
