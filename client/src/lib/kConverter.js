export function kToC(num) {
    if (num >=1000){
        return (num/1000).toFixed(2) + "k";
    }
    else{
        return num;
    }
}