import Typography from '@mui/material/Typography';
import {StarSigns} from "../StarSign.ts";
import {Button} from "@mui/material";
import {useState} from "react";
import {DateFormatter} from "../DateFormatter.ts";

export default function AdminPage() {
    const now = new Date();
    const nowStr = DateFormatter.exec(now, "yyyyMMdd")
    const [text, setText] = useState(nowStr);
    const [uris, setURIs] = useState("");

    const onClick = () => {
        (async () => {
            const targetDate = new Date(
                Number(text.substring(0, 4)),
                Number(text.substring(4, 6)) - 1,
                Number(text.substring(6, 8))
            )
            const starSigns = StarSigns.get();
            let t = [];
            for(let i = 0; i < starSigns.length; i++){
                const ret = await starSigns[i].getMetaData(targetDate);
                t.push('"' + ret["image"] + '"');
            }
            const x = t.join(",");
            setURIs("[" + x + "]");
        })();
    };

    return (
        <>
            <Typography variant="h3" align="center">
                今日のNFT
            </Typography>
            <hr style={{height: "1px", backgroundColor: "black"}} />
            <div style={{margin : "50px"}}></div>
            <input
                value={text}
                onChange={(event) => setText(event.target.value)}
            />
            <div style={{margin: "10px"}}></div>
            <Button
                variant="outlined"
                onClick={onClick}
            >
                set_Token_URIs
            </Button>
            <div></div>
            {uris}
        </>
    )
}
