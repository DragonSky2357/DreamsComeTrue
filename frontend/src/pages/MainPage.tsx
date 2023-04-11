import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import axios from "axios";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PrimarySearchAppBar from "../components/PrimarySearchAppBar";
import Mainboard from "../components/Mainbord";
import { useRecoilState } from "recoil";
import { LoginState } from "../state/LoginState";
import ImageSlide from "../components/ImageSlide";
import Gallery from "react-photo-gallery";

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const theme = createTheme();

export default function Main() {
  const [posts, setPost] = useState<any[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/post`)
      .then((response: any) => {
        setPost(response.data);
        console.log(response.data);
      });
  }, []);

  return (
    // <ThemeProvider theme={theme}>
    //   <PrimarySearchAppBar />
    //   <CssBaseline />

    //   <main>
    //     <Container sx={{ py: 8 }} maxWidth="xl">
    //       {/* End hero unit */}
    //       <Grid container spacing={4}>
    //         {posts.map((post, index) => (
    //           <Grid item key={index} xs={12} sm={6} md={4}>
    //             <Card
    //               onClick={() => navigate(`/p/${post.id}`)}
    //               sx={{
    //                 ":hover": {
    //                   cursor: "pointer",
    //                 },
    //                 height: "100%",
    //                 display: "flex",
    //                 flexDirection: "column",
    //               }}
    //             >
    //               <CardMedia
    //                 component="img"
    //                 image={post.imageUrl}
    //                 alt="random"
    //               />
    //               <CardContent sx={{ flexGrow: 1 }}>
    //                 <Typography gutterBottom variant="h5" component="h2">
    //                   {post.title}
    //                 </Typography>
    //                 <Typography>{post.bodyText}</Typography>
    //               </CardContent>
    //               <CardActions>
    //                 <Button size="small">View</Button>
    //                 <Button size="small">Edit</Button>
    //               </CardActions>
    //             </Card>
    //           </Grid>
    //         ))}
    //       </Grid>
    //     </Container>
    //   </main>

    //   {/* Footer */}
    //   <Box sx={{ bgcolor: "background.paper", p: 6 }} component="footer">
    //     <Typography variant="h6" align="center" gutterBottom>
    //       Footer
    //     </Typography>
    //     <Typography
    //       variant="subtitle1"
    //       align="center"
    //       color="text.secondary"
    //       component="p"
    //     >
    //       Something here to give the footer a purpose!
    //     </Typography>
    //   </Box>
    //   {/* End footer */}
    // </ThemeProvider>

    <div className="app">
      <PrimarySearchAppBar />
      <Mainboard posts={posts} />
    </div>
  );
}
