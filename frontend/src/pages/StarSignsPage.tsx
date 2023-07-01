import Grid from '@mui/material/Unstable_Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Link } from "react-router-dom";
import {StarSigns} from "../StarSign.ts";
import {CardActionArea} from "@mui/material";

const dayOfWeekNames = ["日", "月", "火", "水", "木", "金", "土"];

export default function StarSignsPage() {
    const starSigns = StarSigns.get();
    const date = new Date();
    const dayOfWeekName = dayOfWeekNames[date.getDay()];
    return (
        <>
            <Typography variant="h3" align="center">
                今日のNFT
            </Typography>
            <hr style={{height: "1px", backgroundColor: "black"}} />
            <div style={{margin : "50px"}}></div>
            <Typography variant="h3">
                {date.getMonth() + 1}/{date.getDate()}({dayOfWeekName})の運勢
            </Typography>
            <div style={{margin : "30px"}}></div>
            <Grid container spacing={{ xs: 3, md: 4 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                {starSigns.map((starSign, index) => (
                    <Grid xs={2} sm={4} md={4} key={index}>
                        <Card sx={{ minWidth: 275 }} style={{backgroundColor: "#00000030"}}>
                            <CardActionArea>
                                <Link
                                    to={{
                                        pathname: "/result",
                                        search: "?" + new URLSearchParams({
                                            date: date.toString(),
                                            starSignIndex: starSign.getIndex().toString(),
                                            dayOfWeekName: dayOfWeekName,
                                        }),
                                    }}
                                    style={{color: "black"}}
                                >
                                    <CardContent>
                                        <Typography variant="h5" component="div">

                                                {starSign.toLocalizedString()}
                                        </Typography>
                                    </CardContent>
                                </Link>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </>
    )
}
