import {useEffect, useState} from "react";
import Typography from '@mui/material/Typography';
import { useLocation } from "react-router-dom";
import {GeminiContract} from "../contracts/GeminiContract.ts";
import {Button} from "@mui/material";
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import CircularProgress from '@mui/material/CircularProgress';
import {StarSign} from "../StarSign.ts";
import NFTCard from "../components/NFTCard.tsx";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    backgroundColor: 'white',
    border: '2px solid white',
    boxShadow: 24,
    p: 4,
};

function Result() {
    const [result, setResult] = useState({description: "", image: ""});
    const [txURI, setTxURI] = useState("");
    const [open, setOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [openNFT, setOpenNFT] = useState(false);

    const location = useLocation();
    const search = location.search;
    const query = new URLSearchParams(search);

    const date = new Date(query.get("date") as string);
    const starSignIndex =
        parseInt(query.get("starSignIndex") as string, 10);
    const starSign = new StarSign(starSignIndex);
    const starSignName = starSign.toLocalizedString();
    const dayOfWeekName = query.get("dayOfWeekName");

    useEffect(() => {
        const fetchData = async () => {
            const r = await starSign.getMetaData(date);
            setResult({
                description: r["description"],
                image: r["image"],
            });
        }
        fetchData().catch(console.error);
    },[])

    const onClick = () => {
        (async () => {
            setErrorMessage("");
            setOpen(true);
            try{
                const geminiContract = new GeminiContract();
                const ret = await geminiContract.safeMint(date, starSignIndex);
                setTxURI("https://blockscout.com/astar/tx/" + ret["transactionHash"])
                setOpenNFT(true);
            } catch (e: any) {
                setErrorMessage(e.message);
            }
            setOpen(false);
        })();
    };

    return (
        <>
            <Typography variant="h3">
                今日のNFT
            </Typography>
            <hr style={{height: "1px", backgroundColor: "black"}} />
            <div style={{margin : "50px"}}></div>
            <Typography variant="h3">
                {date.getMonth() + 1}/{date.getDate()}({dayOfWeekName})の{starSignName}の運勢
            </Typography>
            <div style={{margin : "30px"}}></div>
            <div>{result["description"]}</div>
            <div style={{margin : "30px"}}></div>
            <Typography variant="h4">
                {starSignName}の今日のラッキーガールNFT
            </Typography>
            <Typography style={{margin: "10px"}}>
                今日の運気を上げるためのNFTを発行します
            </Typography>
            <Button
                variant="outlined"
                onClick={onClick}
            >
                発行する
            </Button>
            <Typography variant="h5" color="#ff0000">
                {errorMessage}
            </Typography>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <Typography id="transition-modal-title" variant="h6" component="h2">
                            NFTを発行中です。
                            MetaMaskの操作を完了してください。
                        </Typography>
                        <Typography
                            id="transition-modal-description"
                            sx={{ mt: 2 }}
                            style={{textAlign: "center"}}
                        >
                            <CircularProgress disableShrink />
                        </Typography>
                    </Box>
                </Fade>
            </Modal>

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openNFT}
                onClose={() => setOpenNFT(false)}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={openNFT}>
                    <Box sx={style} style={{textAlign: "center"}}>
                        <Typography id="transition-modal-title" variant="h6" component="h2">
                            ラッキーガールNFTがミントされました
                        </Typography>
                        <NFTCard uri={result["image"]}></NFTCard>
                        <div></div>
                        <a
                            href={txURI}
                            target={"_blank"}
                        >
                            トランザクションを確認する
                        </a>
                    </Box>
                </Fade>
            </Modal>
        </>
    )
}

export default Result
