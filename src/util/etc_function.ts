import moment from 'moment';


export function yesterday_getDateTime(){
    // let today = moment().format("YYYY-MM-DD");
    let start: string = moment().add("-1","d").format("YYYY-MM-DD"); 
    start = moment(start).format("YYYY-MM-DD");
    let end: string = moment().format("YYYY-MM-DD"); 
    end = moment(end).format("YYYY-MM-DD");

    return {
        start, 
        end
    }
}

//Custom field 매칭
export function matchFieldValues(data: any, id: string) {
    return data.fieldValues.map((fv: any) => {
        if(fv.id === id)
            return fv.value; // 값이 없으면 undefined로 return
    })
}

//YYYY-MM-DD
export function getToday(){
    let date = new Date();
    let year = date.getFullYear();
    let month = ("0" + (1 + date.getMonth())).slice(-2);
    let day = ("0" + date.getDate()).slice(-2);
  
    return year + "-" + month + "-" + day;
  }

