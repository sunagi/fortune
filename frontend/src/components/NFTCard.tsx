export default function NFTCard(props: any) {
    return <>
        <img
            src={props.uri}
            alt={props.uri}
            loading="lazy"
        />
    </>
}
