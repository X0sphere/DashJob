import { Grid, Typography, makeStyles } from "@material-ui/core";
import backgroundImage from "../img/8827703.jpg";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(6, 2), // Adjust padding for different screen sizes
    minHeight: "100vh",
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    textAlign: "center",
    color: "#fff",
  },
  content: {
    zIndex: 1,
  },
  title: {
    fontWeight: "bold",
    textShadow: "2px 2px 4px rgba(0,0,0,0.5)", // Add shadowing
    marginBottom: theme.spacing(2), // Add spacing below the title
  },
}));

const Welcome = ({ isLoggedIn }) => {
  const classes = useStyles();

  return (
    <Grid
      container
      className={classes.root}
      alignItems="center"
      justify="center"
    >
      <Grid item xs={12} className={classes.content}>
        <Typography variant="h3" className={classes.title} gutterBottom>
          {isLoggedIn ? "Find Job" : "Welcome to DashJob"}
        </Typography>
        {isLoggedIn ? null : (
          <Typography variant="body1" gutterBottom>
            Find your dream job and kickstart your career journey!
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export const ErrorPage = (props) => {
  return (
    <Grid
      container
      alignItems="center"
      justify="center"
      style={{ minHeight: "100vh", background: "#f0f0f0", textAlign: "center" }}
    >
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom style={{ color: "#333" }}>
          Error 404
        </Typography>
        <Typography variant="body1" gutterBottom>
          Page not found. Please return to the home page.
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Welcome;
