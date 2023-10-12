import moment from 'moment';


export function yesterday_getDateTime(){
    // let today = moment().format("YYYY-MM-DD");
    let start: string = moment().add("-1","d").format("YYYY-MM-DD"); 
    start = moment(start).format("YYYY-MM-DD");
    let end: string = moment().format("YYYY-MM-DD"); 
    end = moment(end).format("YYYY-MM-DD");
    return start;
    // return {
    //     start, 
    //     end
    // }
}

//Custom field 매칭
export function matchFieldValues(data: any, id: string) {
    let value:any
    data.fieldValues.forEach((fv: any) => {
        if (fv.id === id) {
            value = fv.value;
        }
    });
    return value;
}

//YYYY-MM-DD
export function getToday(){
    let date = new Date();
    let year = date.getFullYear();
    let month = ("0" + (1 + date.getMonth())).slice(-2);
    let day = ("0" + date.getDate()).slice(-2);
  
    return year + "-" + month + "-" + day;
}

//YYYY-MM-DD HH:00
export function getTodayTime(){
    let date = new Date();
    let year = date.getFullYear();
    let month = ("0" + (1 + date.getMonth())).slice(-2);
    let day = ("0" + date.getDate()).slice(-2);
    let hours = date.getHours();
  
    let beginDateTime =  `${year}-${month}-${day} ${hours-1}:00`
    let endDateTime =  `${year}-${month}-${day} ${hours}:00`
    return {
        beginDateTime,
        endDateTime
    }
} 

export function getTodayWithTime() {
    let date = new Date();
    let year = date.getFullYear();
    let month = ("0" + (1 + date.getMonth())).slice(-2);
    let day = ("0" + date.getDate()).slice(-2);
    let hours = ("0" + date.getHours()).slice(-2);
    let minutes = ("0" + date.getMinutes()).slice(-2);
    let seconds = ("0" + date.getSeconds()).slice(-2);

    return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
}

// 7초 대기 함수
export function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
