import {DateFormatter} from "./DateFormatter.ts";

const startSignNames = [
    "aries", "taurus", "gemini", "cancer", "leo", "virgo",
    "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"];

const startSignNamesJp = [
    "おひつじ座", "おうし座", "ふたご座", "かに座", "しし座", "おとめ座",
    "てんびん座", "さそり座", "いて座", "やぎ座", "みずがめ座", "うお座"];

export class StarSigns {
    public static get(): StarSign[]{
        const result = [];
        for (let i = 0; i < startSignNames.length; i++){
            result.push(new StarSign(i));
        }
        return result;
    }
}

export class StarSign {
    index: number;

    constructor(i: number) {
        this.index = i;
    }

    public getIndex(): number{
        return this.index;
    }

    public toString(){
        return startSignNames[this.index];
    }

    public toLocalizedString(){
        return startSignNamesJp[this.index];
    }

    public async getMetaData(date: Date){
        const baseURI = "https://astar.s3.ap-northeast-1.amazonaws.com/";
        const dateStr = DateFormatter.exec(date, "yyyy-MM-dd")
        const uri = `${baseURI}${this.toString()}_${dateStr}_metadata.json`
        const response = await fetch(
            uri,
            {
                mode: "cors",
            });
        return await response.json();
    }
}
